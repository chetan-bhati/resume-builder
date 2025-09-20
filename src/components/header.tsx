"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, LogIn, LogOut } from 'lucide-react';
import AiOptimizerDialog from './ai-optimizer-dialog';
import DesignPanel from './design-panel';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useReactToPrint } from 'react-to-print';

interface HeaderProps {
    previewRef: React.RefObject<HTMLDivElement>;
}

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.06-6.06C9.837,6.861,7.7,5.433,5.263,4.842L-0.073,8.062C1.444,10.32,3.582,12.78,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.531,44,29.898,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


export default function Header({ previewRef }: HeaderProps) {
    const { user, signInWithGoogle, signOut, loading } = useAuth();

    const print = useReactToPrint({
        // provide both content and contentRef so react-to-print validation doesn't warn
        content: () => previewRef.current,
        contentRef: previewRef,
        documentTitle: 'Resume',
        pageStyle: `
            @page { size: A4 portrait; margin: 0; }
            @media print {
              html, body { -webkit-print-color-adjust: exact; color-adjust: exact; }
              .no-print { display: none !important; }
            }
        `
    });

    const handlePrint = () => {
        if (!previewRef?.current) {
            // preview not mounted or ref not passed
            alert('Nothing to print — resume preview is not mounted.');
            return;
        }
        // pass the preview node as optional-content to the print call to avoid runtime validation errors
        print?.(() => previewRef.current);
    };

    return (
        <header className="flex items-center justify-between p-4 border-b bg-card flex-shrink-0 z-10 no-print">
            <h1 className="text-xl font-bold text-primary">ResumeForge</h1>
            <div className="flex items-center gap-2">
                {user && (
                    <>
                        <Button onClick={handlePrint}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                        <Button variant="outline" onClick={signOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                        {/* <Avatar>
                            <AvatarImage src={user.photoURL ?? undefined} />
                            <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar> */}
                    </>
                )}
                {!user && !loading && (
                    <Button onClick={signInWithGoogle}>
                        <GoogleIcon className="mr-2 h-5 w-5" />
                        Sign In with Google
                    </Button>
                )}
            </div>
        </header>
    );
}
