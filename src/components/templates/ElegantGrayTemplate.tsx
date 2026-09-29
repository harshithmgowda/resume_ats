import React from 'react';
import { ResumeData, DesignConfig } from '../../types/resume';
import { ContactBar } from './shared';

export const ElegantGrayTemplate: React.FC<{
  resume: ResumeData;
  design: DesignConfig;
  animClass?: string;
  photoAnimClass?: string;
}> = ({ resume, design, animClass = '', photoAnimClass = '' }) => {
  const { personal, summary, education, experience, projects, skills, certifications, languages, achievements } = resume;
  const isHidden = (key: string) => design.hiddenSections.includes(key as any);

  return (
    <div className={`p-8 font-sans text-slate-700 ${animClass}`} style={{ backgroundColor: design.backgroundColor }}>
      {/* Refined Header */}
      <header className="pb-5 mb-5 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-slate-900 uppercase">
            <span className="font-semibold">{(personal.fullName || 'YOUR NAME').split(' ')[0]}</span>{' '}
            {(personal.fullName || 'YOUR NAME').split(' ').slice(1).join(' ')}
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mt-1">
            {personal.jobTitle}
          </p>
          <div className="mt-3">
            <ContactBar personal={personal} iconClass="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>
        {personal.showPhoto && personal.photoUrl && (
          <img
            src={personal.photoUrl}
            alt={personal.fullName}
            className={`w-20 h-20 object-cover border border-slate-300 shadow-xs ${photoAnimClass} ${
              design.photoShape === 'circle' ? 'rounded-full' : 'rounded-lg'
            }`}
          />
        )}
      </header>

      {/* Summary */}
      {!isHidden('summary') && summary && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-1.5">
            Background
          </h2>
          <p className="text-xs leading-relaxed text-slate-600 font-light text-justify">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {!isHidden('experience') && experience.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold border-b border-slate-100 pb-1 mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-semibold text-slate-900">{exp.jobTitle}</h3>
                  <span className="text-[11px] text-slate-400">{exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-xs text-slate-500 mb-1">{exp.company} • {exp.location}</div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-600">
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
          <h2 className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold border-b border-slate-100 pb-1 mb-3">
            Selected Works
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="border-l border-slate-300 pl-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-semibold text-slate-800">{proj.title}</h3>
                  <span className="text-[10px] text-slate-400">{proj.startDate}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>
                {proj.technologies?.length > 0 && (
                  <p className="text-[10px] text-slate-400 mt-1">Tools: {proj.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Skills */}
      <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-200">
        {!isHidden('education') && education.length > 0 && (
          <div>
            <h3 className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-2">Education</h3>
            {education.map((edu) => (
              <div key={edu.id} className="text-xs mb-1.5">
                <p className="font-semibold text-slate-800">{edu.degree}</p>
                <p className="text-slate-500">{edu.institution} ({edu.startDate} – {edu.endDate})</p>
              </div>
            ))}
          </div>
        )}

        {!isHidden('skills') && skills.length > 0 && (
          <div>
            <h3 className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-2">Expertise</h3>
            <div className="flex flex-wrap gap-1">
              {skills.map((s) => (
                <span key={s.id} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
