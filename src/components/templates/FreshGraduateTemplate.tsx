import React from 'react';
import { ResumeData, DesignConfig } from '../../types/resume';
import { ContactBar } from './shared';
import { GraduationCap, Code2, Award, Briefcase, ExternalLink } from 'lucide-react';

export const FreshGraduateTemplate: React.FC<{
  resume: ResumeData;
  design: DesignConfig;
  animClass?: string;
  photoAnimClass?: string;
}> = ({ resume, design, animClass = '', photoAnimClass = '' }) => {
  const { personal, summary, education, experience, projects, skills, certifications, languages, achievements } = resume;
  const isHidden = (key: string) => design.hiddenSections.includes(key as any);

  return (
    <div className={`p-8 font-sans text-slate-800 ${animClass}`} style={{ backgroundColor: design.backgroundColor }}>
      {/* Top Banner Header */}
      <header className="flex justify-between items-center pb-4 mb-4 border-b-2 border-emerald-600">
        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
            Entry-Level / Fresher Candidate
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {personal.fullName}
          </h1>
          <p className="text-sm font-semibold text-emerald-700">
            {personal.jobTitle}
          </p>
          <div className="mt-2.5">
            <ContactBar personal={personal} iconClass="w-3.5 h-3.5 text-emerald-700" />
          </div>
        </div>
        {personal.showPhoto && personal.photoUrl && (
          <img
            src={personal.photoUrl}
            alt={personal.fullName}
            className={`w-20 h-20 object-cover border-2 border-emerald-600 shadow-sm ${photoAnimClass} ${
              design.photoShape === 'circle' ? 'rounded-full' : 'rounded-xl'
            }`}
          />
        )}
      </header>

      {/* Summary */}
      {!isHidden('summary') && summary && (
        <section className="mb-4 resume-section-block">
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100 italic">
            "{summary}"
          </p>
        </section>
      )}

      {/* Education First for Fresh Grads */}
      {!isHidden('education') && education.length > 0 && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs uppercase font-bold tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2">
            <GraduationCap className="w-4 h-4 text-emerald-700" /> Education & Academic Background
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id} className="bg-emerald-50/30 p-2.5 rounded border border-emerald-100">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">{edu.degree}</h3>
                  <span className="text-[11px] font-semibold text-emerald-800">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline mt-0.5">
                  <span className="text-xs text-slate-700 font-medium">{edu.institution}</span>
                  {edu.grade && <span className="text-xs font-bold text-emerald-700">{edu.grade}</span>}
                </div>
                {edu.description && <p className="text-[11px] text-slate-600 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Projects */}
      {!isHidden('projects') && projects.length > 0 && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs uppercase font-bold tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2.5">
            <Code2 className="w-4 h-4 text-emerald-700" /> Academic & Personal Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="border-l-2 border-emerald-600 pl-3">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{proj.title}</h3>
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-700">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">{proj.startDate}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>
                {proj.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 my-1">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
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

      {/* Experience / Internships */}
      {!isHidden('experience') && experience.length > 0 && (
        <section className="mb-4 resume-section-block">
          <h2 className="text-xs uppercase font-bold tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2">
            <Briefcase className="w-4 h-4 text-emerald-700" /> Internships & Experience
          </h2>
          <div className="space-y-2.5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">{exp.jobTitle} • {exp.company}</h3>
                  <span className="text-[11px] text-slate-500">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-700 mt-0.5">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Achievements */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
        {!isHidden('skills') && skills.length > 0 && (
          <div>
            <h3 className="text-xs uppercase font-bold text-emerald-800 mb-1.5">Technical Proficiencies</h3>
            <div className="flex flex-wrap gap-1">
              {skills.map((s) => (
                <span key={s.id} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {!isHidden('achievements') && achievements.length > 0 && (
          <div>
            <h3 className="text-xs uppercase font-bold text-emerald-800 mb-1.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Hackathons & Honors
            </h3>
            <div className="space-y-1 text-xs">
              {achievements.map((a) => (
                <div key={a.id}>
                  <p className="font-semibold text-slate-900">{a.title}</p>
                  <p className="text-[11px] text-slate-600">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
