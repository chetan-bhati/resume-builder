"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeDataSchema, type Education } from '@/lib/types';
import { useResumeStore } from '@/hooks/use-resume-store.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Textarea } from '../ui/textarea';

export default function EducationForm() {
  const { resumeData, setResumeData, isInitialized } = useResumeStore();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const form = useForm<{ education: Education[] }>({
    resolver: zodResolver(resumeDataSchema.pick({ education: true })),
    defaultValues: { education: resumeData.education },
    mode: 'onBlur'
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'education',
  });
  
  useEffect(() => {
    if (isInitialized) {
      form.reset({ education: resumeData.education });
      setOpenItems(resumeData.education.map(e => e.id));
    }
  }, [isInitialized, resumeData.education, form]);

  const handleBlur = () => {
    form.trigger();
    const formData = form.getValues();
    setResumeData(draft => {
        draft.education = formData.education as Education[];
    });
  };
  
  const handleAddNew = () => {
    const newId = crypto.randomUUID();
    append({ id: newId, institution: '', degree: '' });
    setOpenItems(prev => [...prev, newId]);
  }

  const handleRemove = (index: number, id: string) => {
    remove(index);
    setOpenItems(prev => prev.filter(item => item !== id));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>List your academic background and achievements.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-4" onBlur={handleBlur}>
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="w-full">
              {fields.map((field, index) => (
                <AccordionItem key={field.id} value={field.id} className="border-b-0">
                  <div className="flex justify-between items-center bg-muted p-2 rounded-t-md border">
                    <AccordionTrigger className="flex-1 text-sm font-medium py-2 text-left">
                        {form.watch(`education.${index}.degree`) || 'New Degree'} at {form.watch(`education.${index}.institution`) || 'New Institution'}
                    </AccordionTrigger>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(index, field.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  <AccordionContent className="p-4 border border-t-0 rounded-b-md">
                    <div className="space-y-4">
                      <FormField control={form.control} name={`education.${index}.institution`} render={({ field }) => ( <FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => ( <FormItem><FormLabel>Degree/Certificate</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name={`education.${index}.startDate`} render={({ field }) => ( <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input placeholder="e.g., Aug 2016" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name={`education.${index}.endDate`} render={({ field }) => ( <FormItem><FormLabel>End Date</FormLabel><FormControl><Input placeholder="e.g., May 2020" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
                      </div>
                      <FormField control={form.control} name={`education.${index}.description`} render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="e.g., GPA, Honors..." {...field} rows={2} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button variant="outline" onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
