
"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalDetailsSchema, type PersonalDetails } from '@/lib/types';
import { useResumeStore } from '@/hooks/use-resume-store.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

export default function PersonalDetailsForm() {
  const { resumeData, setResumeData, isInitialized } = useResumeStore();

  const form = useForm<PersonalDetails>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: resumeData.personalDetails,
    mode: 'onBlur'
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'links',
  });

  useEffect(() => {
    if (isInitialized) {
      form.reset(resumeData.personalDetails);
    }
  }, [isInitialized, resumeData.personalDetails, form]);

  const updateStore = () => {
    form.trigger();
    const formData = form.getValues();
    setResumeData(draft => {
      draft.personalDetails = formData as PersonalDetails;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
        <CardDescription>Let's start with the basics. This information will appear at the top of your resume.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl><Input placeholder="John Doe" {...field} onBlur={updateStore} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input placeholder="john.doe@email.com" {...field} onBlur={updateStore} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Phone</FormLabel> <FormControl><Input placeholder="123-456-7890" {...field} value={field.value ?? ''} onBlur={updateStore} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="location" render={({ field }) => ( <FormItem> <FormLabel>Location</FormLabel> <FormControl><Input placeholder="San Francisco, CA" {...field} value={field.value ?? ''} onBlur={updateStore} /></FormControl> <FormMessage /> </FormItem> )} />
            
            <div className="space-y-2">
                <FormLabel>Links</FormLabel>
                <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2">
                        <FormField
                            control={form.control}
                            name={`links.${index}.label`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                <FormLabel className="text-xs">Label</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., LinkedIn" {...field} onBlur={updateStore}/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`links.${index}.url`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                <FormLabel className="text-xs">URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} onBlur={updateStore}/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button variant="ghost" size="icon" onClick={() => { remove(index); updateStore(); }}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
                </div>
                 <Button variant="outline" size="sm" type="button" onClick={() => append({ id: crypto.randomUUID(), label: '', url: '' })}><Plus className="mr-2 h-4 w-4" /> Add Link</Button>
            </div>

            <FormField control={form.control} name="summary" render={({ field }) => ( <FormItem> <FormLabel>Professional Summary</FormLabel> <FormControl><Textarea placeholder="A passionate developer..." {...field} rows={5} value={field.value ?? ''} onBlur={updateStore} /></FormControl> <FormMessage /> </FormItem> )} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
