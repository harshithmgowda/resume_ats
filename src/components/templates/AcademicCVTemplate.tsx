import React from 'react';
import { ResumeData, DesignConfig } from '../../types/resume';
import { ContactBar } from './shared';

export const AcademicCVTemplate: React.FC<{
  resume: ResumeData;
  design: DesignConfig;
  animClass?: string;
  photoAnimClass?: string;
}> = ({ resume, design, animClass = '' }) => {
  const { personal, summary, education, experience, projects, skills, certifications, languages, achievements } = resume;
  const isHidden = (key: string) => design.hiddenSections.includes(key as any);

  return (
    <div className={`p-8 font-serif text-stone-900 ${animClass}`} style={{ backgroundColor: design.backgroundColor }}>
      {/* Formal Academic Header */}
      <header className="text-center pb-4 mb-4 border-b border-stone-800">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          {personal.fullName}
        </h1>
        <p className="text-sm italic text-stone-700 mt-1">
          {personal.jobTitle}
        </p>
        <div className="mt-2 flex justify-center">
          <ContactBar
            personal={personal}
            iconClass="w-3.5 h-3.5 text-stone-700"
            wrapperClass="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 font-sans text-xs text-stone-600"
          />
        </div>
      </header>

      {/* Research Statement / Summary */}
      {!isHidden('summary') && summary && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs uppercase font-sans font-bold tracking-widest text-stone-800 border-b border-stone-300 pb-0.5 mb-1.5">
            Research Interests & Objective
          </h2>
          <p className="text-xs leading-relaxed text-stone-800 text-justify">{summary}</p>
        </section>
      )}

      {/* Education First in Academic CV */}
      {!isHidden('education') && education.length > 0 && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs uppercase font-sans font-bold tracking-widest text-stone-800 border-b border-stone-300 pb-0.5 mb-2">
            Higher Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between font-bold">
                  <span>{edu.degree}, {edu.fieldOfStudy}</span>
                  <span className="font-normal font-sans text-stone-600">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="italic text-stone-700">{edu.institution} {edu.grade && `(GPA: ${edu.grade})`}</div>
                {edu.description && <p className="font-sans text-[11px] text-stone-600 mt-0.5">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Research & Academic Experience */}
      {!isHidden('experience') && experience.length > 0 && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs uppercase font-sans font-bold tracking-widest text-stone-800 border-b border-stone-300 pb-0.5 mb-2">
            Research & Teaching Appointments
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs font-bold">
                  <span>{exp.jobTitle} — {exp.company}</span>
                  <span className="font-normal font-sans text-stone-600">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                {exp.location && <div className="text-[11px] italic text-stone-600 mb-1">{exp.location}</div>}
                <ul className="list-disc list-outside ml-5 space-y-0.5 text-xs text-stone-800">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications / Projects */}
      {!isHidden('projects') && projects.length > 0 && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs uppercase font-sans font-bold tracking-widest text-stone-800 border-b border-stone-300 pb-0.5 mb-2">
            Selected Research Projects & Systems
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between font-bold">
                  <span>{proj.title}</span>
                  <span className="font-normal font-sans text-stone-600">{proj.startDate}</span>
                </div>
                <p className="text-stone-700 italic mt-0.5">{proj.description}</p>
                {proj.technologies?.length > 0 && (
                  <p className="font-sans text-[11px] text-stone-600">
                    Methods & Tools: {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Honors, Awards & Skills */}
      <div className="grid grid-cols-2 gap-6 pt-2 border-t border-stone-300">
        {!isHidden('achievements') && achievements.length > 0 && (
          <div>
            <h3 className="text-xs uppercase font-sans font-bold tracking-widest text-stone-800 mb-1.5">Honors & Awards</h3>
            <div className="space-y-1 text-xs">
              {achievements.map((a) => (
                <div key={a.id}>
                  <p className="font-bold">{a.title}</p>
                  <p className="text-[11px] font-sans text-stone-600">{a.description} ({a.date})</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isHidden('skills') && skills.length > 0 && (
          <div>
            <h3 className="text-xs uppercase font-sans font-bold tracking-widest text-stone-800 mb-1.5">Methodological Skills</h3>
            <p className="text-xs leading-relaxed font-sans text-stone-700">
              {skills.map((s) => s.name).join(' • ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
