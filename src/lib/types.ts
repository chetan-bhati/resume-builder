
import { z } from 'zod';

export const personalDetailsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  location: z.string().optional(),
  summary: z.string().optional(),
  role: z.string().optional(),
});
export type PersonalDetails = z.infer<typeof personalDetailsSchema>;

export const experienceSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
});
export type Experience = z.infer<typeof experienceSchema>;

export const educationSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});
export type Education = z.infer<typeof educationSchema>;

export const skillItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill name cannot be empty'),
});
export type SkillItem = z.infer<typeof skillItemSchema>;

export const skillSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  category: z.string().min(1, 'Category name cannot be empty'),
  skills: z.array(skillItemSchema).min(0),
});
export type Skill = z.infer<typeof skillSchema>;


export const projectSchema = z.object({
    id: z.string().default(() => crypto.randomUUID()),
    name: z.string().min(1, 'Project name is required'),
    intro: z.string().optional(),
    description: z.string().optional(),
    url: z.string().url('Invalid URL').optional().or(z.literal('')),
});
export type Project = z.infer<typeof projectSchema>;

export const achievementSchema = z.object({
    id: z.string().default(() => crypto.randomUUID()),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Achievement is required'),
});
export type Achievement = z.infer<typeof achievementSchema>;

export const customSectionSchema = z.object({
    id: z.string().default(() => crypto.randomUUID()),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
});
export type CustomSection = z.infer<typeof customSectionSchema>;

export const sectionIdSchema = z.enum(['experience', 'education', 'skills', 'projects', 'achievements']);
export type SectionId = z.infer<typeof sectionIdSchema>;

export const resumeDataSchema = z.object({
  personalDetails: personalDetailsSchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
  achievements: z.array(achievementSchema),
  customSections: z.array(customSectionSchema),
  sectionOrder: z.array(z.string()),
});
export type ResumeData = z.infer<typeof resumeDataSchema>;

export const designSchema = z.object({
    template: z.enum(['classic', 'modern', 'minimalist']).default('modern'),
    primaryColor: z.string().default('#3F51B5'),
    fontSize: z.string().default('10'),
    fontFamily: z.string().default('Inter'),
});
export type DesignState = z.infer<typeof designSchema>;

export const defaultResumeData: ResumeData = {
    personalDetails: {
        name: '',
        role: '',
        email: '',
        phone: '',
        website: '',
        location: '',
        summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    achievements: [],
    customSections: [],
    sectionOrder: ['experience', 'education', 'skills', 'projects', 'achievements'],
};
