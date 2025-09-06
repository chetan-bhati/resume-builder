"use server";

import { customizeResumeContent, type CustomizeResumeContentInput, type CustomizeResumeContentOutput } from '@/ai/flows/ai-customize-resume-content';

export async function runAiOptimization(input: CustomizeResumeContentInput): Promise<CustomizeResumeContentOutput> {
  try {
    const output = await customizeResumeContent(input);
    return output;
  } catch (error) {
    console.error("AI customization failed:", error);
    throw new Error("Failed to get suggestions from AI.");
  }
}
