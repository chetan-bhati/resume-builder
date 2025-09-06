"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeDataSchema, type Experience } from '@/lib/types';
import { useResumeStore } from '@/hooks/use-resume-store.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export default function ExperienceForm() {
  const { resumeData, setResumeData, isInitialized } = useResumeStore();

  const form = useForm<{ experience: Experience[] }>({
    resolver: zodResolver(resumeDataSchema.pick({ experience: true })),
    defaultValues: { experience: resumeData.experience },
    mode: 'onBlur'
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'experience',
  });
  
  useEffect(() => {
    if (isInitialized) {
      form.reset({ experience: resumeData.experience });
    }
  }, [isInitialized, resumeData.experience, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.experience) {
        setResumeData(draft => {
            draft.experience = value.experience as Experience[];
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setResumeData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
        <CardDescription>Detail your professional history. Start with your most recent job.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-4">
            <Accordion type="multiple" defaultValue={fields.map(f => f.id)} className="w-full">
              {fields.map((field, index) => (
                <AccordionItem key={field.id} value={field.id} className="border-b-0">
                  <div className="flex justify-between items-center bg-muted p-2 rounded-t-md border">
                    <AccordionTrigger className="flex-1 text-sm font-medium py-2 text-left">
                      {form.watch(`experience.${index}.role`) || 'New Role'} at {form.watch(`experience.${index}.company`) || 'New Company'}
                    </AccordionTrigger>
                    <Button variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  <AccordionContent className="p-4 border border-t-0 rounded-b-md">
                    <div className="space-y-4">
                      <FormField control={form.control} name={`experience.${index}.role`} render={({ field }) => ( <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} onBlur={field.onBlur} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => ( <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} onBlur={field.onBlur} /></FormControl><FormMessage /></FormItem> )} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name={`experience.${index}.startDate`} render={({ field }) => ( <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input placeholder="e.g., Jan 2020" {...field} value={field.value ?? ''} onBlur={field.onBlur} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name={`experience.${index}.endDate`} render={({ field }) => ( <FormItem><FormLabel>End Date</FormLabel><FormControl><Input placeholder="e.g., Present" {...field} value={field.value ?? ''} onBlur={field.onBlur} /></FormControl><FormMessage /></FormItem> )} />
                      </div>
                      <FormField control={form.control} name={`experience.${index}.description`} render={({ field }) => ( <FormItem><FormLabel>Description (use • for bullet points)</FormLabel><FormControl><Textarea placeholder="• Achieved X by doing Y..." {...field} rows={4} value={field.value ?? ''} onBlur={field.onBlur} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button variant="outline" onClick={() => append({ id: crypto.randomUUID(), company: '', role: '', description: '' })}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
