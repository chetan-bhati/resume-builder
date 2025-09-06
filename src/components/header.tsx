
"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import AiOptimizerDialog from './ai-optimizer-dialog';
import DesignPanel from './design-panel';

interface HeaderProps {
    previewRef: React.RefObject<HTMLDivElement>;
}

export default function Header({ previewRef }: HeaderProps) {
    const handlePrint = () => {
        const printContent = previewRef.current;
        if (printContent) {
           window.print();
        }
    };

    return (
        <header className="flex items-center justify-between p-4 border-b bg-card flex-shrink-0 z-10 print:hidden">
            <h1 className="text-xl font-bold text-primary">ResumeForge</h1>
            <div className="flex items-center gap-2">
                <AiOptimizerDialog />
                <DesignPanel />
                <Button onClick={handlePrint}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </Button>
            </div>
        </header>
    );
}
