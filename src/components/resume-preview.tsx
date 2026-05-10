
"use client";

import React from 'react';
import { useResumeStore } from '@/hooks/use-resume-store';
import { Mail, Phone, Globe, MapPin, ExternalLink, Briefcase, GraduationCap, Star, Lightbulb, Trophy, StarIcon } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const Section = ({ title, icon, children, className, isAts }: { title: string, icon: React.ReactNode, children: React.ReactNode, className?: string, isAts?: boolean }) => (
    <section className={`mb-6 ${className}`}>
        <h2 className={`flex items-center text-lg font-bold uppercase mb-2 ${isAts ? 'border-b-2 pb-1' : ''}`} style={{ color: isAts ? '#000' : 'var(--preview-primary-color)', borderColor: isAts ? '#000' : 'var(--preview-primary-color)' }}>
            {!isAts && icon}
            <span className={!isAts ? "ml-2" : ""}>{title}</span>
        </h2>
        {!isAts && <div className="border-t-2" style={{ borderColor: 'var(--preview-primary-color)' }}></div>}
        <div className={!isAts ? "pt-3" : "pt-1"}>
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
                return <li key={index} className="text-justify">{cleanedLine}</li>;
            })}
        </ul>
    );
};

const ResumePreview = React.forwardRef<HTMLDivElement>((props, ref) => {
    const { resumeData, design, isInitialized } = useResumeStore();
    const { personalDetails, experience, education, skills, projects, achievements, customSections, sectionOrder } = resumeData;

    const isAts = design.template === 'ats';

    const styles = {
        '--preview-primary-color': isAts ? '#000' : design.primaryColor,
        fontSize: `${design.fontSize}pt`,
        fontFamily: isAts ? 'Times New Roman, serif' : design.fontFamily,
    } as React.CSSProperties;

    const hasContent = (arr: any[] | undefined) => Array.isArray(arr) && arr.length > 0 && arr.some(item => Object.values(item).some(v => !!v));

    const sectionComponents: Record<string, React.ReactNode> = {
        experience: hasContent(experience) && (
            <Section key="experience" title="Work Experience" icon={<Briefcase className="w-5 h-5" />} isAts={isAts}>
                {experience.map(exp => (
                    (exp.role || exp.company) &&
                    <div key={exp.id} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-base">{exp.role && `${exp.role} | `}{exp.company}</h3>
                            <div className="text-sm font-medium text-gray-700 text-right">
                                <div>{exp.startDate && `${exp.startDate} – `}{exp.endDate}</div>
                                {exp.location && <div className="italic">{exp.location}</div>}
                            </div>
                        </div>
                        <DescriptionRenderer content={exp.description} />
                    </div>
                ))}
            </Section>
        ),
        education: hasContent(education) && (
            <Section key="education" title="Education" icon={<GraduationCap className="w-5 h-5" />} isAts={isAts}>
                {education.map(edu => {
                    if (!edu.institution && !edu.degree) return null;
                    
                    const endYear = edu.endDate ? edu.endDate.match(/\d{4}/)?.[0] || edu.endDate : '';
                    
                    return (
                        <div key={edu.id} className="mb-3 last:mb-0">
                            {isAts ? (
                                <div className="text-sm">
                                    <span className="font-bold">{edu.degree}</span>
                                    {edu.institution && <span> – {edu.institution}</span>}
                                    {edu.location && <span>, {edu.location}</span>}
                                    {endYear && <span> ({endYear})</span>}
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-base">{edu.institution}</h3>
                                        <p className="text-sm font-medium text-gray-700">{edu.startDate && `${edu.startDate} – `}{edu.endDate}</p>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <h4 className="text-base italic">{edu.degree}</h4>
                                        <p className="text-sm italic text-gray-700">{edu.description}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </Section>
        ),
        skills: skills && skills.some(s => s.category || s.skills.length > 0) && (
            <Section key="skills" title="Skills" icon={<Star className="w-5 h-5" />} isAts={isAts}>
                <div className="space-y-2">
                    {skills.map(category => (
                        (category.category || category.skills.length > 0) && (
                            <div key={category.id} className={isAts ? "flex gap-2 text-sm" : ""}>
                                {category.category && <h3 className="font-bold text-sm min-w-[100px]">{category.category}:</h3>}
                                <div className={isAts ? "flex flex-wrap gap-x-1" : "flex flex-wrap gap-x-2 gap-y-2"}>
                                    {category.skills.map((skill, idx) => (
                                        skill.name && (
                                            <React.Fragment key={skill.id}>
                                                {isAts ? (
                                                    <span>{skill.name}{idx < category.skills.length - 1 ? ',' : ''}</span>
                                                ) : (
                                                    <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">{skill.name}</span>
                                                )}
                                            </React.Fragment>
                                        )
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </Section>
        ),
        projects: hasContent(projects) && (
            <Section key="projects" title="Projects" icon={<Lightbulb className="w-5 h-5" />} isAts={isAts}>
                {projects.map(proj => (
                    proj.name &&
                    <div key={proj.id} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-base">{proj.name}</h3>
                            {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">{proj.url}</a>}
                        </div>
                        {proj.intro && <p className="text-sm italic text-gray-700 my-1 text-justify">{proj.intro}</p>}
                        <DescriptionRenderer content={proj.description} />
                    </div>
                ))}
            </Section>
        ),
        achievements: hasContent(achievements) && (
            <Section key="achievements" title="Achievements" icon={<Trophy className="w-5 h-5" />} isAts={isAts}>
                {achievements.map(ach => (
                    ach.title &&
                    <div key={ach.id} className="mb-3 last:mb-0">
                        <h3 className="font-bold text-base">{ach.title}</h3>
                        <DescriptionRenderer content={ach.description} />
                    </div>
                ))}
            </Section>
        )
    };

    if (customSections) {
        customSections.forEach(section => {
            if (section.title || section.description) {
                sectionComponents[section.id] = (
                    <Section key={section.id} title={section.title} icon={<StarIcon className="w-5 h-5" />} isAts={isAts}>
                        <DescriptionRenderer content={section.description} />
                    </Section>
                );
            }
        });
    }


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
        <div ref={ref} id="resume-preview" className="bg-white text-gray-800 shadow-lg rounded-lg w-full max-w-[210mm] min-h-[297mm] mx-auto p-12 transition-all duration-300 print:shadow-none print:rounded-none">
            <div style={styles}>
                {/* Header */}
                <header className={`${isAts ? 'text-left' : 'text-center'} mb-6`}>
                    <h1 className="text-4xl font-bold uppercase tracking-tight">{personalDetails.name}</h1>
                    {personalDetails.role && <p className="text-xl mt-1 font-bold" style={{ color: isAts ? '#000' : 'var(--preview-primary-color)' }}>{personalDetails.role}</p>}
                    <div className={`flex ${isAts ? 'justify-start' : 'justify-center'} items-center gap-x-4 gap-y-1 mt-4 text-sm flex-wrap`}>
                        {personalDetails.email && (
                            <a href={`mailto:${personalDetails.email}`} className="flex items-center gap-1 hover:underline">
                                {!isAts && <Mail className="w-4 h-4" />} {personalDetails.email}
                            </a>
                        )}
                        {personalDetails.phone && (
                            <span className="flex items-center gap-1">
                                {!isAts && <Phone className="w-4 h-4" />} {personalDetails.phone}
                            </span>
                        )}
                        {personalDetails.location && (
                            <span className="flex items-center gap-1">
                                {!isAts && <MapPin className="w-4 h-4" />} {personalDetails.location}
                            </span>
                        )}
                        {personalDetails.links && personalDetails.links.map(link => (
                            <a key={link.id} href={link.url} target="_blank" rel="noreferrer noopener" className="flex items-center gap-1 hover:underline">
                                {!isAts && <Globe className="w-4 h-4" />} {isAts ? link.url : link.label}
                            </a>
                        ))}
                    </div>
                </header>

                {/* Summary */}
                {personalDetails.summary && (
                    <section className="mb-6">
                        <p className="text-justify text-sm">{personalDetails.summary}</p>
                    </section>
                )}

                {/* Dynamic Sections */}
                {sectionOrder && sectionOrder.map(sectionId => sectionComponents[sectionId])}

            </div>
        </div>
    );
});
ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
