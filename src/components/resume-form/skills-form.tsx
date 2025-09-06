"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeDataSchema, type Skill } from '@/lib/types';
import { useResumeStore } from '@/hooks/use-resume-store.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';

export default function SkillsForm() {
  const { resumeData, setResumeData, isInitialized } = useResumeStore();
  const [newSkill, setNewSkill] = useState("");

  const form = useForm<{ skills: Skill[] }>({
    resolver: zodResolver(resumeDataSchema.pick({ skills: true })),
    defaultValues: { skills: resumeData.skills },
    mode: 'onBlur'
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'skills',
  });
  
  useEffect(() => {
    if (isInitialized) {
      form.reset({ skills: resumeData.skills });
    }
  }, [isInitialized, resumeData.skills, form]);
  
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.skills) {
        setResumeData(draft => {
            draft.skills = value.skills as Skill[];
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setResumeData]);

  const handleAddSkill = () => {
      if (newSkill) {
        append({ id: crypto.randomUUID(), name: newSkill });
        setNewSkill("");
      }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Highlight your key skills. Add one by one.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-20">
                    {fields.map((field, index) => (
                        <Badge key={field.id} variant="secondary" className="flex items-center gap-1 text-base">
                            {form.watch(`skills.${index}.name`)}
                            <button onClick={() => remove(index)} className="rounded-full hover:bg-destructive/20 p-0.5">
                                <Trash2 className="h-3 w-3 text-destructive" />
                            </button>
                        </Badge>
                    ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g., React" 
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => form.handleSubmit(() => {})()}
                  />
                  <Button type="button" onClick={handleAddSkill}><Plus className="mr-2 h-4 w-4" /> Add Skill</Button>
                </div>
            </div>
        </Form>
      </CardContent>
    </Card>
  );
}
