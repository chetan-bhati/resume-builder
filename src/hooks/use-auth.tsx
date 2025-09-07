
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
    // This effect runs once on mount
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // This means the user has just signed in via redirect
          toast({
            title: 'Signed in!',
            description: 'You have successfully signed in.',
          });
          // The onAuthStateChanged listener above will handle setting the user and loading state
        } else {
          // This runs on normal page loads, not after a redirect
          setLoading(false);
        }
      })
      .catch((error) => {
        // Handle redirect errors
        if (error.code !== 'auth/no-redirect-operation') {
            console.error("Error during redirect result:", error);
            toast({
              variant: 'destructive',
              title: 'Sign in failed',
              description: 'Could not complete sign in after redirect. Please try again.',
            });
        }
        setLoading(false); // Ensure loading is always turned off
      });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true); // Set loading to true before redirect
      await signInWithRedirect(auth, provider);
      
    } catch (error) {
       setLoading(false); // Reset loading state on error
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
