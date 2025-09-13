
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersonalDetailsForm from './resume-form/personal-details-form';
import ExperienceForm from './resume-form/experience-form';
import EducationForm from './resume-form/education-form';
import SkillsForm from './resume-form/skills-form';
import ProjectsForm from './resume-form/projects-form';
import AchievementsForm from './resume-form/achievements-form';
import LayoutForm from './resume-form/layout-form';
import { User, Briefcase, GraduationCap, Star, Lightbulb, Trophy, LayoutDashboard } from 'lucide-react';

export default function ResumeForm() {
  return (
    <div className="p-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 sm:grid-cols-7 mb-4 h-auto flex-wrap sm:flex-nowrap">
          <TabsTrigger value="personal"><User className="mr-0 sm:mr-2 h-4 w-4" /><span className="hidden sm:inline">Personal</span></TabsTrigger>
          <TabsTrigger value="experience"><Briefcase className="mr-0 sm:mr-2 h-4 w-4"/><span className="hidden sm:inline">Experience</span></TabsTrigger>
          <TabsTrigger value="education"><GraduationCap className="mr-0 sm:mr-2 h-4 w-4"/><span className="hidden sm:inline">Education</span></TabsTrigger>
          <TabsTrigger value="skills"><Star className="mr-0 sm:mr-2 h-4 w-4"/><span className="hidden sm:inline">Skills</span></TabsTrigger>
          <TabsTrigger value="projects"><Lightbulb className="mr-0 sm:mr-2 h-4 w-4"/><span className="hidden sm:inline">Projects</span></TabsTrigger>
          <TabsTrigger value="achievements"><Trophy className="mr-0 sm:mr-2 h-4 w-4"/><span className="hidden sm:inline">Achievements</span></TabsTrigger>
          <TabsTrigger value="layout"><LayoutDashboard className="mr-0 sm:mr-2 h-4 w-4"/><span className="hidden sm:inline">Layout</span></TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <PersonalDetailsForm />
        </TabsContent>
        <TabsContent value="experience">
          <ExperienceForm />
        </TabsContent>
        <TabsContent value="education">
          <EducationForm />
        </TabsContent>
        <TabsContent value="skills">
          <SkillsForm />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsForm />
        </TabsContent>
        <TabsContent value="achievements">
          <AchievementsForm />
        </TabsContent>
        <TabsContent value="layout">
          <LayoutForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
