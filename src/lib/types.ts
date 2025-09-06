import { z } from 'zod';

export const personalDetailsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  location: z.string().optional(),
  summary: z.string().optional(),
});
export type PersonalDetails = z.infer<typeof personalDetailsSchema>;

export const experienceSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
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

export const skillSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
});
export type Skill = z.infer<typeof skillSchema>;

export const projectSchema = z.object({
    id: z.string().default(() => crypto.randomUUID()),
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
    url: z.string().url('Invalid URL').optional().or(z.literal('')),
});
export type Project = z.infer<typeof projectSchema>;


export const resumeDataSchema = z.object({
  personalDetails: personalDetailsSchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
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
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '123-456-7890',
        website: 'https://johndoe.dev',
        location: 'San Francisco, CA',
        summary: 'A passionate developer with experience in building web applications using modern technologies. Eager to learn and grow in a challenging environment.',
    },
    experience: [
        {
            id: 'default-exp-1',
            company: 'Tech Solutions Inc.',
            role: 'Senior Software Engineer',
            startDate: '2020',
            endDate: 'Present',
            description: '• Led a team of 5 engineers to develop and maintain a large-scale e-commerce platform.\n• Improved application performance by 30% through code optimization and database tuning.\n• Mentored junior developers and conducted code reviews.',
        },
    ],
    education: [
        {
            id: 'default-edu-1',
            institution: 'University of Technology',
            degree: 'B.S. in Computer Science',
            startDate: '2016',
            endDate: '2020',
            description: 'Graduated with a 3.8 GPA. Member of the computer science club and participated in several hackathons.',
        },
    ],
    skills: [
        { id: 'default-skill-1', name: 'JavaScript' },
        { id: 'default-skill-2', name: 'React' },
        { id: 'default-skill-3', name: 'Node.js' },
        { id: 'default-skill-4', name: 'Python' },
    ],
    projects: [
        {
            id: 'default-proj-1',
            name: 'Personal Portfolio',
            description: 'A personal portfolio website to showcase my projects and skills.',
            url: 'https://johndoe.dev',
        }
    ]
};
