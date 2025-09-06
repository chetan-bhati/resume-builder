"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeDataSchema, type Achievement } from '@/lib/types';
import { useResumeStore } from '@/hooks/use-resume-store.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Textarea } from '../ui/textarea';

export default function AchievementsForm() {
  const { resumeData, setResumeData, isInitialized } = useResumeStore();

  const form = useForm<{ achievements: Achievement[] }>({
    resolver: zodResolver(resumeDataSchema.pick({ achievements: true })),
    defaultValues: { achievements: resumeData.achievements },
    mode: 'onBlur'
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'achievements',
  });
  
  useEffect(() => {
    if (isInitialized) {
      form.reset({ achievements: resumeData.achievements });
    }
  }, [isInitialized, resumeData.achievements, form]);

  const handleBlur = () => {
    form.trigger();
    const formData = form.getValues();
    setResumeData(draft => {
        draft.achievements = formData.achievements as Achievement[];
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>Highlight your key accomplishments and awards.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-4" onBlur={handleBlur}>
            <Accordion type="multiple" defaultValue={fields.map(f => f.id)} className="w-full">
              {fields.map((field, index) => (
                <AccordionItem key={field.id} value={field.id} className="border-b-0">
                  <div className="flex justify-between items-center bg-muted p-2 rounded-t-md border">
                    <AccordionTrigger className="flex-1 text-sm font-medium py-2 text-left">
                        {form.watch(`achievements.${index}.description`)?.substring(0, 50) || 'New Achievement'}...
                    </AccordionTrigger>
                    <Button variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  <AccordionContent className="p-4 border border-t-0 rounded-b-md">
                    <div className="space-y-4">
                       <FormField
                        control={form.control}
                        name={`achievements.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="e.g., Won 'Best Project' award at the company hackathon."
                                {...field}
                                rows={3}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button variant="outline" onClick={() => append({ id: crypto.randomUUID(), description: '' })}><Plus className="mr-2 h-4 w-4" /> Add Achievement</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
