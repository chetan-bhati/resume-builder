
"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeDataSchema, type CustomSection } from '@/lib/types';
import { useResumeStore } from '@/hooks/use-resume-store.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

export default function CustomSectionsForm() {
  const { resumeData, setResumeData, isInitialized } = useResumeStore();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const form = useForm<{ customSections: CustomSection[] }>({
    resolver: zodResolver(resumeDataSchema.pick({ customSections: true })),
    defaultValues: { customSections: resumeData.customSections || [] },
    mode: 'onBlur'
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'customSections',
  });
  
  useEffect(() => {
    if (isInitialized && resumeData.customSections) {
      form.reset({ customSections: resumeData.customSections });
      if (!openItems.length && resumeData.customSections.length > 0) {
         setOpenItems(resumeData.customSections.map(a => a.id));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, resumeData.customSections, form.reset]);


  const updateStore = () => {
    form.trigger();
    const formData = form.getValues();
    const cleanedData = JSON.parse(JSON.stringify(formData.customSections));
    setResumeData(draft => {
        draft.customSections = cleanedData;
    });
  };
  
  const handleAddNew = () => {
    const newId = crypto.randomUUID();
    append({ id: newId, title: 'New Section', description: '' });
    setOpenItems(prev => [...prev, newId]);
    
    // Add to sectionOrder
    setResumeData(draft => {
        if (!draft.sectionOrder.includes(newId)) {
            draft.sectionOrder.push(newId);
        }
    });
  }

  const handleRemove = (index: number, id: string) => {
    remove(index);
    setResumeData(draft => {
        draft.sectionOrder = draft.sectionOrder.filter(sectionId => sectionId !== id);
        draft.customSections = draft.customSections.filter(section => section.id !== id);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Sections</CardTitle>
        <CardDescription>Add any extra sections you need, like Certifications or Languages.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-4">
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="w-full">
              {fields.map((field, index) => (
                <AccordionItem key={field.id} value={field.id} className="border-b-0">
                  <div className="flex justify-between items-center bg-muted p-2 rounded-t-md border">
                    <AccordionTrigger className="flex-1 text-sm font-medium py-2 text-left">
                        {form.watch(`customSections.${index}.title`) || 'New Section'}
                    </AccordionTrigger>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(index, field.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  <AccordionContent className="p-4 border border-t-0 rounded-b-md">
                    <div className="space-y-4">
                       <FormField
                        control={form.control}
                        name={`customSections.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Certifications"
                                {...field}
                                onBlur={() => {
                                    field.onBlur();
                                    updateStore();
                                }}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name={`customSections.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content (use • for bullet points)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="• Certified Kubernetes Administrator..."
                                {...field}
                                rows={4}
                                onBlur={() => {
                                    field.onBlur();
                                    updateStore();
                                }}
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
            <Button variant="outline" onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Add Custom Section</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
