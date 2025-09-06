"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ResumeData, DesignState } from '@/lib/types';
import { defaultResumeData } from '@/lib/types';
import { produce } from 'immer';

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

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeDataState] = useState<ResumeData>(defaultResumeData);
  const [design, setDesignState] = useState<DesignState>(defaultDesign);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
        const savedResumeData = localStorage.getItem('resume-data');
        if (savedResumeData) {
            setResumeDataState(JSON.parse(savedResumeData));
        }
    } catch (e) {
        console.error("Failed to parse resume data from localStorage", e);
        setResumeDataState(defaultResumeData);
    }
    try {
        const savedDesign = localStorage.getItem('resume-design');
        if (savedDesign) {
            setDesignState(JSON.parse(savedDesign));
        }
    } catch (e) {
        console.error("Failed to parse design data from localStorage", e);
        setDesignState(defaultDesign);
    }
    
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('resume-data', JSON.stringify(resumeData));
    }
  }, [resumeData, isInitialized]);
  
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('resume-design', JSON.stringify(design));
    }
  }, [design, isInitialized]);

  const setResumeData = (fn: (draft: ResumeData) => void) => {
    setResumeDataState(produce(fn));
  };
  
  const setDesign = (fn: (draft: DesignState) => void) => {
    setDesignState(produce(fn));
  };

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
