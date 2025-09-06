"use client";

import React, { useRef } from 'react';
import { ResumeProvider } from '@/hooks/use-resume-store.tsx';
import ResumeForm from '@/components/resume-form';
import ResumePreview from '@/components/resume-preview';
import Header from '@/components/header';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  const previewRef = useRef<HTMLDivElement>(null);
  
  return (
    <ResumeProvider>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <Header previewRef={previewRef} />
        <main className="flex-1 grid grid-cols-1 md:grid-cols-10 overflow-hidden">
          <ScrollArea className="md:col-span-4 border-r no-print">
            <ResumeForm />
          </ScrollArea>
          <ScrollArea className="hidden md:block md:col-span-6 bg-muted" id="resume-preview-wrapper">
             <div className="p-4 sm:p-8">
               <ResumePreview ref={previewRef} />
             </div>
           </ScrollArea>
        </main>
      </div>
    </ResumeProvider>
  );
}
