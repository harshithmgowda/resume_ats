import { ResumeData } from '../types/resume';

export interface ATSAnalysisResult {
  score: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'Unrated';
  summary: string;
  categories: {
    name: string;
    score: number;
    weight: string;
    status: 'good' | 'warning' | 'error';
    feedback: string;
  }[];
  passedChecks: string[];
  warningChecks: string[];
  suggestions: {
    id: string;
    section: string;
    title: string;
    description: string;
    sampleFix: string;
  }[];
}

export const analyzeResumeATS = (resume: ResumeData): ATSAnalysisResult => {
  const hasName = Boolean(resume.personal?.fullName?.trim());
  const hasTitle = Boolean(resume.personal?.jobTitle?.trim());
  const hasEmail = Boolean(resume.personal?.email?.trim());
  const hasPhone = Boolean(resume.personal?.phone?.trim());
  const hasLocation = Boolean(resume.personal?.location?.trim());
  const hasLinks = Boolean(
    resume.personal?.linkedin?.trim() ||
    resume.personal?.github?.trim() ||
    resume.personal?.website?.trim()
  );

  const summaryText = resume.summary?.trim() || '';
  const skillsList = resume.skills || [];
  const expList = resume.experience || [];
  const projList = resume.projects || [];
  const eduList = resume.education || [];

  const allHighlights = [
    ...expList.flatMap((e) => e.highlights || []),
    ...projList.flatMap((p) => p.highlights || []),
  ].filter((h) => typeof h === 'string' && h.trim().length > 0);

  const isCompletelyEmpty =
    !hasName &&
    !hasTitle &&
    !hasEmail &&
    !hasPhone &&
    !hasLocation &&
    !hasLinks &&
    summaryText.length === 0 &&
    skillsList.length === 0 &&
    expList.length === 0 &&
    projList.length === 0 &&
    eduList.length === 0;

  if (isCompletelyEmpty) {
    return {
      score: 0,
      grade: 'Unrated',
      summary:
        'Your resume is currently blank. Start adding your contact info, summary, skills, and work experience to calculate your live ATS compatibility score.',
      categories: [
        {
          name: 'Contact & Links',
          score: 0,
          weight: '20%',
          status: 'error',
          feedback: 'No contact information provided yet.',
        },
        {
          name: 'Keywords & Skills',
          score: 0,
          weight: '25%',
          status: 'error',
          feedback: 'No technical skills or keywords detected.',
        },
        {
          name: 'Experience Impact',
          score: 0,
          weight: '30%',
          status: 'error',
          feedback: 'No work experience or projects added.',
        },
        {
          name: 'Professional Summary',
          score: 0,
          weight: '15%',
          status: 'error',
          feedback: 'No executive summary provided.',
        },
        {
          name: 'Education & Credentials',
          score: 0,
          weight: '10%',
          status: 'warning',
          feedback: 'No education credentials listed.',
        },
      ],
      passedChecks: [],
      warningChecks: [
        'Add your full name, email, and phone number',
        'List target technical skills and frameworks',
        'Add work experience or projects with quantifiable achievements',
        'Write a concise 2-3 sentence professional summary',
      ],
      suggestions: [
        {
          id: 'sug-start-contact',
          section: 'Contact',
          title: 'Fill in Contact Details',
          description: 'Recruiters and ATS parsers require valid email, phone, and location header.',
          sampleFix: 'Enter your name, primary email, phone number, and location in the Personal Info section.',
        },
        {
          id: 'sug-start-skills',
          section: 'Skills',
          title: 'Add Target Skills',
          description: 'Add languages, frameworks, databases, and developer tools you work with.',
          sampleFix: 'React, TypeScript, Node.js, Python, PostgreSQL, Docker, Git, REST APIs',
        },
      ],
    };
  }

  const passedChecks: string[] = [];
  const warningChecks: string[] = [];
  const suggestions: any[] = [];

  // 1. Contact & Links (Weight: 20%)
  let contactScore = 0;
  if (hasName) contactScore += 20;
  if (hasTitle) contactScore += 15;
  if (hasEmail) contactScore += 20;
  if (hasPhone) contactScore += 15;
  if (hasLocation) contactScore += 10;
  if (hasLinks) contactScore += 20;
  contactScore = Math.min(100, contactScore);

  if (hasEmail && hasPhone && hasLocation) {
    passedChecks.push('Complete contact details (Email, Phone, Location)');
  } else {
    warningChecks.push('Incomplete contact info (ensure email, phone, and city are provided)');
  }

  if (hasLinks) {
    passedChecks.push('Professional profile links detected (LinkedIn / GitHub / Portfolio)');
  } else {
    warningChecks.push('Missing LinkedIn, GitHub, or portfolio website URL');
  }

  // 2. Keywords & Skills (Weight: 25%)
  let skillsScore = 0;
  if (skillsList.length >= 10) {
    skillsScore = 100;
    passedChecks.push(`${skillsList.length} technical skills detected across multiple categories`);
  } else if (skillsList.length >= 7) {
    skillsScore = 80;
    passedChecks.push(`${skillsList.length} skills listed; expand towards 10+ for optimal keyword density`);
  } else if (skillsList.length >= 4) {
    skillsScore = 60;
    warningChecks.push('Only a few skills listed; add more relevant tools and languages');
  } else if (skillsList.length >= 1) {
    skillsScore = 30;
    warningChecks.push('Very few skills listed; ATS scanners match against dozens of tech terms');
  } else {
    skillsScore = 0;
    warningChecks.push('No technical skills listed');
  }

  // 3. Experience Impact & Metrics (Weight: 30%)
  let expScore = 0;
  const actionVerbs = [
    'Architected', 'Engineered', 'Optimized', 'Developed', 'Spearheaded',
    'Deployed', 'Refactored', 'Accelerated', 'Implemented', 'Designed',
    'Scaled', 'Automated', 'Led', 'Built', 'Constructed'
  ];

  const foundVerbs = actionVerbs.filter((v) =>
    allHighlights.some((h) => h.toLowerCase().includes(v.toLowerCase()))
  );
  const metricHighlights = allHighlights.filter((h) =>
    /\d+%|\d+k|\b\d+\b|\$[\d,]+/i.test(h)
  );

  if (expList.length === 0 && projList.length === 0) {
    expScore = 0;
    warningChecks.push('No work experience or projects entered');
    suggestions.push({
      id: 'sug-exp-missing',
      section: 'Experience',
      title: 'Add Work Experience or Projects',
      description: 'Add your software engineering internships, jobs, or personal projects with bullet points.',
      sampleFix: 'Engineered a real-time web application using React and Node.js serving 500+ active users.',
    });
  } else {
    // Base entries score
    expScore += Math.min(30, expList.length * 15 + projList.length * 10);

    // Metrics score
    if (metricHighlights.length >= 3) {
      expScore += 35;
      passedChecks.push(`Strong quantitative metrics (${metricHighlights.length} measurable impact bullet points)`);
    } else if (metricHighlights.length >= 1) {
      expScore += 20;
      passedChecks.push('Measurable quantitative metric detected');
      warningChecks.push('Add more metric-driven results (% throughput, latency, user counts)');
    } else {
      warningChecks.push('Lacks measurable impact metrics (percentages, numbers, or efficiency gains)');
      suggestions.push({
        id: 'sug-metric',
        section: 'Experience',
        title: 'Add Quantifiable Results',
        description: 'Replace generic task statements with metrics like "reduced latency by 40%" or "improved throughput by 65%".',
        sampleFix: 'Accelerated document processing throughput by 65% using asynchronous Celery workers.',
      });
    }

    // Action verbs score
    if (foundVerbs.length >= 3) {
      expScore += 35;
      passedChecks.push(`High-impact action verbs used (${foundVerbs.slice(0, 3).join(', ')})`);
    } else if (foundVerbs.length >= 1) {
      expScore += 20;
      passedChecks.push(`Action verbs detected (${foundVerbs.join(', ')})`);
    } else {
      warningChecks.push('Strengthen bullet points using powerful action verbs (e.g. Engineered, Spearheaded, Optimized)');
    }
  }
  expScore = Math.min(100, expScore);

  // 4. Summary & Statement (Weight: 15%)
  let summaryScore = 0;
  if (summaryText.length >= 120) {
    summaryScore = 100;
    passedChecks.push('Comprehensive professional summary statement');
  } else if (summaryText.length >= 60) {
    summaryScore = 75;
    passedChecks.push('Professional summary included');
  } else if (summaryText.length > 0) {
    summaryScore = 40;
    warningChecks.push('Executive summary is very brief; expand to 2-3 sentences');
  } else {
    summaryScore = 0;
    warningChecks.push('Summary is missing');
    suggestions.push({
      id: 'sug-summary',
      section: 'Summary',
      title: 'Add Professional Summary',
      description: 'Add 2-3 sentences highlighting your engineering focus, key languages, and career goals.',
      sampleFix: 'Full-stack software engineer with experience building scalable web applications in React, TypeScript, and Python. Passionate about developer tooling and performance optimization.',
    });
  }

  // 5. Education & Credentials (Weight: 10%)
  let eduScore = 0;
  if (eduList.length >= 1) {
    eduScore = 100;
    passedChecks.push('Accredited education & university credentials verified');
  } else {
    eduScore = 0;
    warningChecks.push('No education credentials listed');
  }

  // Calculate final weighted score strictly from input
  const finalScore = Math.round(
    contactScore * 0.20 +
    skillsScore * 0.25 +
    expScore * 0.30 +
    summaryScore * 0.15 +
    eduScore * 0.10
  );

  const grade =
    finalScore >= 90
      ? 'A+'
      : finalScore >= 80
      ? 'A'
      : finalScore >= 65
      ? 'B+'
      : finalScore >= 50
      ? 'B'
      : finalScore > 0
      ? 'C'
      : 'Unrated';

  const summary =
    finalScore >= 85
      ? 'Excellent ATS profile! Your resume has clear section headings, strong keyword density, and quantifiable metrics.'
      : finalScore >= 65
      ? 'Solid foundation. Adding more quantifiable metrics and expanding technical keywords will boost your match rate.'
      : finalScore > 0
      ? 'In-progress draft. Fill in missing sections and bullet points to raise your ATS score.'
      : 'Your resume is currently blank. Start adding details in the builder to calculate your live ATS score.';

  return {
    score: finalScore,
    grade,
    summary,
    categories: [
      {
        name: 'Contact & Links',
        score: contactScore,
        weight: '20%',
        status: contactScore >= 80 ? 'good' : contactScore >= 40 ? 'warning' : 'error',
        feedback:
          contactScore >= 80
            ? 'Complete contact info and verified portfolio links detected.'
            : 'Add your email, phone, location, and GitHub or LinkedIn profiles.',
      },
      {
        name: 'Keywords & Skills',
        score: skillsScore,
        weight: '25%',
        status: skillsScore >= 75 ? 'good' : skillsScore >= 40 ? 'warning' : 'error',
        feedback:
          skillsScore >= 75
            ? `${skillsList.length} technical skills found across categories.`
            : `Only ${skillsList.length} skills found. Add more target languages and tools.`,
      },
      {
        name: 'Experience Impact',
        score: expScore,
        weight: '30%',
        status: expScore >= 70 ? 'good' : expScore >= 35 ? 'warning' : 'error',
        feedback:
          expScore >= 70
            ? 'Strong bullet points with action verbs and quantifiable results.'
            : 'Ensure experience and projects include percentages, user counts, or performance gains.',
      },
      {
        name: 'Professional Summary',
        score: summaryScore,
        weight: '15%',
        status: summaryScore >= 70 ? 'good' : summaryScore > 0 ? 'warning' : 'error',
        feedback:
          summaryScore >= 70
            ? 'Concise, high-impact summary statement.'
            : 'Add an executive summary detailing your core technical stack and achievements.',
      },
      {
        name: 'Education & Credentials',
        score: eduScore,
        weight: '10%',
        status: eduScore >= 70 ? 'good' : 'warning',
        feedback:
          eduScore >= 70
            ? 'Degree and academic institution credentials present.'
            : 'Add your university degree, field of study, and graduation year.',
      },
    ],
    passedChecks,
    warningChecks,
    suggestions,
  };
};

