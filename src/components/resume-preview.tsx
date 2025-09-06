"use client";

import React from 'react';
import { useResumeStore } from '@/hooks/use-resume-store.tsx';
import { Mail, Phone, Globe, MapPin, ExternalLink, Briefcase, GraduationCap, Star, Lightbulb, Trophy } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const Section = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <section className={`mb-4 ${className}`}>
        <div className="text-center mb-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white px-4 py-1 inline-block" style={{ backgroundColor: 'var(--preview-primary-color)' }}>{title}</h2>
        </div>
        {children}
    </section>
);


const DescriptionRenderer = ({ content }: { content?: string }) => {
    if (!content) return null;
    const lines = content.split('\n');
    return (
        <div className="text-sm text-gray-700 space-y-1.5">
            {lines.map((line, index) => {
                 const cleanedLine = line.replace(/^•\s*/, '').trim();
                 if (!cleanedLine) return null;
                 return (
                    <div key={index} className="flex">
                        <span className="mr-2 font-bold" style={{color: 'var(--preview-primary-color)'}}>•</span>
                        <p className="flex-1">{cleanedLine}</p>
                    </div>
                 );
            })}
        </div>
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
  
  const DottedLine = () => <div className="flex-grow border-b border-dotted border-gray-400 mx-2"></div>;

  return (
    <div ref={ref} id="resume-preview" className="bg-white text-gray-800 shadow-lg rounded-lg w-full max-w-[210mm] min-h-[297mm] mx-auto p-10 transition-all duration-300 print:shadow-none">
       <div style={styles}>
        {/* Header */}
        <header className="text-center mb-6">
            <h1 className="text-3xl font-bold tracking-wider">{personalDetails.name}</h1>
             {personalDetails.role && <p className="text-lg mt-1 font-medium">{personalDetails.role}</p>}
            <div className="flex justify-center items-center gap-x-6 gap-y-1 mt-2 text-xs flex-wrap">
                {personalDetails.email && <a href={`mailto:${personalDetails.email}`} className="hover:underline">{personalDetails.email}</a>}
                {personalDetails.phone && <span>{personalDetails.phone}</span>}
                {personalDetails.website && <a href={personalDetails.website} target="_blank" rel="noreferrer noopener" className="hover:underline">{personalDetails.website}</a>}
            </div>
             <hr className="my-4 border-t-2 border-gray-300" />
        </header>

        {/* Summary */}
        {personalDetails.summary && (
             <Section title="Summary">
                <p className="text-sm text-center">{personalDetails.summary}</p>
            </Section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
            <Section title="Experience">
                {experience.map(exp => (
                    <div key={exp.id} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-sm flex items-center"><span className="text-xl mr-2" style={{color: 'var(--preview-primary-color)'}}>&#9670;</span>{exp.role}, <span className="font-normal italic ml-1">{exp.company}</span></h3>
                            <div className="text-xs font-medium text-gray-600 text-right">
                                <div>{exp.startDate} &mdash; {exp.endDate}</div>
                                {exp.location && <div className="italic">{exp.location}</div>}
                            </div>
                        </div>
                        <div className="pl-6 mt-1">
                            <DescriptionRenderer content={exp.description} />
                        </div>
                    </div>
                ))}
            </Section>
        )}
        
        {/* Education */}
        {education && education.length > 0 && (
            <Section title="Education">
                {education.map(edu => (
                    <div key={edu.id} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-baseline">
                             <h3 className="font-bold text-sm flex items-center"><span className="text-xl mr-2" style={{color: 'var(--preview-primary-color)'}}>&#9670;</span>{edu.institution}</h3>
                            <div className="text-xs font-medium text-gray-600">{edu.startDate} &mdash; {edu.endDate}</div>
                        </div>
                        <div className="pl-6 flex justify-between items-baseline">
                            <h4 className="text-sm italic">{edu.degree}</h4>
                             <p className="text-xs italic text-gray-600">{edu.description}</p>
                        </div>
                    </div>
                ))}
            </Section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
            <Section title="Skills">
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                    {skills.map(skill => (
                        <div key={skill.id} className="flex items-center">
                           <span>{skill.name}</span>
                           <DottedLine />
                        </div>
                    ))}
                </div>
            </Section>
        )}

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
            <Section title="Achievements" className="mt-4">
                <div className="space-y-2">
                    {achievements.map(ach => (
                        <div key={ach.id} className="text-sm text-gray-800 flex">
                           <span className="font-bold mr-2">&#8226;</span>
                           <p className="flex-1">{ach.description.replace(/^•\s*/, '')}</p>
                        </div>
                    ))}
                </div>
            </Section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
            <Section title="Projects">
                 {projects.map(proj => (
                    <div key={proj.id} className="mb-3 last:mb-0 text-sm">
                        <h3 className="font-bold text-sm inline">{proj.name}: </h3>
                        <p className="inline">{proj.description}</p>
                        {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2 text-blue-600">{proj.url}</a>}
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
