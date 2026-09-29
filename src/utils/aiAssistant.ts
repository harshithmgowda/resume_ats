import { ResumeData } from '../types/resume';

export interface AISuggestion {
  id: string;
  type: 'summary' | 'bullet' | 'skills' | 'rewrite';
  originalText: string;
  suggestedText: string;
  rationale: string;
}

export const AIHelper = {
  improveSummary: (currentSummary: string): AISuggestion => {
    return {
      id: 'sug-' + Date.now(),
      type: 'summary',
      originalText: currentSummary,
      suggestedText:
        'Results-driven professional with demonstrated expertise in architecting high-throughput systems, developing modern responsive web applications, and delivering quality software solutions. Proven track record in optimizing performance by 40% and collaborating across agile teams to deliver scalable software.',
      rationale:
        'Enhanced with high-impact power keywords, quantifiable accomplishments, and a clear career objective suitable for technical recruiters.',
    };
  },

  makeAtsFriendly: (currentText: string): AISuggestion => {
    return {
      id: 'sug-ats-' + Date.now(),
      type: 'rewrite',
      originalText: currentText,
      suggestedText:
        'Architected and implemented end-to-end full stack web applications utilizing React, TypeScript, FastAPI, and PostgreSQL with automated CI/CD deployment pipelines.',
      rationale:
        'Structured with standard job-market tech keywords and standardized verb phrasing easily indexed by ATS algorithms.',
    };
  },

  makeConcise: (currentText: string): AISuggestion => {
    return {
      id: 'sug-concise-' + Date.now(),
      type: 'rewrite',
      originalText: currentText,
      suggestedText:
        'Engineered responsive web interfaces using React and Tailwind CSS, increasing Lighthouse accessibility score to 98%.',
      rationale: 'Removed filler words, consolidated compound sentences, and focused strictly on the core metric.',
    };
  },

  improveBullet: (bullet: string): AISuggestion => {
    const isMetric = /\d+/.test(bullet);
    let suggestion = bullet;

    if (bullet.toLowerCase().includes('website') || bullet.toLowerCase().includes('react')) {
      suggestion = 'Developed and optimized responsive web interfaces using React and TypeScript, boosting page performance by 35% and improving Lighthouse accessibility to 98%.';
    } else if (bullet.toLowerCase().includes('python') || bullet.toLowerCase().includes('fastapi') || bullet.toLowerCase().includes('api')) {
      suggestion = 'Architected high-concurrency RESTful microservices with FastAPI and Redis, handling 5,000+ daily requests with sub-100ms response times.';
    } else if (bullet.toLowerCase().includes('model') || bullet.toLowerCase().includes('ai') || bullet.toLowerCase().includes('ml')) {
      suggestion = 'Trained and deployed fine-tuned transformer models with PyTorch, achieving 92.4% classification accuracy with streamlined GPU inference.';
    } else {
      suggestion = `Engineered and deployed scalable features utilizing modern architecture best practices, reducing execution bottlenecks and enhancing overall reliability.`;
    }

    return {
      id: 'sug-bullet-' + Date.now(),
      type: 'bullet',
      originalText: bullet,
      suggestedText: suggestion,
      rationale: 'Injected strong action verb ("Architected/Developed"), specific tech stack, and measurable business impact.',
    };
  },

  addActionVerb: (bullet: string): AISuggestion => {
    const verbs = ['Spearheaded', 'Architected', 'Engineered', 'Orchestrated', 'Optimized', 'Streamlined'];
    const chosen = verbs[Math.floor(Math.random() * verbs.length)];
    return {
      id: 'sug-verb-' + Date.now(),
      type: 'bullet',
      originalText: bullet,
      suggestedText: `${chosen} the implementation of ${bullet.replace(/^(Worked on|Did|Helped with|Was responsible for)\s*/i, '')}`,
      rationale: `Replaced passive phrasing with the authoritative leadership verb "${chosen}".`,
    };
  },

  generateSummaryFromProfile: (resume: ResumeData): AISuggestion => {
    const skillsList = resume.skills.slice(0, 5).map((s) => s.name).join(', ');
    return {
      id: 'sug-gen-' + Date.now(),
      type: 'summary',
      originalText: resume.summary,
      suggestedText: `${resume.personal.jobTitle || 'Software Engineer'} specializing in ${skillsList}. Experienced in full-stack architecture, API optimization, and applied software engineering. Committed to writing clean, maintainable code and solving complex algorithmic problems.`,
      rationale: 'Synthesized from your active profile, detected skills, and career focus.',
    };
  },
};
