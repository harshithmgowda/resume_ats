import React from 'react';
import { ResumeData, DesignConfig } from '../../types/resume';
import { ContactBar } from './shared';
import { Sparkles, ExternalLink } from 'lucide-react';

export const CreativePurpleTemplate: React.FC<{
  resume: ResumeData;
  design: DesignConfig;
  animClass?: string;
  photoAnimClass?: string;
}> = ({ resume, design, animClass = '', photoAnimClass = '' }) => {
  const { personal, summary, education, experience, projects, skills, certifications, languages, achievements } = resume;
  const isHidden = (key: string) => design.hiddenSections.includes(key as any);

  return (
    <div className={`p-8 font-sans text-slate-800 ${animClass}`} style={{ backgroundColor: design.backgroundColor }}>
      {/* Creative Header with Violet Accent */}
      <header className="bg-gradient-to-r from-purple-700 via-indigo-600 to-violet-800 text-white rounded-2xl p-6 shadow-md mb-6 flex justify-between items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-purple-100 text-[10px] font-semibold tracking-wide uppercase mb-2">
            <Sparkles className="w-3 h-3" /> Creative Portfolio
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            {personal.fullName}
          </h1>
          <p className="text-sm font-medium text-purple-200 mt-1">
            {personal.jobTitle}
          </p>
          <div className="mt-3">
            <ContactBar
              personal={personal}
              iconClass="w-3.5 h-3.5 text-purple-200"
              itemClass="flex items-center gap-1.5 text-xs text-purple-100"
              linkClass="hover:underline text-white font-medium"
            />
          </div>
        </div>
        {personal.showPhoto && personal.photoUrl && (
          <img
            src={personal.photoUrl}
            alt={personal.fullName}
            className={`w-24 h-24 object-cover border-4 border-white/80 shadow-lg ${photoAnimClass} ${
              design.photoShape === 'circle' ? 'rounded-full' : 'rounded-2xl'
            }`}
          />
        )}
      </header>

      {/* Profile */}
      {!isHidden('summary') && summary && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs uppercase font-extrabold tracking-wider text-purple-700 mb-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span> About Me
          </h2>
          <p className="text-xs leading-relaxed text-slate-700">{summary}</p>
        </section>
      )}

      {/* Projects Showcase */}
      {!isHidden('projects') && projects.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs uppercase font-extrabold tracking-wider text-purple-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span> Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {projects.map((proj) => (
              <div key={proj.id} className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/40 hover:bg-purple-50/80 transition-all">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-slate-900">{proj.title}</h3>
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-purple-600 hover:text-purple-800">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-1 mb-2">{proj.description}</p>
                <div className="flex flex-wrap gap-1">
                  {proj.technologies?.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {!isHidden('experience') && experience.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs uppercase font-extrabold tracking-wider text-purple-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span> Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-3.5 border-l-2 border-purple-300">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">{exp.jobTitle}</h3>
                  <span className="text-[11px] text-purple-700 font-semibold">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium mb-1">
                  {exp.company} • {exp.location}
                </div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-700">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Education */}
      <div className="grid grid-cols-2 gap-5 pt-2 border-t border-purple-100">
        {!isHidden('skills') && skills.length > 0 && (
          <div>
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-purple-700 mb-2">Skills & Toolkit</h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s.id} className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {!isHidden('education') && education.length > 0 && (
          <div>
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-purple-700 mb-2">Education</h3>
            {education.map((edu) => (
              <div key={edu.id} className="text-xs mb-2">
                <p className="font-bold text-slate-800">{edu.degree}</p>
                <p className="text-purple-800 font-medium">{edu.institution}</p>
                <p className="text-slate-500 text-[11px]">{edu.startDate} – {edu.endDate} {edu.grade && `(${edu.grade})`}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
