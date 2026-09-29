import React from 'react';
import { ResumeData, DesignConfig } from '../../types/resume';

export const ATSSimpleTemplate: React.FC<{
  resume: ResumeData;
  design: DesignConfig;
  animClass?: string;
  photoAnimClass?: string;
}> = ({ resume, design, animClass = '' }) => {
  const { personal, summary, education, experience, projects, skills, certifications, languages, achievements } = resume;
  const isHidden = (key: string) => design.hiddenSections.includes(key as any);

  return (
    <div className={`p-8 font-sans text-black leading-normal ${animClass}`} style={{ backgroundColor: '#ffffff' }}>
      {/* ATS-Optimized Clean Header */}
      <header className="text-center pb-3 mb-4 border-b border-black">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-black">
          {personal.fullName}
        </h1>
        <p className="text-sm font-semibold text-gray-800 mt-0.5">
          {personal.jobTitle}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 text-xs text-gray-700 mt-1.5">
          {personal.location && <span>{personal.location} |</span>}
          {personal.phone && <span>{personal.phone} |</span>}
          {personal.email && <span>{personal.email} |</span>}
          {personal.linkedin && <span>LinkedIn: {personal.linkedin.replace(/^https?:\/\//, '')} |</span>}
          {personal.github && <span>GitHub: {personal.github.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      {/* Summary */}
      {!isHidden('summary') && summary && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1.5 text-black">
            Professional Summary
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed text-justify">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {!isHidden('experience') && experience.length > 0 && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-2 text-black">
            Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs font-bold text-black">
                  <span>{exp.jobTitle} — {exp.company}</span>
                  <span className="font-normal text-gray-700">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                {exp.location && <div className="text-[11px] text-gray-600 mb-1">{exp.location}</div>}
                <ul className="list-disc list-outside ml-5 space-y-0.5 text-xs text-gray-800">
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
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-2 text-black">
            Technical Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-black">{proj.title}</span>
                  <span className="text-gray-600 text-[11px]">{proj.startDate} {proj.endDate && `– ${proj.endDate}`}</span>
                </div>
                {proj.technologies?.length > 0 && (
                  <p className="text-[11px] text-gray-700 italic">
                    Technologies: {proj.technologies.join(', ')}
                  </p>
                )}
                <p className="text-xs text-gray-800 mt-0.5">{proj.description}</p>
                {proj.highlights?.length > 0 && (
                  <ul className="list-disc list-outside ml-5 space-y-0.5 text-xs text-gray-800 mt-0.5">
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

      {/* Education */}
      {!isHidden('education') && education.length > 0 && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-2 text-black">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between font-bold text-black">
                  <span>{edu.degree} — {edu.institution}</span>
                  <span className="font-normal text-gray-700">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-[11px] text-gray-700">{edu.fieldOfStudy} {edu.grade && `| Score: ${edu.grade}`}</div>
                {edu.description && <div className="text-[11px] text-gray-600">{edu.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {!isHidden('skills') && skills.length > 0 && (
        <section className="mb-3 resume-section-block">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1.5 text-black">
            Technical Skills
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed">
            <span className="font-bold">Skills & Frameworks: </span>
            {skills.map((s) => s.name).join(', ')}
          </p>
        </section>
      )}

      {/* Certifications & Languages */}
      <div className="grid grid-cols-2 gap-4 pt-1">
        {!isHidden('certifications') && certifications.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase border-b border-gray-400 pb-0.5 mb-1 text-black">Certifications</h3>
            <ul className="list-disc list-outside ml-4 text-xs space-y-0.5 text-gray-800">
              {certifications.map((c) => (
                <li key={c.id}>{c.name} ({c.issuer})</li>
              ))}
            </ul>
          </div>
        )}

        {!isHidden('languages') && languages.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase border-b border-gray-400 pb-0.5 mb-1 text-black">Languages</h3>
            <p className="text-xs text-gray-800">
              {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
