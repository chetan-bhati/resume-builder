// src/ai/flows/ai-customize-resume-content.ts
'use server';
/**
 * @fileOverview An AI agent to customize resume content based on user input and desired roles.
 *
 * - customizeResumeContent - A function that takes resume sections and desired roles, and returns improved content suggestions.
 * - CustomizeResumeContentInput - The input type for the customizeResumeContent function.
 * - CustomizeResumeContentOutput - The return type for the customizeResumeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomizeResumeContentInputSchema = z.object({
  sections: z.record(z.string()).describe('A record of resume sections (e.g., work experience, education) with their content.'),
  desiredRoles: z.string().describe('The specific job roles or types of positions the user is targeting.'),
});
export type CustomizeResumeContentInput = z.infer<typeof CustomizeResumeContentInputSchema>;

const CustomizeResumeContentOutputSchema = z.record(z.string()).describe('A record of resume sections with AI-suggested improvements for each section.');
export type CustomizeResumeContentOutput = z.infer<typeof CustomizeResumeContentOutputSchema>;

export async function customizeResumeContent(input: CustomizeResumeContentInput): Promise<CustomizeResumeContentOutput> {
  return customizeResumeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customizeResumeContentPrompt',
  input: {schema: CustomizeResumeContentInputSchema},
  output: {schema: CustomizeResumeContentOutputSchema},
  prompt: `You are an expert resume writer specializing in tailoring resumes to specific job roles.

  Given the following resume sections and the desired job roles, provide improved content suggestions for each section to better match the roles.
  Focus on improving wording, keywords, and overall impact.

  Desired Roles: {{{desiredRoles}}}

  Resume Sections:
  {{#each sections}}
  Section Name: {{@key}}
  Current Content: {{{this}}}
  ---
  {{/each}}

  Provide the output as a record where the keys are the resume section names and the values are the improved content suggestions for those sections.
  `,
});

const customizeResumeContentFlow = ai.defineFlow(
  {
    name: 'customizeResumeContentFlow',
    inputSchema: CustomizeResumeContentInputSchema,
    outputSchema: CustomizeResumeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
