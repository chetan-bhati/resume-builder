"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalDetailsSchema, type PersonalDetails } from '@/lib/types';
import { useResumeStore } from '@/hooks/use-resume-store.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';

export default function PersonalDetailsForm() {
  const { resumeData, setResumeData, isInitialized } = useResumeStore();

  const form = useForm<PersonalDetails>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: resumeData.personalDetails,
    mode: 'onBlur'
  });

  useEffect(() => {
    if (isInitialized) {
      form.reset(resumeData.personalDetails);
    }
  }, [isInitialized, resumeData.personalDetails, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
        setResumeData(draft => {
            draft.personalDetails = value as PersonalDetails;
        });
    });
    return () => subscription.unsubscribe();
  }, [form, setResumeData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
        <CardDescription>Let's start with the basics. This information will appear at the top of your resume.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onBlur={() => form.handleSubmit(() => {})()}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="John Doe" {...field} onBlur={field.onBlur} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input placeholder="john.doe@email.com" {...field} onBlur={field.onBlur} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input placeholder="123-456-7890" {...field} value={field.value ?? ''} onBlur={field.onBlur} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website / Portfolio</FormLabel>
                  <FormControl><Input placeholder="https://johndoe.dev" {...field} value={field.value ?? ''} onBlur={field.onBlur} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl><Input placeholder="San Francisco, CA" {...field} value={field.value ?? ''} onBlur={field.onBlur} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Summary</FormLabel>
                  <FormControl><Textarea placeholder="A passionate developer..." {...field} rows={5} value={field.value ?? ''} onBlur={field.onBlur} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
