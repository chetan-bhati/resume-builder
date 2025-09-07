
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { ResumeData, DesignState } from '@/lib/types';
import { defaultResumeData } from '@/lib/types';
import { produce } from 'immer';
import { getResumeData, saveResumeData, getDesignState, saveDesignState } from '@/lib/firestore';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';

interface ResumeStore {
  resumeData: ResumeData;
  setResumeData: (fn: (draft: ResumeData) => void) => void;
  design: DesignState;
  setDesign: (fn: (draft: DesignState) => void) => void;
  isInitialized: boolean;
}

const ResumeContext = createContext<ResumeStore | null>(null);

const defaultDesign: DesignState = {
  template: 'modern',
  primaryColor: '#3F51B5',
  fontSize: '10',
  fontFamily: 'Inter',
};

// Debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      clearTimeout(timeout);
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeDataState] = useState<ResumeData>(defaultResumeData);
  const [design, setDesignState] = useState<DesignState>(defaultDesign);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  
  // Effect to load data when user logs in or on initial load
  useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          const [resume, design] = await Promise.all([getResumeData(user.uid), getDesignState(user.uid)]);
          setResumeDataState(resume);
          setDesignState(design);
        } catch (error) {
          console.error("Failed to load data from Firestore", error);
          toast({
            variant: 'destructive',
            title: 'Error loading data',
            description: 'Could not fetch your data from the database.'
          })
        } finally {
          setIsInitialized(true);
        }
      } else if (!user && !loading) {
        // If no user, load default data and mark as initialized
        setResumeDataState(defaultResumeData);
        setDesignState(defaultDesign);
        setIsInitialized(true);
      }
    }
    if (!isInitialized) {
      loadData();
    }
  }, [user, loading, isInitialized, toast]);

  const debouncedSaveResume = useCallback(debounce(async (userId: string | null, data: ResumeData) => {
    if (!userId) return;
    try {
      await saveResumeData(userId, data);
    } catch (e) {
      console.error("Failed to save resume data", e);
      toast({
        variant: 'destructive',
        title: 'Error saving resume',
        description: 'Your changes could not be saved to the database.'
      })
    }
  }, 1000), [toast]);

  const debouncedSaveDesign = useCallback(debounce(async (userId: string | null, data: DesignState) => {
    if (!userId) return;
    try {
      await saveDesignState(userId, data);
    } catch (e) {
      console.error("Failed to save design data", e);
       toast({
        variant: 'destructive',
        title: 'Error saving design',
        description: 'Your design changes could not be saved to the database.'
      })
    }
  }, 1000), [toast]);

  useEffect(() => {
    if (isInitialized && user) {
      debouncedSaveResume(user.uid, resumeData);
    }
  }, [resumeData, isInitialized, user, debouncedSaveResume]);
  
  useEffect(() => {
    if (isInitialized && user) {
      debouncedSaveDesign(user.uid, design);
    }
  }, [design, isInitialized, user, debouncedSaveDesign]);

  const setResumeData = (fn: (draft: ResumeData) => void) => {
    setResumeDataState(produce(fn));
  };
  
  const setDesign = (fn: (draft: DesignState) => void) => {
    setDesignState(produce(fn));
  };

  // When user signs out, reset the store to default state
  useEffect(() => {
    if(!user && isInitialized) {
        setResumeDataState(defaultResumeData);
        setDesignState(defaultDesign);
        setIsInitialized(false); // So data reloads on next login
    }
  }, [user, isInitialized]);

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, design, setDesign, isInitialized }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResumeStore() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumeStore must be used within a ResumeProvider');
  }
  return context;
}
