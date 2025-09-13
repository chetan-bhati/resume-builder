
"use client";

import { useState } from 'react';
import { useResumeStore } from '@/hooks/use-resume-store.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import type { SectionId } from '@/lib/types';

const defaultSectionLabels: Record<SectionId, string> = {
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  achievements: 'Achievements',
};

export default function LayoutForm() {
  const { resumeData, setResumeData, isInitialized } = useResumeStore();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }
  
  const getSectionLabel = (sectionId: string): string => {
    if (sectionId in defaultSectionLabels) {
      return defaultSectionLabels[sectionId as SectionId];
    }
    const customSection = resumeData.customSections.find(s => s.id === sectionId);
    return customSection?.title || 'Custom Section';
  }

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, item: string) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
  };
  
  const onDrop = (e: React.DragEvent<HTMLDivElement>, targetItem: string) => {
    e.preventDefault();
    if (draggedItem === null) return;
    
    const currentIndex = resumeData.sectionOrder.indexOf(draggedItem);
    const targetIndex = resumeData.sectionOrder.indexOf(targetItem);
    
    if (currentIndex === -1 || targetIndex === -1) return;
    
    setResumeData(draft => {
      const [removed] = draft.sectionOrder.splice(currentIndex, 1);
      draft.sectionOrder.splice(targetIndex, 0, removed);
    });
    
    setDraggedItem(null);
  };

  const moveSection = (section: string, direction: 'up' | 'down') => {
    const index = resumeData.sectionOrder.indexOf(section);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= resumeData.sectionOrder.length) return;

    setResumeData(draft => {
        const [item] = draft.sectionOrder.splice(index, 1);
        draft.sectionOrder.splice(newIndex, 0, item);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Layout</CardTitle>
        <CardDescription>
          Drag and drop the sections to change their order on your resume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {resumeData.sectionOrder.map((sectionId, index) => (
            <div
              key={sectionId}
              className="flex items-center justify-between p-3 border rounded-md bg-background hover:bg-muted transition-colors cursor-grab"
              draggable
              onDragStart={(e) => onDragStart(e, sectionId)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, sectionId)}
            >
              <div className="flex items-center">
                <GripVertical className="h-5 w-5 mr-3 text-muted-foreground" />
                <span className="font-medium">{getSectionLabel(sectionId)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => moveSection(sectionId, 'up')} disabled={index === 0}>
                    <ArrowUp className="h-4 w-4" />
                </Button>
                 <Button variant="ghost" size="icon" onClick={() => moveSection(sectionId, 'down')} disabled={index === resumeData.sectionOrder.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
