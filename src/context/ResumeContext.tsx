import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  ResumeData,
  DesignConfig,
  AnimationConfig,
  ActiveView,
  PersonalInfo,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  SkillItem,
  CertificationItem,
  LanguageItem,
  AchievementItem,
  SectionKey,
} from '../types/resume';
import {
  initialResumeData,
  initialDesignConfig,
  initialAnimationConfig,
  sampleResumesList,
  sampleResumeData,
} from '../data/initialData';
import { templatesList } from '../data/templates';

interface ResumeContextType {
  resumes: ResumeData[];
  activeResumeId: string;
  currentResume: ResumeData;
  designConfig: DesignConfig;
  animationConfig: AnimationConfig;
  activeView: ActiveView;
  autosaveStatus: 'saved' | 'saving';
  favorites: string[];
  zoomLevel: number;
  previewAnimationKey: number;
  setActiveView: (view: ActiveView) => void;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;
  toggleFavorite: (templateId: string) => void;
  updateResume: (updater: (prev: ResumeData) => ResumeData) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  // Education
  addEducation: (item: Omit<EducationItem, 'id'>) => void;
  updateEducation: (id: string, item: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;
  // Experience
  addExperience: (item: Omit<ExperienceItem, 'id'>) => void;
  updateExperience: (id: string, item: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;
  addExperienceBullet: (expId: string, bullet: string) => void;
  updateExperienceBullet: (expId: string, index: number, bullet: string) => void;
  deleteExperienceBullet: (expId: string, index: number) => void;
  // Projects
  addProject: (item: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, item: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  addProjectBullet: (projId: string, bullet: string) => void;
  updateProjectBullet: (projId: string, index: number, bullet: string) => void;
  deleteProjectBullet: (projId: string, index: number) => void;
  // Skills
  addSkill: (skill: Omit<SkillItem, 'id'>) => void;
  deleteSkill: (id: string) => void;
  // Certifications
  addCertification: (cert: Omit<CertificationItem, 'id'>) => void;
  updateCertification: (id: string, cert: Partial<CertificationItem>) => void;
  deleteCertification: (id: string) => void;
  // Languages
  addLanguage: (lang: Omit<LanguageItem, 'id'>) => void;
  updateLanguage: (id: string, lang: Partial<LanguageItem>) => void;
  deleteLanguage: (id: string) => void;
  // Achievements
  addAchievement: (ach: Omit<AchievementItem, 'id'>) => void;
  updateAchievement: (id: string, ach: Partial<AchievementItem>) => void;
  deleteAchievement: (id: string) => void;
  // Design & Templates
  updateDesignConfig: (cfg: Partial<DesignConfig>) => void;
  setTemplate: (templateId: string) => void;
  reorderSections: (newOrder: SectionKey[]) => void;
  toggleSectionVisibility: (section: SectionKey) => void;
  // Animation
  updateAnimationConfig: (cfg: Partial<AnimationConfig>) => void;
  triggerPreviewAnimation: () => void;
  // Resumes CRUD
  switchResume: (id: string) => void;
  createNewResume: (templateId?: string, name?: string) => string;
  duplicateResume: (id: string) => string;
  deleteResume: (id: string) => void;
  resetToDemo: () => void;
  loadSampleData: () => void;
  clearResume: () => void;
  importResumeData: (data: Partial<ResumeData>) => void;
}


// Privacy-first: Purge any legacy browser storage so no previous user resume persists
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('resumeforge')) {
        localStorage.removeItem(key);
      }
    });
  }
} catch (e) {
  // ignore
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start with 1 completely clean, blank resume (in-memory only, no user storage)
  const [resumes, setResumes] = useState<ResumeData[]>([initialResumeData]);
  const [activeResumeId, setActiveResumeId] = useState<string>(initialResumeData.id);
  const [designConfig, setDesignConfig] = useState<DesignConfig>(initialDesignConfig);
  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>(initialAnimationConfig);
  const [favorites, setFavorites] = useState<string[]>(['modern-blue', 'developer-dark', 'ats-simple']);

  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving'>('saved');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [previewAnimationKey, setPreviewAnimationKey] = useState<number>(0);

  // Active resume object
  const currentResume = useMemo(() => {
    return resumes.find((r) => r.id === activeResumeId) || resumes[0] || initialResumeData;
  }, [resumes, activeResumeId]);

  // Debounced in-memory sync notice (no persistent storage of user data)
  useEffect(() => {
    setAutosaveStatus('saving');
    const timer = setTimeout(() => {
      setAutosaveStatus('saved');
    }, 200);

    return () => clearTimeout(timer);
  }, [resumes, activeResumeId, designConfig, animationConfig, favorites]);

  // Trigger animation replay in preview
  const triggerPreviewAnimation = useCallback(() => {
    setPreviewAnimationKey((k) => k + 1);
  }, []);

  // Update resume helper
  const updateResume = useCallback(
    (updater: (prev: ResumeData) => ResumeData) => {
      setResumes((prev) =>
        prev.map((r) => {
          if (r.id === activeResumeId) {
            const updated = updater(r);
            return {
              ...updated,
              updatedAt: 'Just now',
            };
          }
          return r;
        })
      );
    },
    [activeResumeId]
  );

  const updatePersonalInfo = useCallback(
    (info: Partial<PersonalInfo>) => {
      updateResume((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          ...info,
          fieldVisibility: {
            ...prev.personal.fieldVisibility,
            ...(info.fieldVisibility || {}),
          },
        },
      }));
    },
    [updateResume]
  );

  const updateSummary = useCallback(
    (summary: string) => {
      updateResume((prev) => ({ ...prev, summary }));
    },
    [updateResume]
  );

  // Education
  const addEducation = useCallback(
    (item: Omit<EducationItem, 'id'>) => {
      const newItem: EducationItem = { ...item, id: 'edu-' + Date.now() };
      updateResume((prev) => ({
        ...prev,
        education: [newItem, ...prev.education],
      }));
    },
    [updateResume]
  );

  const updateEducation = useCallback(
    (id: string, item: Partial<EducationItem>) => {
      updateResume((prev) => ({
        ...prev,
        education: prev.education.map((e) => (e.id === id ? { ...e, ...item } : e)),
      }));
    },
    [updateResume]
  );

  const deleteEducation = useCallback(
    (id: string) => {
      updateResume((prev) => ({
        ...prev,
        education: prev.education.filter((e) => e.id !== id),
      }));
    },
    [updateResume]
  );

  // Experience
  const addExperience = useCallback(
    (item: Omit<ExperienceItem, 'id'>) => {
      const newItem: ExperienceItem = { ...item, id: 'exp-' + Date.now() };
      updateResume((prev) => ({
        ...prev,
        experience: [newItem, ...prev.experience],
      }));
    },
    [updateResume]
  );

  const updateExperience = useCallback(
    (id: string, item: Partial<ExperienceItem>) => {
      updateResume((prev) => ({
        ...prev,
        experience: prev.experience.map((e) => (e.id === id ? { ...e, ...item } : e)),
      }));
    },
    [updateResume]
  );

  const deleteExperience = useCallback(
    (id: string) => {
      updateResume((prev) => ({
        ...prev,
        experience: prev.experience.filter((e) => e.id !== id),
      }));
    },
    [updateResume]
  );

  const addExperienceBullet = useCallback(
    (expId: string, bullet: string) => {
      updateResume((prev) => ({
        ...prev,
        experience: prev.experience.map((e) =>
          e.id === expId ? { ...e, highlights: [...e.highlights, bullet] } : e
        ),
      }));
    },
    [updateResume]
  );

  const updateExperienceBullet = useCallback(
    (expId: string, index: number, bullet: string) => {
      updateResume((prev) => ({
        ...prev,
        experience: prev.experience.map((e) => {
          if (e.id !== expId) return e;
          const next = [...e.highlights];
          next[index] = bullet;
          return { ...e, highlights: next };
        }),
      }));
    },
    [updateResume]
  );

  const deleteExperienceBullet = useCallback(
    (expId: string, index: number) => {
      updateResume((prev) => ({
        ...prev,
        experience: prev.experience.map((e) => {
          if (e.id !== expId) return e;
          return { ...e, highlights: e.highlights.filter((_, i) => i !== index) };
        }),
      }));
    },
    [updateResume]
  );

  // Projects
  const addProject = useCallback(
    (item: Omit<ProjectItem, 'id'>) => {
      const newItem: ProjectItem = { ...item, id: 'proj-' + Date.now() };
      updateResume((prev) => ({
        ...prev,
        projects: [newItem, ...prev.projects],
      }));
    },
    [updateResume]
  );

  const updateProject = useCallback(
    (id: string, item: Partial<ProjectItem>) => {
      updateResume((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p.id === id ? { ...p, ...item } : p)),
      }));
    },
    [updateResume]
  );

  const deleteProject = useCallback(
    (id: string) => {
      updateResume((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
      }));
    },
    [updateResume]
  );

  const addProjectBullet = useCallback(
    (projId: string, bullet: string) => {
      updateResume((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === projId ? { ...p, highlights: [...p.highlights, bullet] } : p
        ),
      }));
    },
    [updateResume]
  );

  const updateProjectBullet = useCallback(
    (projId: string, index: number, bullet: string) => {
      updateResume((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => {
          if (p.id !== projId) return p;
          const next = [...p.highlights];
          next[index] = bullet;
          return { ...p, highlights: next };
        }),
      }));
    },
    [updateResume]
  );

  const deleteProjectBullet = useCallback(
    (projId: string, index: number) => {
      updateResume((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => {
          if (p.id !== projId) return p;
          return { ...p, highlights: p.highlights.filter((_, i) => i !== index) };
        }),
      }));
    },
    [updateResume]
  );

  // Skills
  const addSkill = useCallback(
    (skill: Omit<SkillItem, 'id'>) => {
      const newSkill: SkillItem = { ...skill, id: 'sk-' + Date.now() };
      updateResume((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
    },
    [updateResume]
  );

  const deleteSkill = useCallback(
    (id: string) => {
      updateResume((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s.id !== id),
      }));
    },
    [updateResume]
  );

  // Certifications
  const addCertification = useCallback(
    (cert: Omit<CertificationItem, 'id'>) => {
      const newCert: CertificationItem = { ...cert, id: 'cert-' + Date.now() };
      updateResume((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCert],
      }));
    },
    [updateResume]
  );

  const updateCertification = useCallback(
    (id: string, cert: Partial<CertificationItem>) => {
      updateResume((prev) => ({
        ...prev,
        certifications: prev.certifications.map((c) => (c.id === id ? { ...c, ...cert } : c)),
      }));
    },
    [updateResume]
  );

  const deleteCertification = useCallback(
    (id: string) => {
      updateResume((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((c) => c.id !== id),
      }));
    },
    [updateResume]
  );

  // Languages
  const addLanguage = useCallback(
    (lang: Omit<LanguageItem, 'id'>) => {
      const newLang: LanguageItem = { ...lang, id: 'lang-' + Date.now() };
      updateResume((prev) => ({
        ...prev,
        languages: [...prev.languages, newLang],
      }));
    },
    [updateResume]
  );

  const updateLanguage = useCallback(
    (id: string, lang: Partial<LanguageItem>) => {
      updateResume((prev) => ({
        ...prev,
        languages: prev.languages.map((l) => (l.id === id ? { ...l, ...lang } : l)),
      }));
    },
    [updateResume]
  );

  const deleteLanguage = useCallback(
    (id: string) => {
      updateResume((prev) => ({
        ...prev,
        languages: prev.languages.filter((l) => l.id !== id),
      }));
    },
    [updateResume]
  );

  // Achievements
  const addAchievement = useCallback(
    (ach: Omit<AchievementItem, 'id'>) => {
      const newAch: AchievementItem = { ...ach, id: 'ach-' + Date.now() };
      updateResume((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAch],
      }));
    },
    [updateResume]
  );

  const updateAchievement = useCallback(
    (id: string, ach: Partial<AchievementItem>) => {
      updateResume((prev) => ({
        ...prev,
        achievements: prev.achievements.map((a) => (a.id === id ? { ...a, ...ach } : a)),
      }));
    },
    [updateResume]
  );

  const deleteAchievement = useCallback(
    (id: string) => {
      updateResume((prev) => ({
        ...prev,
        achievements: prev.achievements.filter((a) => a.id !== id),
      }));
    },
    [updateResume]
  );

  // Design config
  const updateDesignConfig = useCallback((cfg: Partial<DesignConfig>) => {
    setDesignConfig((prev) => ({ ...prev, ...cfg }));
  }, []);

  const setTemplate = useCallback((templateId: string) => {
    const templateDef = templatesList.find((t) => t.id === templateId);
    setDesignConfig((prev) => ({
      ...prev,
      templateId,
      ...(templateDef
        ? {
            primaryColor: templateDef.defaultColors.primary,
            headingColor: templateDef.defaultColors.heading,
            accentColor: templateDef.defaultColors.accent,
            backgroundColor: templateDef.defaultColors.background,
          }
        : {}),
    }));
  }, []);

  const reorderSections = useCallback((newOrder: SectionKey[]) => {
    setDesignConfig((prev) => ({ ...prev, sectionOrder: newOrder }));
  }, []);

  const toggleSectionVisibility = useCallback((section: SectionKey) => {
    setDesignConfig((prev) => {
      const isHidden = prev.hiddenSections.includes(section);
      return {
        ...prev,
        hiddenSections: isHidden
          ? prev.hiddenSections.filter((s) => s !== section)
          : [...prev.hiddenSections, section],
      };
    });
  }, []);

  // Animation config
  const updateAnimationConfig = useCallback((cfg: Partial<AnimationConfig>) => {
    setAnimationConfig((prev) => ({ ...prev, ...cfg }));
  }, []);

  // Favorites
  const toggleFavorite = useCallback((templateId: string) => {
    setFavorites((prev) =>
      prev.includes(templateId) ? prev.filter((id) => id !== templateId) : [...prev, templateId]
    );
  }, []);

  // Resume Switch / CRUD
  const switchResume = useCallback((id: string) => {
    setActiveResumeId(id);
  }, []);

  const createNewResume = useCallback((templateId?: string, name?: string) => {
    const newId = 'resume-' + Date.now();
    const targetTemplate = templateId || 'modern-blue';
    const newResume: ResumeData = {
      ...initialResumeData,
      id: newId,
      name: name || 'Untitled Resume',
      updatedAt: 'Just now',
      atsScore: 0,
    };

    setResumes((prev) => [newResume, ...prev]);
    setActiveResumeId(newId);
    if (templateId) {
      setTemplate(templateId);
    }
    setActiveView('editor');
    return newId;
  }, [setTemplate]);

  const duplicateResume = useCallback(
    (id: string) => {
      const source = resumes.find((r) => r.id === id) || currentResume;
      const newId = 'resume-' + Date.now();
      const copy: ResumeData = {
        ...JSON.parse(JSON.stringify(source)),
        id: newId,
        name: `${source.name} (Copy)`,
        updatedAt: 'Just now',
      };
      setResumes((prev) => [copy, ...prev]);
      setActiveResumeId(newId);
      return newId;
    },
    [resumes, currentResume]
  );

  const deleteResume = useCallback(
    (id: string) => {
      if (resumes.length <= 1) {
        alert('You must have at least one resume.');
        return;
      }
      setResumes((prev) => prev.filter((r) => r.id !== id));
      if (activeResumeId === id) {
        const remaining = resumes.filter((r) => r.id !== id);
        setActiveResumeId(remaining[0].id);
      }
    },
    [resumes, activeResumeId]
  );

  const clearResume = useCallback(() => {
    updateResume(() => ({
      ...initialResumeData,
      id: activeResumeId,
    }));
  }, [updateResume, activeResumeId]);

  const loadSampleData = useCallback(() => {
    updateResume(() => ({
      ...sampleResumeData,
      id: activeResumeId,
    }));
  }, [updateResume, activeResumeId]);

  const resetToDemo = useCallback(() => {
    setResumes([initialResumeData]);
    setActiveResumeId(initialResumeData.id);
    setDesignConfig(initialDesignConfig);
    setAnimationConfig(initialAnimationConfig);
  }, []);

  const importResumeData = useCallback(
    (data: Partial<ResumeData>) => {
      updateResume((prev) => ({
        ...prev,
        ...data,
        personal: {
          ...prev.personal,
          ...(data.personal || {}),
        },
      }));
    },
    [updateResume]
  );

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        activeResumeId,
        currentResume,
        designConfig,
        animationConfig,
        activeView,
        autosaveStatus,
        favorites,
        zoomLevel,
        previewAnimationKey,
        setActiveView,
        setZoomLevel,
        toggleFavorite,
        updateResume,
        updatePersonalInfo,
        updateSummary,
        addEducation,
        updateEducation,
        deleteEducation,
        addExperience,
        updateExperience,
        deleteExperience,
        addExperienceBullet,
        updateExperienceBullet,
        deleteExperienceBullet,
        addProject,
        updateProject,
        deleteProject,
        addProjectBullet,
        updateProjectBullet,
        deleteProjectBullet,
        addSkill,
        deleteSkill,
        addCertification,
        updateCertification,
        deleteCertification,
        addLanguage,
        updateLanguage,
        deleteLanguage,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        updateDesignConfig,
        setTemplate,
        reorderSections,
        toggleSectionVisibility,
        updateAnimationConfig,
        triggerPreviewAnimation,
        switchResume,
        createNewResume,
        duplicateResume,
        deleteResume,
        resetToDemo,
        loadSampleData,
        clearResume,
        importResumeData,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
