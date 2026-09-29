import { ResumeData, DesignConfig, AnimationConfig } from '../types/resume';

// Completely clean, blank initial resume - no fake user, no preloaded personal data
export const initialResumeData: ResumeData = {
  id: 'resume-1',
  name: 'Untitled Resume',
  updatedAt: 'Just now',
  atsScore: 70,
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    photoUrl: '',
    showPhoto: false,
    fieldVisibility: {
      email: true,
      phone: true,
      location: true,
      website: true,
      linkedin: true,
      github: true,
    },
  },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  languages: [],
  achievements: [],
  customSections: [],
};

export const sampleResumeData: ResumeData = {
  id: 'sample-resume',
  name: 'Sample Resume',
  updatedAt: 'Just now',
  atsScore: 88,
  personal: {
    fullName: 'Jane Doe',
    jobTitle: 'Software Engineer',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    website: 'janedoe.dev',
    linkedin: 'linkedin.com/in/janedoe',
    github: 'github.com/janedoe',
    photoUrl: '',
    showPhoto: false,
    fieldVisibility: {
      email: true,
      phone: true,
      location: true,
      website: true,
      linkedin: true,
      github: true,
    },
  },
  summary:
    'Dedicated Software Engineer with a solid foundation in modern web development, full-stack architecture, and collaborative problem solving. Passionate about writing clean, maintainable code.',
  education: [
    {
      id: 'sample-edu-1',
      institution: 'University of Technology',
      degree: 'B.S. in Computer Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2020',
      endDate: '2024',
      grade: '3.8 GPA',
      description: 'Core focus in Algorithms, Software Systems, and Distributed Computing.',
    },
  ],
  experience: [
    {
      id: 'sample-exp-1',
      jobTitle: 'Software Engineer',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: '2023',
      endDate: 'Present',
      isCurrent: true,
      highlights: [
        'Developed scalable web components using React, TypeScript, and modern styling utilities.',
        'Engineered high-throughput REST APIs, improving overall system responsiveness by 25%.',
      ],
    },
  ],
  projects: [
    {
      id: 'sample-proj-1',
      title: 'TaskFlow Application',
      description: 'Collaborative task management tool with real-time updates and user dashboards.',
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      githubUrl: 'https://github.com/janedoe/taskflow',
      demoUrl: 'https://taskflow.demo.app',
      startDate: '2023',
      endDate: '2024',
      highlights: ['Implemented responsive interface and RESTful API endpoints.'],
    },
  ],
  skills: [
    { id: 's-1', name: 'JavaScript', category: 'Programming', level: 5 },
    { id: 's-2', name: 'TypeScript', category: 'Programming', level: 5 },
    { id: 's-3', name: 'React', category: 'Frontend', level: 5 },
    { id: 's-4', name: 'Node.js', category: 'Backend', level: 4 },
    { id: 's-5', name: 'Python', category: 'Programming', level: 4 },
    { id: 's-6', name: 'SQL', category: 'Database', level: 4 },
    { id: 's-7', name: 'Git', category: 'Tools', level: 5 },
  ],
  certifications: [
    {
      id: 'c-1',
      name: 'Certified Cloud Practitioner',
      issuer: 'Cloud Provider',
      issueDate: '2023',
      credentialId: 'CP-12345',
      url: '',
    },
  ],
  languages: [
    { id: 'l-1', name: 'English', proficiency: 'Native' },
  ],
  achievements: [
    {
      id: 'a-1',
      title: 'Academic Excellence Award',
      date: '2023',
      description: 'Honored for outstanding performance in software engineering coursework.',
    },
  ],
  customSections: [],
};

export const initialDesignConfig: DesignConfig = {
  templateId: 'modern-blue',
  primaryColor: '#2563eb',
  headingColor: '#0f172a',
  accentColor: '#3b82f6',
  backgroundColor: '#ffffff',
  fontFamily: 'Inter',
  fontSize: 'md',
  lineHeight: 'normal',
  sectionSpacing: 'comfortable',
  margins: 'normal',
  photoShape: 'rounded',
  photoSize: 'md',
  sectionOrder: [
    'summary',
    'education',
    'experience',
    'projects',
    'skills',
    'certifications',
    'achievements',
    'languages',
  ],
  hiddenSections: [],
};

export const initialAnimationConfig: AnimationConfig = {
  enabled: false,
  textAnimation: 'none',
  sectionAnimation: 'none',
  photoAnimation: 'none',
  duration: 0.6,
  delay: 0.1,
  trigger: 'onload',
};

// Starts with 1 completely blank resume
export const sampleResumesList: ResumeData[] = [initialResumeData];
