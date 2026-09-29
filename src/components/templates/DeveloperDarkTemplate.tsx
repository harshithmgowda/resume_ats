import React from 'react';
import { ResumeData, DesignConfig } from '../../types/resume';
import { Terminal, Globe, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';

export const DeveloperDarkTemplate: React.FC<{
  resume: ResumeData;
  design: DesignConfig;
  animClass?: string;
  photoAnimClass?: string;
}> = ({ resume, design, animClass = '', photoAnimClass = '' }) => {
  const { personal, summary, education, experience, projects, skills, certifications, languages, achievements } = resume;
  const isHidden = (key: string) => design.hiddenSections.includes(key as any);

  return (
    <div className={`font-sans text-slate-800 ${animClass}`} style={{ backgroundColor: design.backgroundColor }}>
      {/* Dark Slate Terminal Header */}
      <header className="bg-slate-900 text-white p-7 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3 text-emerald-400 font-mono text-xs">
          <Terminal className="w-3.5 h-3.5" />
          <span>~/workspace/profile.json</span>
          <span className="ml-auto text-slate-500 font-mono text-[11px]">// v2.4.0</span>
        </div>
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
              <span className="text-cyan-400">&gt; </span>{personal.fullName}
            </h1>
            <p className="text-sm font-mono text-cyan-300 mt-1">
              const role = "{personal.jobTitle}";
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-300 font-mono">
              {personal.email && (
                <span className="flex items-center gap-1.5 hover:text-cyan-300">
                  <Mail className="w-3 h-3 text-cyan-400" /> {personal.email}
                </span>
              )}
              {personal.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-cyan-400" /> {personal.phone}
                </span>
              )}
              {personal.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-cyan-400" /> {personal.location}
                </span>
              )}
              {personal.github && (
                <span className="flex items-center gap-1.5 hover:text-cyan-300">
                  <GithubIcon className="w-3 h-3 text-cyan-400" /> {personal.github.replace(/^https?:\/\//, '')}
                </span>
              )}
            </div>
          </div>
          {personal.showPhoto && personal.photoUrl && (
            <img
              src={personal.photoUrl}
              alt={personal.fullName}
              className={`w-20 h-20 object-cover border-2 border-cyan-400 shadow-lg ${photoAnimClass} ${
                design.photoShape === 'circle' ? 'rounded-full' : 'rounded-lg'
              }`}
            />
          )}
        </div>
      </header>

      {/* Main Body */}
      <div className="p-7 space-y-5">
        {/* Summary */}
        {!isHidden('summary') && summary && (
          <section className="resume-section-block bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <span className="text-cyan-600 font-bold">#</span> About The Developer
            </h2>
            <p className="text-xs leading-relaxed text-slate-600">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {!isHidden('experience') && experience.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b pb-1.5 mb-3 flex items-center justify-between">
              <span><span className="text-cyan-600 font-bold">&lt;</span> Experience <span className="text-cyan-600 font-bold">/&gt;</span></span>
              <span className="text-[10px] text-slate-400 font-normal font-sans">Timeline</span>
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-3.5 border-l-2 border-cyan-500">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-slate-900 font-mono">{exp.jobTitle}</h3>
                    <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {exp.startDate} – {exp.isCurrent ? 'Current' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-cyan-700 mb-1.5">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
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
          <section className="resume-section-block">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b pb-1.5 mb-3">
              <span className="text-cyan-600 font-bold">&lt;</span> Featured Repositories <span className="text-cyan-600 font-bold">/&gt;</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projects.map((proj) => (
                <div key={proj.id} className="border border-slate-200 rounded-lg p-3 hover:border-cyan-400 transition-colors bg-white">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xs font-bold font-mono text-slate-900">{proj.title}</h3>
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-600">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">{proj.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {proj.technologies?.map((tech, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Stack / Skills */}
        {!isHidden('skills') && skills.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b pb-1.5 mb-2.5">
              <span className="text-cyan-600 font-bold">&lt;</span> Skills Matrix <span className="text-cyan-600 font-bold">/&gt;</span>
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s.id} className="text-xs font-mono px-2 py-0.5 bg-slate-900 text-cyan-300 rounded text-[11px]">
                  $ {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education & Certs */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          {!isHidden('education') && education.length > 0 && (
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">Degree</h3>
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <p className="font-bold text-slate-800">{edu.degree}</p>
                  <p className="text-slate-600">{edu.institution} ({edu.startDate} – {edu.endDate})</p>
                  {edu.grade && <p className="text-[11px] font-mono text-cyan-700">{edu.grade}</p>}
                </div>
              ))}
            </div>
          )}

          {!isHidden('certifications') && certifications.length > 0 && (
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">Certifications</h3>
              {certifications.map((c) => (
                <div key={c.id} className="text-xs mb-1">
                  <p className="font-semibold text-slate-800">{c.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{c.issuer} • {c.issueDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
