"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';
import { useResumeStore } from '@/hooks/use-resume-store';
import { toast } from '@/hooks/use-toast';
import { runAiOptimization } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

export default function AiOptimizerDialog() {
  const { resumeData, setResumeData } = useResumeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [desiredRoles, setDesiredRoles] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Record<string, string> | null>(null);

  const handleOptimize = async () => {
    setIsLoading(true);
    setSuggestions(null);

    const sections: Record<string, string> = {};
    if (resumeData.personalDetails.summary) {
        sections['Summary'] = resumeData.personalDetails.summary;
    }
    resumeData.experience.forEach((exp, i) => {
        if(exp.description) sections[`Experience ${exp.id}`] = exp.description;
    });

    try {
      const result = await runAiOptimization({ sections, desiredRoles });
      setSuggestions(result);
      toast({
        title: "Success!",
        description: "AI has generated suggestions for your resume.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with the AI optimization.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const applySuggestion = (sectionKey: string, suggestion: string) => {
    setResumeData(draft => {
        if (sectionKey === 'Summary') {
            draft.personalDetails.summary = suggestion;
            toast({ title: 'Summary updated!' });
        } else if (sectionKey.startsWith('Experience')) {
            const expId = sectionKey.split(' ')[1];
            const expIndex = draft.experience.findIndex(e => e.id === expId);
            if(expIndex !== -1) {
                draft.experience[expIndex].description = suggestion;
                toast({ title: 'Experience updated!' });
            }
        }
    });
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          AI Optimize
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>AI Content Optimizer</DialogTitle>
          <DialogDescription>
            Enter your desired job roles, and our AI will suggest improvements to your resume.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roles" className="text-right">
              Desired Roles
            </Label>
            <Input
              id="roles"
              value={desiredRoles}
              onChange={(e) => setDesiredRoles(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Senior Frontend Developer, Product Manager"
            />
          </div>
        </div>
        
        {isLoading && (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4">AI is thinking...</p>
            </div>
        )}

        {suggestions && (
            <Card>
                <CardHeader>
                    <CardTitle>Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[300px]">
                        <div className="space-y-4">
                        {Object.entries(suggestions).map(([key, value]) => (
                            <div key={key} className="p-4 border rounded-lg">
                                <h4 className="font-semibold mb-2">{key.startsWith('Experience') ? 'Experience' : key}</h4>
                                <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">{value}</p>
                                <Button size="sm" onClick={() => applySuggestion(key, value)}>Apply Suggestion</Button>
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        )}

        <DialogFooter>
          <Button onClick={handleOptimize} disabled={isLoading || !desiredRoles}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate Suggestions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
