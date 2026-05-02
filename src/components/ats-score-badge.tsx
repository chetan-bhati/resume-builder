
import React from 'react';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Info } from 'lucide-react';

interface AtsScoreBadgeProps {
    score: number;
    maxScore: number;
    tips?: string[];
    label?: string;
    showProgress?: boolean;
}

export function AtsScoreBadge({ score, maxScore, tips, label, showProgress = false }: AtsScoreBadgeProps) {
    const percentage = Math.round((score / maxScore) * 100);
    
    let colorClass = "text-red-500";
    if (percentage >= 80) colorClass = "text-green-500";
    else if (percentage >= 50) colorClass = "text-yellow-500";

    return (
        <div className="flex flex-col gap-1 w-full max-w-[200px]">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                    {label && <span className="text-xs font-semibold text-muted-foreground uppercase">{label}</span>}
                    {tips && tips.length > 0 && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[250px]">
                                    <p className="font-bold mb-1">Tips to improve:</p>
                                    <ul className="list-disc pl-4 text-xs space-y-1">
                                        {tips.map((tip, i) => <li key={i}>{tip}</li>)}
                                    </ul>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
                <span className={`text-sm font-bold ${colorClass}`}>{percentage}%</span>
            </div>
            {showProgress && (
                <Progress value={percentage} className="h-1.5" />
            )}
        </div>
    );
}
