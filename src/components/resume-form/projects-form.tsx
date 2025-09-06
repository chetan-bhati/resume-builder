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
import { useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export default function ProjectsForm() {
  const { resumeData, setResumeData, isInitialized } = useResumeStore();

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
    }
  }, [isInitialized, resumeData.projects, form]);
  
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.projects) {
        setResumeData(draft => {
            draft.projects = value.projects as Project[];
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setResumeData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>Showcase your work by adding personal or professional projects.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-4">
            <Accordion type="multiple" defaultValue={fields.map(f => f.id)} className="w-full">
              {fields.map((field, index) => (
                <AccordionItem key={field.id} value={field.id} className="border-b-0">
                  <div className="flex justify-between items-center bg-muted p-2 rounded-t-md border">
                    <AccordionTrigger className="flex-1 text-sm font-medium py-2 text-left">
                        {form.watch(`projects.${index}.name`) || 'New Project'}
                    </AccordionTrigger>
                    <Button variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  <AccordionContent className="p-4 border border-t-0 rounded-b-md">
                    <div className="space-y-4">
                      <FormField control={form.control} name={`projects.${index}.name`} render={({ field }) => ( <FormItem><FormLabel>Project Name</FormLabel><FormControl><Input {...field} onBlur={field.onBlur} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name={`projects.${index}.url`} render={({ field }) => ( <FormItem><FormLabel>Project URL</FormLabel><FormControl><Input {...field} value={field.value ?? ''} onBlur={field.onBlur} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name={`projects.${index}.description`} render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the project..." {...field} rows={3} value={field.value ?? ''} onBlur={field.onBlur} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button variant="outline" onClick={() => append({ id: crypto.randomUUID(), name: '', description: '' })}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
