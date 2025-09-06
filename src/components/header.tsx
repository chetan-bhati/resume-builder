"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import AiOptimizerDialog from './ai-optimizer-dialog';
import DesignPanel from './design-panel';

interface HeaderProps {
    previewRef: React.RefObject<HTMLDivElement>;
}

export default function Header({ previewRef }: HeaderProps) {
    const handlePrint = useReactToPrint({
        content: () => previewRef.current,
        documentTitle: 'resume',
        onPrintError: (error) => console.log(error),
        pageStyle: `
        @media print {
            @page {
              size: A4;
              margin: 0;
            }
            html, body {
                height: initial !important;
                overflow: initial !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
        }`,
    });

    return (
        <header className="flex items-center justify-between p-4 border-b bg-card flex-shrink-0 z-10">
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
