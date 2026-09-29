import React, { useState } from 'react';
import {
  User,
  FileText,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Cpu,
  Award,
  Globe,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Eye,
  EyeOff,
  ExternalLink,
  Check,
  ListPlus,
  Wand2,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { SkillCategory, LanguageProficiency } from '../../types/resume';
import { AIHelper, AISuggestion } from '../../utils/aiAssistant';

export const SectionForm: React.FC = () => {
  const {
    currentResume,
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
    clearResume,
    loadSampleData,
  } = useResume();

  const { personal, summary, education, experience, projects, skills, certifications, languages, achievements } = currentResume;

  // Active accordion section
  const [openSection, setOpenSection] = useState<string>('personal');

  // AI Suggestion state
  const [activeSuggestion, setActiveSuggestion] = useState<AISuggestion | null>(null);
  const [suggestionTarget, setSuggestionTarget] = useState<{
    type: 'summary' | 'expBullet' | 'projBullet';
    expId?: string;
    bulletIndex?: number;
    projId?: string;
  } | null>(null);

  // New Skill Input state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCat, setNewSkillCat] = useState<SkillCategory>('Programming');

  // AI Handlers
  const handleAIOption = (action: 'grammar' | 'concise' | 'ats' | 'fromProfile') => {
    let res: AISuggestion;
    if (action === 'concise') {
      res = AIHelper.makeConcise(summary);
    } else if (action === 'ats') {
      res = AIHelper.makeAtsFriendly(summary);
    } else if (action === 'fromProfile') {
      res = AIHelper.generateSummaryFromProfile(currentResume);
    } else {
      res = AIHelper.improveSummary(summary);
    }
    setActiveSuggestion(res);
    setSuggestionTarget({ type: 'summary' });
  };

  const handleExpBulletAI = (expId: string, index: number, bullet: string, action: 'improve' | 'ats' | 'verb') => {
    let res: AISuggestion;
    if (action === 'verb') {
      res = AIHelper.addActionVerb(bullet);
    } else if (action === 'ats') {
      res = AIHelper.makeAtsFriendly(bullet);
    } else {
      res = AIHelper.improveBullet(bullet);
    }
    setActiveSuggestion(res);
    setSuggestionTarget({ type: 'expBullet', expId, bulletIndex: index });
  };

  const applyActiveSuggestion = () => {
    if (!activeSuggestion || !suggestionTarget) return;

    if (suggestionTarget.type === 'summary') {
      updateSummary(activeSuggestion.suggestedText);
    } else if (suggestionTarget.type === 'expBullet' && suggestionTarget.expId !== undefined && suggestionTarget.bulletIndex !== undefined) {
      updateExperienceBullet(suggestionTarget.expId, suggestionTarget.bulletIndex, activeSuggestion.suggestedText);
    }
    setActiveSuggestion(null);
    setSuggestionTarget(null);
  };

  const toggleAccordion = (name: string) => {
    setOpenSection((prev) => (prev === name ? '' : name));
  };

  const handleAddNewSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillName.trim()) {
      addSkill({
        name: newSkillName.trim(),
        category: newSkillCat,
        level: 5,
      });
      setNewSkillName('');
    }
  };

  return (
    <div className="w-full md:w-[460px] lg:w-[480px] bg-slate-50 border-r border-slate-200 flex flex-col h-full overflow-hidden select-none">
      {/* Editor Header */}
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Resume Content</h3>
          <p className="text-[11px] text-slate-500">Edit sections below for live updates</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={clearResume}
            className="text-[11px] font-semibold text-slate-600 hover:text-red-600 px-2 py-1 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 transition-colors"
            title="Reset to blank resume"
          >
            Clear All
          </button>
          <button
            onClick={loadSampleData}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100 transition-colors"
            title="Fill with example data"
          >
            Load Example
          </button>
        </div>
      </div>

      {/* AI Suggestion Banner Modal/Card */}
      {activeSuggestion && (
        <div className="p-3.5 bg-blue-50/90 border-b border-blue-200 shrink-0 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Suggestion Ready</span>
          </div>
          <p className="text-[11px] text-blue-800 mb-2 leading-relaxed bg-white p-2.5 rounded-xl border border-blue-100">
            "{activeSuggestion.suggestedText}"
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-blue-600 truncate flex-1">{activeSuggestion.rationale}</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveSuggestion(null)}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-blue-100 rounded-lg"
              >
                Reject
              </button>
              <button
                onClick={applyActiveSuggestion}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
              >
                <Check className="w-3 h-3" />
                <span>Apply</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Form Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* SECTION 1: PERSONAL INFORMATION */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleAccordion('personal')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Personal Information</span>
            </div>
            {openSection === 'personal' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'personal' && (
            <div className="p-4 pt-0 border-t border-slate-100 space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={personal.fullName}
                  onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                  placeholder="First & Last Name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Professional Title</label>
                <input
                  type="text"
                  value={personal.jobTitle}
                  onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
                  placeholder="e.g. Software Engineer / Job Title"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-medium text-slate-600">Email</label>
                    <button
                      onClick={() =>
                        updatePersonalInfo({
                          fieldVisibility: {
                            ...personal.fieldVisibility,
                            email: !personal.fieldVisibility.email,
                          },
                        })
                      }
                      title={personal.fieldVisibility.email ? 'Hide in resume' : 'Show in resume'}
                    >
                      {personal.fieldVisibility.email ? <Eye className="w-3 h-3 text-blue-600" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                    </button>
                  </div>
                  <input
                    type="email"
                    value={personal.email}
                    onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-medium text-slate-600">Phone</label>
                    <button
                      onClick={() =>
                        updatePersonalInfo({
                          fieldVisibility: {
                            ...personal.fieldVisibility,
                            phone: !personal.fieldVisibility.phone,
                          },
                        })
                      }
                    >
                      {personal.fieldVisibility.phone ? <Eye className="w-3 h-3 text-blue-600" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={personal.phone}
                    onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Location</label>
                <input
                  type="text"
                  value={personal.location}
                  onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                  placeholder="City, State, Country"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-medium text-slate-600">GitHub</label>
                    <button
                      onClick={() =>
                        updatePersonalInfo({
                          fieldVisibility: {
                            ...personal.fieldVisibility,
                            github: !personal.fieldVisibility.github,
                          },
                        })
                      }
                    >
                      {personal.fieldVisibility.github ? <Eye className="w-3 h-3 text-blue-600" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={personal.github}
                    onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                    placeholder="github.com/username"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-medium text-slate-600">LinkedIn</label>
                    <button
                      onClick={() =>
                        updatePersonalInfo({
                          fieldVisibility: {
                            ...personal.fieldVisibility,
                            linkedin: !personal.fieldVisibility.linkedin,
                          },
                        })
                      }
                    >
                      {personal.fieldVisibility.linkedin ? <Eye className="w-3 h-3 text-blue-600" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={personal.linkedin}
                    onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                    placeholder="linkedin.com/in/username"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Personal Portfolio / Website</label>
                <input
                  type="text"
                  value={personal.website}
                  onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                  placeholder="yourportfolio.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Photo toggle & URL */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-700">Display Profile Photo</span>
                  <button
                    onClick={() => updatePersonalInfo({ showPhoto: !personal.showPhoto })}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      personal.showPhoto ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform transform shadow-xs ${
                        personal.showPhoto ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                {personal.showPhoto && (
                  <input
                    type="text"
                    value={personal.photoUrl}
                    onChange={(e) => updatePersonalInfo({ photoUrl: e.target.value })}
                    placeholder="Image URL..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-slate-600"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: PROFESSIONAL SUMMARY */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleAccordion('summary')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Professional Summary</span>
            </div>
            {openSection === 'summary' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'summary' && (
            <div className="p-4 pt-0 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex flex-wrap gap-1.5 pb-1">
                <button
                  onClick={() => handleAIOption('grammar')}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Improve with AI</span>
                </button>
                <button
                  onClick={() => handleAIOption('ats')}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                >
                  Make ATS Friendly
                </button>
                <button
                  onClick={() => handleAIOption('concise')}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                >
                  Make Concise
                </button>
                <button
                  onClick={() => handleAIOption('fromProfile')}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                >
                  Generate from Profile
                </button>
              </div>

              <textarea
                rows={4}
                value={summary}
                onChange={(e) => updateSummary(e.target.value)}
                placeholder="Write an impactful 2-3 sentence overview of your skills and career focus..."
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none text-slate-800 leading-relaxed"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Recommended: 150 - 300 characters</span>
                <span className="font-mono">{summary.length} chars</span>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: WORK EXPERIENCE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleAccordion('experience')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Work Experience ({experience.length})</span>
            </div>
            {openSection === 'experience' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'experience' && (
            <div className="p-4 pt-0 border-t border-slate-100 space-y-4 text-xs">
              {experience.map((exp) => (
                <div key={exp.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900">{exp.jobTitle || 'Untitled Role'}</span>
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Delete experience"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.jobTitle}
                      onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
                      placeholder="Job Title"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      placeholder="Company"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                      placeholder="Location"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                    />
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      placeholder="Start (e.g. Jun 2024)"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                    />
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                      placeholder="End (e.g. Aug 2024)"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                    />
                  </div>

                  {/* Bullet points editor with AI actions */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Key Highlights & Accomplishments
                    </span>
                    <div className="space-y-2">
                      {exp.highlights.map((bullet, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex gap-1.5">
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => updateExperienceBullet(exp.id, idx, e.target.value)}
                              className="flex-1 p-2 rounded-lg border border-slate-200 bg-white outline-none text-[11px] leading-relaxed"
                            />
                            <button
                              onClick={() => deleteExperienceBullet(exp.id, idx)}
                              className="text-slate-400 hover:text-red-600 p-1"
                              title="Delete bullet"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex gap-1.5 text-[10px]">
                            <button
                              onClick={() => handleExpBulletAI(exp.id, idx, bullet, 'improve')}
                              className="text-blue-600 hover:underline flex items-center gap-0.5"
                            >
                              <Sparkles className="w-2.5 h-2.5" /> Improve
                            </button>
                            <span className="text-slate-300">•</span>
                            <button
                              onClick={() => handleExpBulletAI(exp.id, idx, bullet, 'verb')}
                              className="text-slate-600 hover:underline"
                            >
                              + Action Verb
                            </button>
                            <span className="text-slate-300">•</span>
                            <button
                              onClick={() => handleExpBulletAI(exp.id, idx, bullet, 'ats')}
                              className="text-slate-600 hover:underline"
                            >
                              ATS Optimize
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => addExperienceBullet(exp.id, '')}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Bullet Point</span>
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() =>
                  addExperience({
                    jobTitle: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    isCurrent: false,
                    highlights: [''],
                  })
                }
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 text-blue-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Work Experience</span>
              </button>
            </div>
          )}
        </div>

        {/* SECTION 4: PROJECTS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleAccordion('projects')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Projects ({projects.length})</span>
            </div>
            {openSection === 'projects' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'projects' && (
            <div className="p-4 pt-0 border-t border-slate-100 space-y-4 text-xs">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900">{proj.title || 'Untitled Project'}</span>
                    <button
                      onClick={() => deleteProject(proj.id)}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                    placeholder="Project Title"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none font-semibold"
                  />

                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                    placeholder="Brief description of the project..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none text-[11px]"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={proj.githubUrl}
                      onChange={(e) => updateProject(proj.id, { githubUrl: e.target.value })}
                      placeholder="GitHub URL (optional)"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                    />
                    <input
                      type="text"
                      value={proj.demoUrl}
                      onChange={(e) => updateProject(proj.id, { demoUrl: e.target.value })}
                      placeholder="Live Demo URL (optional)"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={proj.technologies?.join(', ')}
                      onChange={(e) =>
                        updateProject(proj.id, {
                          technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="e.g. React, TypeScript, Node.js"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none text-slate-700"
                    />
                  </div>

                  {/* Highlights */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Bullet Highlights
                    </span>
                    <div className="space-y-1.5">
                      {proj.highlights?.map((h, hIdx) => (
                        <div key={hIdx} className="flex gap-1.5">
                          <input
                            type="text"
                            value={h}
                            onChange={(e) => updateProjectBullet(proj.id, hIdx, e.target.value)}
                            placeholder="Key highlight or feature..."
                            className="flex-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white outline-none text-[11px]"
                          />
                          <button
                            onClick={() => deleteProjectBullet(proj.id, hIdx)}
                            className="text-slate-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => addProjectBullet(proj.id, '')}
                      className="mt-1.5 text-blue-600 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Highlight Bullet</span>
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() =>
                  addProject({
                    title: '',
                    description: '',
                    technologies: [],
                    githubUrl: '',
                    demoUrl: '',
                    startDate: '',
                    endDate: '',
                    highlights: [''],
                  })
                }
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 text-blue-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>
          )}
        </div>

        {/* SECTION 5: EDUCATION */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleAccordion('education')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Education ({education.length})</span>
            </div>
            {openSection === 'education' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'education' && (
            <div className="p-4 pt-0 border-t border-slate-100 space-y-3.5 text-xs">
              {education.map((edu) => (
                <div key={edu.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900">{edu.degree || 'Degree'}</span>
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    placeholder="Institution / University"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      placeholder="Degree (e.g. B.E.)"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                    />
                    <input
                      type="text"
                      value={edu.fieldOfStudy}
                      onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                      placeholder="Field of Study (e.g. CSE)"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      placeholder="Start (2022)"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                    />
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                      placeholder="End (2026)"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                    />
                    <input
                      type="text"
                      value={edu.grade}
                      onChange={(e) => updateEducation(edu.id, { grade: e.target.value })}
                      placeholder="Grade / CGPA"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={() =>
                  addEducation({
                    institution: '',
                    degree: '',
                    fieldOfStudy: '',
                    startDate: '',
                    endDate: '',
                    grade: '',
                    description: '',
                  })
                }
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 text-blue-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Education</span>
              </button>
            </div>
          )}
        </div>

        {/* SECTION 6: SKILLS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleAccordion('skills')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Technical Skills ({skills.length})</span>
            </div>
            {openSection === 'skills' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'skills' && (
            <div className="p-4 pt-0 border-t border-slate-100 space-y-3 text-xs">
              {/* Add Skill Input */}
              <form onSubmit={handleAddNewSkill} className="flex gap-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Add skill (e.g. Kubernetes)..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
                <select
                  value={newSkillCat}
                  onChange={(e) => setNewSkillCat(e.target.value as SkillCategory)}
                  className="px-2 py-1.5 rounded-xl border border-slate-200 bg-white outline-none text-slate-700"
                >
                  <option value="Programming">Programming</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Tools">Tools</option>
                  <option value="Cloud">Cloud</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-medium"
                  >
                    <span>{s.name}</span>
                    <button
                      onClick={() => deleteSkill(s.id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 7: CERTIFICATIONS & LANGUAGES */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleAccordion('extras')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Languages & Certifications</span>
            </div>
            {openSection === 'extras' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'extras' && (
            <div className="p-4 pt-0 border-t border-slate-100 space-y-4 text-xs">
              {/* Languages */}
              <div>
                <span className="font-bold text-slate-900 block mb-2">Spoken Languages</span>
                <div className="space-y-2">
                  {languages.map((l) => (
                    <div key={l.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={l.name}
                        onChange={(e) => updateLanguage(l.id, { name: e.target.value })}
                        className="flex-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white outline-none"
                      />
                      <select
                        value={l.proficiency}
                        onChange={(e) =>
                          updateLanguage(l.id, {
                            proficiency: e.target.value as LanguageProficiency,
                          })
                        }
                        className="px-2 py-1 rounded-lg border border-slate-200 bg-white outline-none text-slate-700"
                      >
                        <option value="Basic">Basic</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Professional">Professional</option>
                        <option value="Native">Native</option>
                      </select>
                      <button
                        onClick={() => deleteLanguage(l.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addLanguage({ name: '', proficiency: 'Professional' })}
                    className="text-blue-600 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Language
                  </button>
                </div>
              </div>

              {/* Certifications */}
              <div className="border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-900 block mb-2">Certifications</span>
                <div className="space-y-2">
                  {certifications.map((c) => (
                    <div key={c.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) => updateCertification(c.id, { name: e.target.value })}
                          placeholder="Certification Name (e.g. AWS Solutions Architect)"
                          className="flex-1 px-2 py-1 rounded border border-slate-200 bg-white font-semibold"
                        />
                        <button
                          onClick={() => deleteCertification(c.id)}
                          className="text-slate-400 hover:text-red-600 p-1 ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={c.issuer}
                          onChange={(e) => updateCertification(c.id, { issuer: e.target.value })}
                          placeholder="Issuer (e.g. AWS, Coursera)"
                          className="px-2 py-1 rounded border border-slate-200 bg-white text-[11px]"
                        />
                        <input
                          type="text"
                          value={c.issueDate}
                          onChange={(e) => updateCertification(c.id, { issueDate: e.target.value })}
                          placeholder="Date (e.g. 2024)"
                          className="px-2 py-1 rounded border border-slate-200 bg-white text-[11px]"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      addCertification({
                        name: '',
                        issuer: '',
                        issueDate: '',
                        credentialId: '',
                        url: '',
                      })
                    }
                    className="text-blue-600 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Certification
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