export interface JobMatchResult {
  jobTitle: string;
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestedAdditions: string[];
}

export const matchJobDescription = (resume: ResumeData, jobDesc: string): JobMatchResult => {
  const commonTech = [
    'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'FastAPI', 'Docker',
    'Kubernetes', 'AWS', 'PostgreSQL', 'MongoDB', 'Redis', 'PyTorch', 'TensorFlow',
    'Git', 'CI/CD', 'GraphQL', 'Next.js', 'Tailwind', 'Microservices', 'REST API',
    'Agile', 'Scrum', 'Linux', 'GCP', 'OpenCV', 'SQL'
  ];

  if (!jobDesc || !jobDesc.trim()) {
    return {
      jobTitle: 'Target Role',
      matchPercentage: 0,
      matchedKeywords: [],
      missingKeywords: [],
      suggestedAdditions: ['Paste a job description to calculate live keyword overlap.'],
    };
  }

  const resumeText = JSON.stringify(resume).toLowerCase();
  const descLower = jobDesc.toLowerCase();

  const foundInJob = commonTech.filter((tech) => descLower.includes(tech.toLowerCase()));
  const matchedKeywords = foundInJob.filter((tech) => resumeText.includes(tech.toLowerCase()));
  const missingKeywords = foundInJob.filter((tech) => !resumeText.includes(tech.toLowerCase()));

  // Calculate percentage strictly from overlap
  let matchPercentage = 0;
  if (foundInJob.length > 0) {
    matchPercentage = Math.round((matchedKeywords.length / foundInJob.length) * 100);
  }

  const suggestedAdditions = missingKeywords.slice(0, 4).map((tech) => `Add "${tech}" under Technical Skills or project highlights if familiar.`);

  return {
    jobTitle: descLower.includes('engineer') ? 'Software Engineering Role' : 'Technical Position',
    matchPercentage,
    matchedKeywords,
    missingKeywords,
    suggestedAdditions,
  };
};
