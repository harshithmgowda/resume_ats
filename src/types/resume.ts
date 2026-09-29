export type SectionKey =
  | 'personal'
  | 'summary'
  | 'education'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'languages'
  | 'achievements'
  | 'customSections';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photoUrl: string;
  showPhoto: boolean;
  fieldVisibility: {
    email: boolean;
    phone: boolean;
    location: boolean;
    website: boolean;
    linkedin: boolean;
    github: boolean;
  };
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  highlights: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export type SkillCategory =
  | 'Programming'
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'AI/ML'
  | 'Tools'
  | 'Cloud';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 1 to 5
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  url: string;
}

export type LanguageProficiency = 'Basic' | 'Intermediate' | 'Professional' | 'Native';

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
}

export interface AchievementItem {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  id: string;
  name: string;
  updatedAt: string;
  atsScore: number;
  personal: PersonalInfo;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  achievements: AchievementItem[];
  customSections: CustomSection[];
}

export type FontFamilyType =
  | 'Inter'
  | 'Plus Jakarta Sans'
  | 'Roboto'
  | 'Poppins'
  | 'Montserrat'
  | 'Lato'
  | 'Open Sans'
  | 'Merriweather'
  | 'JetBrains Mono';

export type FontSizeType = 'sm' | 'md' | 'lg';
export type LineHeightType = 'tight' | 'normal' | 'relaxed';
export type SpacingType = 'compact' | 'comfortable' | 'spacious';
export type MarginType = 'compact' | 'normal' | 'generous';

export interface DesignConfig {
  templateId: string;
  primaryColor: string;
  headingColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: FontFamilyType;
  fontSize: FontSizeType;
  lineHeight: LineHeightType;
  sectionSpacing: SpacingType;
  margins: MarginType;
  photoShape: 'rounded' | 'circle' | 'square';
  photoSize: 'sm' | 'md' | 'lg';
  sectionOrder: SectionKey[];
  hiddenSections: SectionKey[];
}

export type TextAnimationType =
  | 'none'
  | 'fadeIn'
  | 'slideUp'
  | 'slideLeft'
  | 'slideRight'
  | 'typewriter'
  | 'scaleIn';

export type SectionAnimationType = 'none' | 'fade' | 'reveal' | 'slide';
export type PhotoAnimationType = 'none' | 'fade' | 'scale' | 'float';

export interface AnimationConfig {
  enabled: boolean;
  textAnimation: TextAnimationType;
  sectionAnimation: SectionAnimationType;
  photoAnimation: PhotoAnimationType;
  duration: number; // in seconds
  delay: number; // in seconds
  trigger: 'onload' | 'scroll';
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  usageCount: string;
  atsFriendly: boolean;
  isPro: boolean;
  badge?: string;
  tags: string[];
  previewColors: {
    primary: string;
    secondary: string;
    bg: string;
  };
  recommendedFor: string;
  defaultColors: {
    primary: string;
    heading: string;
    accent: string;
    background: string;
  };
}

export type ActiveView =
  | 'dashboard'
  | 'editor'
  | 'templates'
  | 'analyzer'
  | 'jobMatcher'
  | 'aiAssistant'
  | 'publicView'
  | 'landingPage';
