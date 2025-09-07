
"use client";

import { useEffect } from 'react';
import { getAuth, getRedirectResult } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { app } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const auth = getAuth(app);
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // This is the signed-in user
          toast({
            title: 'Signed in!',
            description: 'You have successfully signed in.',
          });
        }
        // Redirect to home page after processing
        router.push('/');
      })
      .catch((error) => {
        console.error("Error during redirect result:", error);
        toast({
          variant: 'destructive',
          title: 'Sign in failed',
          description: 'Could not complete sign in after redirect. Please try again.',
        });
        router.push('/');
      });
  }, [router, toast]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Completing sign in...</p>
        </div>
    </div>
  );
}
