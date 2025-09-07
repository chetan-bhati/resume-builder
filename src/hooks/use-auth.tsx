
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithRedirect, 
  GoogleAuthProvider, 
  signOut, 
  type User,
  getRedirectResult
} from 'firebase/auth';
import { auth } from '@/lib/firebase-client'; // Correctly import the initialized auth instance
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          toast({
            title: 'Signed in!',
            description: 'You have successfully signed in.',
          });
        }
      })
      .catch((error) => {
        if (error.code !== 'auth/no-redirect-operation') {
            console.error("Error during redirect result:", error);
            toast({
              variant: 'destructive',
              title: 'Sign in failed',
              description: 'Could not complete sign in after redirect. Please try again.',
            });
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
       toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: `Could not sign you in with Google. ${error instanceof Error ? error.message : ''}`,
      });
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Signed out!',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      console.error("Error signing out: ", error);
       toast({
        variant: 'destructive',
        title: 'Sign out failed',
        description: 'Could not sign you out. Please try again.',
      });
    }
  };

  const value = { user, loading, signInWithGoogle, signOut: logOut };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
