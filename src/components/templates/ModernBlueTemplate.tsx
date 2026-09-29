import React from 'react';
import { ResumeData, DesignConfig } from '../../types/resume';
import { ContactBar } from './shared';
import { ExternalLink } from 'lucide-react';

export const ModernBlueTemplate: React.FC<{
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
      <header className="border-b-2 pb-5 mb-5 flex items-center justify-between gap-6" style={{ borderColor: design.primaryColor }}>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: design.headingColor }}>
            {personal.fullName}
          </h1>
          <p className="text-lg font-medium mt-1 text-blue-600" style={{ color: design.primaryColor }}>
            {personal.jobTitle}
          </p>
          <div className="mt-3">
            <ContactBar personal={personal} iconClass="w-3.5 h-3.5 text-blue-600" />
          </div>
        </div>
        {personal.showPhoto && personal.photoUrl && (
          <img
            src={personal.photoUrl}
            alt={personal.fullName}
            className={`w-24 h-24 object-cover border-2 shadow-sm ${photoAnimClass} ${
              design.photoShape === 'circle' ? 'rounded-full' : design.photoShape === 'square' ? 'rounded-none' : 'rounded-xl'
            }`}
            style={{ borderColor: design.primaryColor }}
          />
        )}
      </header>

      {/* Summary */}
      {!isHidden('summary') && summary && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs uppercase font-bold tracking-wider mb-2 flex items-center gap-2" style={{ color: design.primaryColor }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: design.primaryColor }}></span>
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-slate-700">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {!isHidden('experience') && experience.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs uppercase font-bold tracking-wider mb-3 flex items-center gap-2" style={{ color: design.primaryColor }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: design.primaryColor }}></span>
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-3 border-l-2" style={{ borderColor: `${design.primaryColor}30` }}>
                <div className="flex justify-between items-baseline flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900">{exp.jobTitle}</h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-semibold text-blue-700 mb-1.5" style={{ color: design.primaryColor }}>
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-xs leading-relaxed text-slate-700">
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
          <h2 className="text-xs uppercase font-bold tracking-wider mb-3 flex items-center gap-2" style={{ color: design.primaryColor }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: design.primaryColor }}></span>
            Key Projects
          </h2>
          <div className="space-y-3.5">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{proj.title}</h3>
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{proj.startDate} {proj.endDate && `– ${proj.endDate}`}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 mb-1.5">{proj.description}</p>
                {proj.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {proj.highlights?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-700">
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

      {/* Grid: Education & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Education */}
        {!isHidden('education') && education.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs uppercase font-bold tracking-wider mb-2.5 flex items-center gap-2" style={{ color: design.primaryColor }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: design.primaryColor }}></span>
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-slate-900">{edu.degree}</h3>
                    <span className="text-[11px] text-slate-500">{edu.startDate} – {edu.endDate}</span>
                  </div>
                  <p className="text-xs text-blue-700 font-medium" style={{ color: design.primaryColor }}>{edu.institution}</p>
                  {edu.grade && <p className="text-[11px] text-slate-600 font-semibold">{edu.grade}</p>}
                  {edu.description && <p className="text-[11px] text-slate-500 mt-0.5">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {!isHidden('skills') && skills.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs uppercase font-bold tracking-wider mb-2.5 flex items-center gap-2" style={{ color: design.primaryColor }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: design.primaryColor }}></span>
              Technical Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="text-xs px-2.5 py-1 rounded-md font-medium text-slate-800 bg-slate-100 border border-slate-200"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Grid: Certifications, Languages, Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {!isHidden('certifications') && certifications.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs uppercase font-bold tracking-wider mb-2" style={{ color: design.primaryColor }}>
              Certifications
            </h2>
            <div className="space-y-1.5 text-xs">
              {certifications.map((c) => (
                <div key={c.id}>
                  <p className="font-semibold text-slate-900">{c.name}</p>
                  <p className="text-[11px] text-slate-500">{c.issuer} • {c.issueDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {!isHidden('languages') && languages.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs uppercase font-bold tracking-wider mb-2" style={{ color: design.primaryColor }}>
              Languages
            </h2>
            <div className="space-y-1 text-xs">
              {languages.map((l) => (
                <div key={l.id} className="flex justify-between items-center text-slate-700">
                  <span className="font-medium">{l.name}</span>
                  <span className="text-[11px] text-slate-500">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {!isHidden('achievements') && achievements.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs uppercase font-bold tracking-wider mb-2" style={{ color: design.primaryColor }}>
              Honors & Awards
            </h2>
            <div className="space-y-1.5 text-xs">
              {achievements.map((a) => (
                <div key={a.id}>
                  <p className="font-semibold text-slate-900">{a.title}</p>
                  <p className="text-[11px] text-slate-500">{a.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
