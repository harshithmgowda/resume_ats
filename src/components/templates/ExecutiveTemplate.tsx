import React from 'react';
import { ResumeData, DesignConfig } from '../../types/resume';
import { ContactBar } from './shared';

export const ExecutiveTemplate: React.FC<{
  resume: ResumeData;
  design: DesignConfig;
  animClass?: string;
  photoAnimClass?: string;
}> = ({ resume, design, animClass = '', photoAnimClass = '' }) => {
  const { personal, summary, education, experience, projects, skills, certifications, languages, achievements } = resume;
  const isHidden = (key: string) => design.hiddenSections.includes(key as any);

  return (
    <div className={`p-8 font-sans text-stone-800 ${animClass}`} style={{ backgroundColor: design.backgroundColor }}>
      {/* Header with warm gold accent rule */}
      <header className="flex justify-between items-center pb-5 mb-5 border-b-2 border-amber-800/30">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-amber-800">Curriculum Vitae</span>
          <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight mt-0.5">
            {personal.fullName}
          </h1>
          <p className="text-sm font-medium text-amber-900 mt-0.5">
            {personal.jobTitle}
          </p>
          <div className="mt-3">
            <ContactBar personal={personal} iconClass="w-3.5 h-3.5 text-amber-800" itemClass="flex items-center gap-1.5 text-xs text-stone-600" />
          </div>
        </div>
        {personal.showPhoto && personal.photoUrl && (
          <img
            src={personal.photoUrl}
            alt={personal.fullName}
            className={`w-24 h-24 object-cover border-2 border-amber-800/40 shadow-md ${photoAnimClass} ${
              design.photoShape === 'circle' ? 'rounded-full' : 'rounded-lg'
            }`}
          />
        )}
      </header>

      {/* Executive Summary Block */}
      {!isHidden('summary') && summary && (
        <section className="mb-5 resume-section-block bg-amber-50/50 p-4 rounded-lg border-l-4 border-amber-800">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-1">
            Executive Profile
          </h2>
          <p className="text-xs leading-relaxed text-stone-700">{summary}</p>
        </section>
      )}

      {/* Leadership & Experience */}
      {!isHidden('experience') && experience.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-900 border-b border-amber-800/20 pb-1 mb-3">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-3.5 border-l-2 border-amber-800/30">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold text-stone-900 font-serif">{exp.jobTitle}</h3>
                  <span className="text-xs text-amber-900 font-semibold">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-xs font-medium text-stone-600 mb-1.5">
                  {exp.company} • {exp.location}
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-stone-700">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {!isHidden('projects') && projects.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-900 border-b border-amber-800/20 pb-1 mb-3">
            Strategic Initiatives & Technical Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-white p-3 rounded border border-stone-200 shadow-xs">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-stone-900 font-serif">{proj.title}</h3>
                  <span className="text-[11px] text-stone-500">{proj.startDate}</span>
                </div>
                <p className="text-xs text-stone-600 mt-1">{proj.description}</p>
                {proj.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Core Competencies */}
      <div className="grid grid-cols-2 gap-5 pt-2 border-t border-amber-800/20">
        {!isHidden('education') && education.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-900 mb-2">Education</h2>
            <div className="space-y-2 text-xs">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-bold text-stone-900">{edu.degree}</p>
                  <p className="text-amber-900 font-medium">{edu.institution}</p>
                  <p className="text-stone-500 text-[11px]">{edu.startDate} – {edu.endDate} {edu.grade && `• ${edu.grade}`}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {!isHidden('skills') && skills.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-900 mb-2">Executive Skillset</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s.id} className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-medium">
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
