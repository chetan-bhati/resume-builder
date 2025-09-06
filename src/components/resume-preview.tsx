
"use client";

import React from 'react';
import { useResumeStore } from '@/hooks/use-resume-store.tsx';
import { Mail, Phone, Globe, MapPin, ExternalLink, Briefcase, GraduationCap, Star, Lightbulb, Trophy } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const Section = ({ title, icon, children, className }: { title: string, icon: React.ReactNode, children: React.ReactNode, className?: string }) => (
    <section className={`mb-6 ${className}`}>
        <h2 className="flex items-center text-lg font-bold uppercase mb-2" style={{ color: 'var(--preview-primary-color)' }}>
            {icon}
            <span className="ml-2">{title}</span>
        </h2>
        <div className="border-t-2" style={{ borderColor: 'var(--preview-primary-color)' }}></div>
        <div className="pt-3">
            {children}
        </div>
    </section>
);


const DescriptionRenderer = ({ content }: { content?: string }) => {
    if (!content) return null;
    const lines = content.split('\n');
    return (
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {lines.map((line, index) => {
                 const cleanedLine = line.replace(/^•\s*/, '').trim();
                 if (!cleanedLine) return null;
                 return <li key={index}>{cleanedLine}</li>;
            })}
        </ul>
    );
};

const ResumePreview = React.forwardRef<HTMLDivElement>((props, ref) => {
  const { resumeData, design, isInitialized } = useResumeStore();
  const { personalDetails, experience, education, skills, projects, achievements } = resumeData;

  const styles = {
    '--preview-primary-color': design.primaryColor,
    fontSize: `${design.fontSize}pt`,
    fontFamily: design.fontFamily,
  } as React.CSSProperties;

  if (!isInitialized) {
    return (
        <div className="bg-white shadow-lg rounded-lg w-full max-w-[210mm] min-h-[297mm] mx-auto p-12">
            <div className="flex flex-col items-center mb-8">
                <Skeleton className="h-10 w-1/2 mb-4" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-8" />
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-5 w-1/2 mb-1" />
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-6" />
        </div>
    );
  }

  return (
    <div ref={ref} id="resume-preview" className="bg-white text-gray-800 shadow-lg rounded-lg w-full max-w-[210mm] min-h-[297mm] mx-auto p-12 transition-all duration-300 print:shadow-none">
       <div style={styles}>
        {/* Header */}
        <header className="text-center mb-4">
            <h1 className="text-4xl font-bold tracking-widest">{personalDetails.name}</h1>
            {personalDetails.role && <p className="text-xl mt-1 font-medium" style={{color: 'var(--preview-primary-color)'}}>{personalDetails.role}</p>}
            <div className="flex justify-center items-center gap-x-4 gap-y-1 mt-4 text-sm flex-wrap">
                {personalDetails.email && <a href={`mailto:${personalDetails.email}`} className="flex items-center gap-1 hover:underline"><Mail className="w-4 h-4" /> {personalDetails.email}</a>}
                {personalDetails.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personalDetails.phone}</span>}
                {personalDetails.website && <a href={personalDetails.website} target="_blank" rel="noreferrer noopener" className="flex items-center gap-1 hover:underline"><Globe className="w-4 h-4" /> {personalDetails.website}</a>}
                {personalDetails.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {personalDetails.location}</span>}
            </div>
        </header>

        {/* Summary */}
        {personalDetails.summary && (
            <section className="mb-6">
                <p className="text-center text-sm">{personalDetails.summary}</p>
            </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
            <Section title="Work Experience" icon={<Briefcase className="w-5 h-5" />}>
                {experience.map(exp => (
                    <div key={exp.id} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-base">{exp.role}, <span className="font-normal italic">{exp.company}</span></h3>
                            <div className="text-sm font-medium text-gray-600 text-right">
                                <div>{exp.startDate} &ndash; {exp.endDate}</div>
                                {exp.location && <div className="italic">{exp.location}</div>}
                            </div>
                        </div>
                        <DescriptionRenderer content={exp.description} />
                    </div>
                ))}
            </Section>
        )}
        
        {/* Education */}
        {education && education.length > 0 && (
            <Section title="Education" icon={<GraduationCap className="w-5 h-5" />}>
                {education.map(edu => (
                    <div key={edu.id} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-base">{edu.institution}</h3>
                            <p className="text-sm font-medium text-gray-600">{edu.startDate} &ndash; {edu.endDate}</p>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <h4 className="text-base italic">{edu.degree}</h4>
                             <p className="text-sm italic text-gray-600">{edu.description}</p>
                        </div>
                    </div>
                ))}
            </Section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
            <Section title="Skills" icon={<Star className="w-5 h-5" />}>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {skills.map(skill => (
                        <span key={skill.id} className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">{skill.name}</span>
                    ))}
                </div>
            </Section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
            <Section title="Projects" icon={<Lightbulb className="w-5 h-5" />}>
                 {projects.map(proj => (
                    <div key={proj.id} className="mb-3 last:mb-0">
                        <h3 className="font-bold text-base inline">{proj.name}</h3>
                        {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2"><ExternalLink className="inline w-4 h-4" /></a>}
                        <DescriptionRenderer content={proj.description} />
                    </div>
                ))}
            </Section>
        )}
        
        {/* Achievements */}
        {achievements && achievements.length > 0 && (
            <Section title="Achievements" icon={<Trophy className="w-5 h-5" />}>
                 {achievements.map(ach => (
                    <div key={ach.id} className="mb-3 last:mb-0">
                        <h3 className="font-bold text-base">{ach.title}</h3>
                        <DescriptionRenderer content={ach.description} />
                    </div>
                ))}
            </Section>
        )}
      </div>
    </div>
  );
});
ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
