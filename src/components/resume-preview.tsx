"use client";

import { useResumeStore } from '@/hooks/use-resume-store.tsx';
import { Mail, Phone, Globe, MapPin, ExternalLink, Briefcase, GraduationCap, Star, Lightbulb } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const Section = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <section className="mb-6">
        <div className="flex items-center mb-3">
            {icon}
            <h2 className="text-lg font-bold ml-2 uppercase tracking-widest" style={{ color: 'var(--preview-primary-color)' }}>{title}</h2>
        </div>
        {children}
    </section>
);

const DescriptionRenderer = ({ content }: { content?: string }) => {
    if (!content) return null;
    return (
        <div className="text-sm text-gray-700 space-y-1">
            {content.split('\n').map((line, index) => (
                <div key={index}>
                    {line.startsWith('•') ? <span className="mr-2 text-primary font-bold">•</span> : null}
                    {line.replace(/^•\s*/, '')}
                </div>
            ))}
        </div>
    );
};


export default function ResumePreview() {
  const { resumeData, design, isInitialized } = useResumeStore();
  const { personalDetails, experience, education, skills, projects } = resumeData;

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
    <div id="resume-preview" className="bg-white text-gray-800 shadow-lg rounded-lg w-full max-w-[210mm] min-h-[297mm] mx-auto p-12 transition-all duration-300 print:shadow-none" style={styles}>
        {/* Header */}
        <header className="text-center mb-8 border-b-2 pb-4" style={{ borderColor: design.primaryColor }}>
            <h1 className="text-4xl font-bold" style={{ color: design.primaryColor }}>{personalDetails.name}</h1>
            <div className="flex justify-center items-center gap-x-4 gap-y-1 mt-3 text-xs flex-wrap">
                {personalDetails.email && <span className="flex items-center"><Mail className="mr-1.5 h-3 w-3"/>{personalDetails.email}</span>}
                {personalDetails.phone && <span className="flex items-center"><Phone className="mr-1.5 h-3 w-3"/>{personalDetails.phone}</span>}
                {personalDetails.location && <span className="flex items-center"><MapPin className="mr-1.5 h-3 w-3"/>{personalDetails.location}</span>}
                {personalDetails.website && <a href={personalDetails.website} target="_blank" rel="noreferrer noopener" className="flex items-center hover:underline"><Globe className="mr-1.5 h-3 w-3"/>{personalDetails.website}</a>}
            </div>
        </header>

        {/* Summary */}
        {personalDetails.summary && (
             <section className="mb-6">
                <p className="text-sm text-justify">{personalDetails.summary}</p>
            </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
            <Section icon={<Briefcase className="h-5 w-5"/>} title="Work Experience">
                {experience.map(exp => (
                    <div key={exp.id} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-semibold text-base">{exp.role}</h3>
                            <div className="text-xs font-medium text-gray-600">{exp.startDate} - {exp.endDate}</div>
                        </div>
                        <h4 className="text-sm font-medium italic mb-1">{exp.company}</h4>
                        <DescriptionRenderer content={exp.description} />
                    </div>
                ))}
            </Section>
        )}
        
        {/* Education */}
        {education.length > 0 && (
            <Section icon={<GraduationCap className="h-5 w-5"/>} title="Education">
                {education.map(edu => (
                    <div key={edu.id} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-semibold text-base">{edu.degree}</h3>
                            <div className="text-xs font-medium text-gray-600">{edu.startDate} - {edu.endDate}</div>
                        </div>
                        <h4 className="text-sm font-medium italic mb-1">{edu.institution}</h4>
                        <p className="text-sm text-gray-700">{edu.description}</p>
                    </div>
                ))}
            </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
            <Section icon={<Lightbulb className="h-5 w-5"/>} title="Projects">
                 {projects.map(proj => (
                    <div key={proj.id} className="mb-3 last:mb-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-base">{proj.name}</h3>
                            {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><ExternalLink className="h-3 w-3"/></a>}
                        </div>
                        <p className="text-sm text-gray-700">{proj.description}</p>
                    </div>
                ))}
            </Section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
            <Section icon={<Star className="h-5 w-5"/>} title="Skills">
                <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                        <span key={skill.id} className="text-sm bg-gray-200 px-3 py-1 rounded-full">{skill.name}</span>
                    ))}
                </div>
            </Section>
        )}
    </div>
  );
}
