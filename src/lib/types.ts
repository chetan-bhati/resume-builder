
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


export const resumeDataSchema = z.object({
  personalDetails: personalDetailsSchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
  achievements: z.array(achievementSchema),
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
        name: 'CHETAN BHATI',
        role: 'Senior Django Developer',
        email: 'bhatichetan147@gmail.com',
        phone: '+917024822271',
        website: '',
        location: 'Indore',
        summary: "As a dedicated Python Django developer with 3.6 years of experience, I've specialized in building efficient web applications, managing databases, implementing low-level optimizations, and integrating API's to deliver high-quality, sophisticated solutions.",
    },
    experience: [
        {
            id: 'default-exp-1',
            company: 'Wangoes Technologies pvt ltd',
            role: 'Senior Django Developer',
            startDate: 'May 2022',
            endDate: 'Current',
            location: 'Indore',
            description: 'I have grown significantly as a developer, becoming proficient in various skills and technologies essential for modern web development. In my role, I am engaged in the complete software development lifecycle, including application development, deployment, and maintenance.',
        },
    ],
    education: [
        {
            id: 'default-edu-1',
            institution: 'Sage University',
            degree: 'B.Tech',
            startDate: '2018',
            endDate: '2022',
            description: 'Indore',
        },
    ],
    skills: [
        {
          id: 'default-skill-cat-1',
          category: 'Languages',
          skills: [
            { id: 'default-skill-1', name: 'Python' },
            { id: 'default-skill-2', name: 'JavaScript (ES6+)' },
            { id: 'default-skill-3', name: 'HTML5 & CSS3' },
            { id: 'default-skill-4', name: 'SQL' },
          ]
        },
        {
          id: 'default-skill-cat-2',
          category: 'Frameworks & Libraries',
          skills: [
            { id: 'default-skill-5', name: 'Django / DRF' },
            { id: 'default-skill-6', name: 'Celery' },
            { id: 'default-skill-7', name: 'jQuery' },
          ]
        },
         {
          id: 'default-skill-cat-3',
          category: 'Databases & Caching',
          skills: [
            { id: 'default-skill-8', name: 'PostgreSQL' },
            { id: 'default-skill-9', name: 'MySQL' },
            { id: 'default-skill-10', name: 'Redis' },
          ]
        },
        {
          id: 'default-skill-cat-4',
          category: 'DevOps & Cloud',
          skills: [
            { id: 'default-skill-11', name: 'Docker' },
            { id: 'default-skill-12', name: 'AWS (EC2, S3, RDS, ELB)' },
            { id: 'default-skill-13', name: 'Nginx / Gunicorn' },
            { id: 'default-skill-14', name: 'Supervisor' },
          ]
        },
    ],
    projects: [
        {
            id: 'default-proj-1',
            name: 'Articheck',
            intro: 'A platform for architectural reporting and document management.',
            description: '• Developed backend logic for APIs and designed the database schema to ensure data integrity.\n• Implemented features for managing groups and handled CSV import/export for reliable report generation.\n• Managed organization features, PDF report generation, and implemented credit purchasing for report creation and virtual courier services.',
            url: 'https://portal.articheck.com',
        },
        {
            id: 'default-proj-2',
            name: 'Paragon',
            intro: 'A resource management platform for field engineers.',
            description: '• Developed a robust platform enabling field engineers to store, access, and manage resources for operating electrical equipment.\n• Implemented feature for job management, device types, and manufacturing tracking.',
            url: '',
        },
        {
            id: 'default-proj-3',
            name: 'Yamaha Health and Wellness',
            intro: 'A platform for tracking user health data and providing personalized insights.',
            description: '• This platform tracks user health data, providing personalized insights into hydration, sleep patterns, and physical activity.\n• It is an innovative platform focused on promoting holistic health and wellness.\n• Technologies: Python RestAPIs, PostgreSQL, Docker, AWS(S3, EC2, RDS, ELB, Secret Manager)',
            url: 'https://api.yamahahealthandwellness.com/',
        }
    ],
    achievements: [
        {
            id: 'default-achieve-1',
            title: 'Exceptional Workmanship',
            description: 'High-quality work was consistently delivered ahead of schedule, reflecting dedication and attention to detail.',
        },
        {
            id: 'default-achieve-2',
            title: 'Team Collaboration',
            description: 'Played a key role in team projects, providing valuable insight and support to colleagues, resulting in successful project completion.',
        }
    ]
};
