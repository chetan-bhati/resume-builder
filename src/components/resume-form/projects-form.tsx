"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeDataSchema, type Project } from '@/lib/types';
import { useResumeStore } from '@/hooks/use-resume-store.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export default function ProjectsForm() {
  const { resumeData, setResumeData, isInitialized } = useResumeStore();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const form = useForm<{ projects: Project[] }>({
    resolver: zodResolver(resumeDataSchema.pick({ projects: true })),
    defaultValues: { projects: resumeData.projects },
    mode: 'onBlur'
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'projects',
  });

  useEffect(() => {
    if (isInitialized) {
      form.reset({ projects: resumeData.projects });
      setOpenItems(resumeData.projects.map(p => p.id));
    }
  }, [isInitialized]);
  
  const handleBlur = () => {
    form.trigger();
    const formData = form.getValues();
    setResumeData(draft => {
        draft.projects = formData.projects as Project[];
    });
  };
  
  const handleAddNew = () => {
    const newId = crypto.randomUUID();
    append({ id: newId, name: '', description: '' });
    setOpenItems(prev => [...prev, newId]);
  }

  const handleRemove = (index: number, id: string) => {
    remove(index);
    setOpenItems(prev => prev.filter(item => item !== id));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>Showcase your work by adding personal or professional projects.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-4" onBlur={handleBlur}>
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="w-full">
              {fields.map((field, index) => (
                <AccordionItem key={field.id} value={field.id} className="border-b-0">
                  <div className="flex justify-between items-center bg-muted p-2 rounded-t-md border">
                    <AccordionTrigger className="flex-1 text-sm font-medium py-2 text-left">
                        {form.watch(`projects.${index}.name`) || 'New Project'}
                    </AccordionTrigger>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(index, field.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  <AccordionContent className="p-4 border border-t-0 rounded-b-md">
                    <div className="space-y-4">
                      <FormField control={form.control} name={`projects.${index}.name`} render={({ field }) => ( <FormItem><FormLabel>Project Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name={`projects.${index}.url`} render={({ field }) => ( <FormItem><FormLabel>Project URL</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name={`projects.${index}.description`} render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the project..." {...field} rows={3} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button variant="outline" onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
