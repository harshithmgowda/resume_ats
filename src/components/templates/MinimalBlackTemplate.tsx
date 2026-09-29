import React from 'react';
import { ResumeData, DesignConfig } from '../../types/resume';
import { ContactBar } from './shared';

export const MinimalBlackTemplate: React.FC<{
  resume: ResumeData;
  design: DesignConfig;
  animClass?: string;
  photoAnimClass?: string;
}> = ({ resume, design, animClass = '', photoAnimClass = '' }) => {
  const { personal, summary, education, experience, projects, skills, certifications, languages, achievements } = resume;
  const isHidden = (key: string) => design.hiddenSections.includes(key as any);

  return (
    <div className={`p-8 font-sans text-neutral-900 ${animClass}`} style={{ backgroundColor: design.backgroundColor }}>
      {/* Header */}
      <header className="border-b border-neutral-900 pb-5 mb-5 flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-3xl font-normal tracking-tight uppercase text-neutral-950 font-serif">
            {personal.fullName}
          </h1>
          <p className="text-xs uppercase tracking-widest text-neutral-600 mt-1 font-mono">
            {personal.jobTitle}
          </p>
          <div className="mt-3">
            <ContactBar personal={personal} iconClass="w-3 h-3 text-neutral-800" itemClass="flex items-center gap-1.5 text-xs text-neutral-700" />
          </div>
        </div>
        {personal.showPhoto && personal.photoUrl && (
          <img
            src={personal.photoUrl}
            alt={personal.fullName}
            className={`w-20 h-20 object-cover grayscale contrast-125 border border-neutral-900 ${photoAnimClass} ${
              design.photoShape === 'circle' ? 'rounded-full' : 'rounded-none'
            }`}
          />
        )}
      </header>

      {/* Summary */}
      {!isHidden('summary') && summary && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-[11px] font-mono uppercase tracking-widest border-b border-neutral-200 pb-1 mb-2 font-bold">
            01 / Profile
          </h2>
          <p className="text-xs leading-relaxed text-neutral-700 text-justify">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {!isHidden('experience') && experience.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-[11px] font-mono uppercase tracking-widest border-b border-neutral-200 pb-1 mb-3 font-bold">
            02 / Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-mono text-xs">
                  <span className="font-bold text-neutral-950 uppercase">{exp.jobTitle}</span>
                  <span className="text-neutral-500 text-[11px]">
                    {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-xs text-neutral-600 mb-1.5 italic">
                  {exp.company}, {exp.location}
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-neutral-700">
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
          <h2 className="text-[11px] font-mono uppercase tracking-widest border-b border-neutral-200 pb-1 mb-3 font-bold">
            03 / Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="border-l border-neutral-300 pl-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold font-mono uppercase">{proj.title}</h3>
                  <span className="text-[10px] font-mono text-neutral-500">{proj.startDate}</span>
                </div>
                <p className="text-xs text-neutral-600 mt-0.5">{proj.description}</p>
                {proj.technologies?.length > 0 && (
                  <p className="text-[11px] font-mono text-neutral-500 mt-1">
                    Tech: {proj.technologies.join(' · ')}
                  </p>
                )}
                {proj.highlights?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-neutral-700 mt-1">
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

      {/* Two Column Footer: Education & Skills */}
      <div className="grid grid-cols-2 gap-6 pt-2 border-t border-neutral-900">
        {!isHidden('education') && education.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-[11px] font-mono uppercase tracking-widest mb-2 font-bold">04 / Education</h2>
            <div className="space-y-2 text-xs">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-bold">{edu.degree}</p>
                  <p className="text-neutral-600">{edu.institution}</p>
                  <p className="text-[11px] font-mono text-neutral-500">{edu.startDate} – {edu.endDate} {edu.grade && `| ${edu.grade}`}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {!isHidden('skills') && skills.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-[11px] font-mono uppercase tracking-widest mb-2 font-bold">05 / Skills & Tools</h2>
            <div className="text-xs leading-relaxed font-mono text-neutral-700">
              {skills.map((s) => s.name).join(' · ')}
            </div>
            {languages.length > 0 && (
              <div className="mt-3">
                <span className="font-mono text-[10px] uppercase font-bold text-neutral-500 block mb-1">Languages:</span>
                <span className="text-xs font-mono text-neutral-700">
                  {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
                </span>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
