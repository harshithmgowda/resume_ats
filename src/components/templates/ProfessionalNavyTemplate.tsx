import React from 'react';
import { ResumeData, DesignConfig } from '../../types/resume';
import { ContactBar } from './shared';

export const ProfessionalNavyTemplate: React.FC<{
  resume: ResumeData;
  design: DesignConfig;
  animClass?: string;
  photoAnimClass?: string;
}> = ({ resume, design, animClass = '', photoAnimClass = '' }) => {
  const { personal, summary, education, experience, projects, skills, certifications, languages, achievements } = resume;
  const isHidden = (key: string) => design.hiddenSections.includes(key as any);

  return (
    <div className={`p-8 font-sans text-slate-800 ${animClass}`} style={{ backgroundColor: design.backgroundColor }}>
      {/* Header */}
      <header className="text-center pb-4 mb-5 border-b-2 border-slate-900">
        <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-wide">
          {personal.fullName}
        </h1>
        <p className="text-sm font-semibold text-blue-900 tracking-widest uppercase mt-1">
          {personal.jobTitle}
        </p>
        <div className="mt-2.5 flex justify-center">
          <ContactBar
            personal={personal}
            iconClass="w-3.5 h-3.5 text-blue-900"
            wrapperClass="flex flex-wrap justify-center items-center gap-x-5 gap-y-1"
          />
        </div>
      </header>

      {/* Summary */}
      {!isHidden('summary') && summary && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs uppercase font-serif font-bold tracking-wider text-blue-950 border-b border-slate-300 pb-1 mb-2">
            Executive Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-700 text-justify">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {!isHidden('experience') && experience.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs uppercase font-serif font-bold tracking-wider text-blue-950 border-b border-slate-300 pb-1 mb-3">
            Professional Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold text-slate-900">{exp.jobTitle}</h3>
                  <span className="text-xs text-slate-600 font-medium">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-semibold text-blue-900 mb-1">
                  {exp.company} | {exp.location}
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700 leading-normal">
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
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs uppercase font-serif font-bold tracking-wider text-blue-950 border-b border-slate-300 pb-1 mb-2.5">
            Key Software Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">{proj.title}</h3>
                  <span className="text-[11px] text-slate-500">{proj.startDate}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>
                {proj.technologies?.length > 0 && (
                  <p className="text-[11px] text-blue-900 font-medium mt-0.5">
                    Core Technologies: {proj.technologies.join(', ')}
                  </p>
                )}
                {proj.highlights?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-700 mt-1">
                    {proj.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Skills */}
      <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-200">
        {!isHidden('education') && education.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs uppercase font-serif font-bold tracking-wider text-blue-950 border-b border-slate-300 pb-1 mb-2">
              Education & Credentials
            </h2>
            <div className="space-y-2 text-xs">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-bold text-slate-900">{edu.degree}</p>
                  <p className="text-blue-900 font-medium">{edu.institution}</p>
                  <p className="text-slate-500 text-[11px]">{edu.startDate} – {edu.endDate} {edu.grade && `• ${edu.grade}`}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {!isHidden('skills') && skills.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs uppercase font-serif font-bold tracking-wider text-blue-950 border-b border-slate-300 pb-1 mb-2">
              Core Competencies
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
