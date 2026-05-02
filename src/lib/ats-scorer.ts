
import { ResumeData, SectionId } from './types';

export interface SectionScore {
  score: number;
  maxScore: number;
  tips: string[];
}

export interface AtsScoreResult {
  totalScore: number;
  sections: Record<string, SectionScore>;
}

const ACTION_VERBS = [
    'developed', 'optimized', 'built', 'designed', 'architected', 
    'engineered', 'implemented', 'led', 'managed', 'streamlined',
    'increased', 'decreased', 'reduced', 'improved', 'created'
];

const BACKEND_KEYWORDS = [
    'python', 'django', 'rest api', 'drf', 'fastapi', 
    'docker', 'postgresql', 'aws', 'celery', 'redis', 
    'ci/cd', 'kubernetes', 'microservices', 'sql'
];

export function calculateAtsScore(data: ResumeData): AtsScoreResult {
  const sections: Record<string, SectionScore> = {};
  let totalScore = 0;

  // 1. Summary Score (Max 25)
  const summary = data.personalDetails.summary || '';
  const summaryWords = summary.toLowerCase().split(/\s+/);
  let summaryScore = 0;
  const summaryTips: string[] = [];

  if (summary.length > 50 && summary.length < 500) summaryScore += 10;
  else summaryTips.push('Summary should be between 200-500 characters.');

  const foundKeywords = BACKEND_KEYWORDS.filter(k => summary.toLowerCase().includes(k));
  summaryScore += Math.min(foundKeywords.length * 3, 15);
  if (foundKeywords.length < 3) summaryTips.push('Add more keywords like Django, AWS, or Docker to your summary.');

  sections['summary'] = { score: summaryScore, maxScore: 25, tips: summaryTips };

  // 2. Skills Score (Max 25)
  let skillsScore = 0;
  const skillsTips: string[] = [];
  const totalSkills = data.skills.reduce((acc, cat) => acc + cat.skills.length, 0);

  if (data.skills.length >= 3) skillsScore += 10;
  else skillsTips.push('Group your skills into at least 3 categories (e.g., Languages, Frameworks, Tools).');

  if (totalSkills >= 10) skillsScore += 15;
  else skillsTips.push('List at least 10 relevant technical skills.');

  sections['skills'] = { score: skillsScore, maxScore: 25, tips: skillsTips };

  // 3. Experience Score (Max 30)
  let expScore = 0;
  const expTips: string[] = [];
  
  if (data.experience.length > 0) {
    let hasActionVerbs = false;
    let hasMetrics = false;

    data.experience.forEach(exp => {
      const desc = (exp.description || '').toLowerCase();
      if (ACTION_VERBS.some(v => desc.includes(v))) hasActionVerbs = true;
      if (/\d+%|\d+\s*users|\d+\s*reports|\d+\s*ms/.test(desc)) hasMetrics = true;
    });

    if (hasActionVerbs) expScore += 15;
    else expTips.push('Start your bullet points with action verbs (e.g., Developed, Optimized).');

    if (hasMetrics) expScore += 15;
    else expTips.push('Include measurable impact (e.g., 30% faster, 5000+ users).');
  } else {
    expTips.push('Add your professional work experience.');
  }

  sections['experience'] = { score: expScore, maxScore: 30, tips: expTips };

  // 4. Projects Score (Max 20)
  let projScore = 0;
  const projTips: string[] = [];

  if (data.projects.length >= 2) projScore += 10;
  else projTips.push('List at least 2 relevant technical projects.');

  const hasGoodDesc = data.projects.every(p => (p.description || '').length > 50);
  if (hasGoodDesc && data.projects.length > 0) projScore += 10;
  else projTips.push('Provide detailed descriptions for each project (Problem-Solution-Result).');

  sections['projects'] = { score: projScore, maxScore: 20, tips: projTips };

  totalScore = Object.values(sections).reduce((acc, s) => acc + s.score, 0);

  return { totalScore, sections };
}
