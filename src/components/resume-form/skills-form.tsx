
"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeDataSchema, type Skill, type SkillItem } from '@/lib/types';
import { useResumeStore } from '@/hooks/use-resume-store.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export default function SkillsForm() {
  const { resumeData, setResumeData, isInitialized } = useResumeStore();
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({});
  const [openItems, setOpenItems] = useState<string[]>([]);

  const form = useForm<{ skills: Skill[] }>({
    resolver: zodResolver(resumeDataSchema.pick({ skills: true })),
    defaultValues: { skills: resumeData.skills },
    mode: 'onBlur'
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'skills',
  });
  
  useEffect(() => {
    if (isInitialized) {
        form.reset({ skills: resumeData.skills });
        setOpenItems(resumeData.skills.map(s => s.id));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, resumeData.skills, form.reset]);

  const updateStore = () => {
    const formData = form.getValues();
    setResumeData(draft => {
        draft.skills = JSON.parse(JSON.stringify(formData.skills));
    });
  }

  const handleAddNewCategory = () => {
    const newId = crypto.randomUUID();
    append({ id: newId, category: '', skills: [] });
    setOpenItems(prev => [...prev, newId]);
  }
  
  const handleRemoveCategory = (index: number, id: string) => {
    remove(index);
    setOpenItems(prev => prev.filter(item => item !== id));
    setTimeout(updateStore, 0);
  }

  const handleAddSkill = (categoryIndex: number) => {
      const categoryId = fields[categoryIndex].id;
      const skillName = newSkillInputs[categoryId];
      if (skillName) {
        const currentSkills = form.getValues(`skills.${categoryIndex}.skills`);
        const newSkill: SkillItem = { id: crypto.randomUUID(), name: skillName };
        update(categoryIndex, {
            ...fields[categoryIndex],
            skills: [...currentSkills, newSkill]
        });
        setNewSkillInputs(prev => ({ ...prev, [categoryId]: '' }));
        setTimeout(updateStore, 0);
      }
  };

  const handleRemoveSkill = (categoryIndex: number, skillIdToRemove: string) => {
    const currentSkills = form.getValues(`skills.${categoryIndex}.skills`);
    update(categoryIndex, {
        ...fields[categoryIndex],
        skills: currentSkills.filter(s => s.id !== skillIdToRemove)
    });
    setTimeout(updateStore, 0);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, categoryIndex: number) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSkill(categoryIndex);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Group your skills by category for better organization.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <div className="space-y-4">
               <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="w-full">
                    {fields.map((field, index) => (
                        <AccordionItem key={field.id} value={field.id} className="border-b-0">
                           <div className="flex justify-between items-center bg-muted p-2 rounded-t-md border">
                                <AccordionTrigger className="flex-1 text-sm font-medium py-2 text-left">
                                     <FormField
                                        control={form.control}
                                        name={`skills.${index}.category`}
                                        render={({ field: catField }) => (
                                          <Input
                                            placeholder="Category Name (e.g., Languages)"
                                            {...catField}
                                            onBlur={() => { catField.onBlur(); updateStore(); }}
                                            className="font-medium text-sm border-none bg-transparent h-auto p-0 focus-visible:ring-0"
                                          />
                                        )}
                                      />
                                </AccordionTrigger>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveCategory(index, field.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                            <AccordionContent className="p-4 border border-t-0 rounded-b-md">
                                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-20 mb-4">
                                     {form.watch(`skills.${index}.skills`).map((skill) => (
                                        <Badge key={skill.id} variant="secondary" className="flex items-center gap-1 text-base">
                                            {skill.name}
                                            <button onClick={() => handleRemoveSkill(index, skill.id)} className="rounded-full hover:bg-destructive/20 p-0.5">
                                                <Trash2 className="h-3 w-3 text-destructive" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                  <Input 
                                    placeholder="Add a skill..." 
                                    value={newSkillInputs[field.id] || ''}
                                    onChange={e => setNewSkillInputs(prev => ({...prev, [field.id]: e.target.value}))}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                  />
                                  <Button type="button" onClick={() => handleAddSkill(index)}><Plus className="mr-2 h-4 w-4" /> Add Skill</Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
               </Accordion>
                <Button variant="outline" onClick={handleAddNewCategory}><Plus className="mr-2 h-4 w-4" /> Add Category</Button>
            </div>
        </Form>
      </CardContent>
    </Card>
  );
}

    