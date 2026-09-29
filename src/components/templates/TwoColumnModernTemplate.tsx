import React from 'react';
import { ResumeData, DesignConfig } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';

export const TwoColumnModernTemplate: React.FC<{
  resume: ResumeData;
  design: DesignConfig;
  animClass?: string;
  photoAnimClass?: string;
}> = ({ resume, design, animClass = '', photoAnimClass = '' }) => {
  const { personal, summary, education, experience, projects, skills, certifications, languages, achievements } = resume;
  const isHidden = (key: string) => design.hiddenSections.includes(key as any);

  return (
    <div className={`grid grid-cols-12 min-h-full font-sans text-slate-800 ${animClass}`} style={{ backgroundColor: design.backgroundColor }}>
      {/* Left Sidebar Column (4 of 12 cols) */}
      <div className="col-span-4 bg-slate-50 border-r border-slate-200 p-6 space-y-5">
        {/* Photo & Name */}
        <div className="text-center">
          {personal.showPhoto && personal.photoUrl && (
            <img
              src={personal.photoUrl}
              alt={personal.fullName}
              className={`w-28 h-28 mx-auto object-cover border-4 border-white shadow-md mb-3 ${photoAnimClass} ${
                design.photoShape === 'circle' ? 'rounded-full' : 'rounded-2xl'
              }`}
            />
          )}
          <h1 className="text-xl font-extrabold text-slate-900 leading-snug">{personal.fullName}</h1>
          <p className="text-xs font-semibold text-sky-700 mt-0.5">{personal.jobTitle}</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-xs border-t border-slate-200 pt-4">
          <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contact</h3>
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="flex items-center gap-2 text-slate-700 hover:text-sky-600 truncate">
              <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="truncate">{personal.email}</span>
            </a>
          )}
          {personal.phone && (
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{personal.phone}</span>
            </div>
          )}
          {personal.location && (
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{personal.location}</span>
            </div>
          )}
          {personal.github && (
            <a href={personal.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-700 hover:text-sky-600 truncate">
              <GithubIcon className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="truncate">{personal.github.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
          {personal.linkedin && (
            <a href={personal.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-700 hover:text-sky-600 truncate">
              <LinkedinIcon className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="truncate">{personal.linkedin.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
        </div>

        {/* Education */}
        {!isHidden('education') && education.length > 0 && (
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Education</h3>
            <div className="space-y-2.5 text-xs">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-bold text-slate-900">{edu.degree}</p>
                  <p className="text-slate-600">{edu.institution}</p>
                  <p className="text-[11px] text-sky-700 font-medium">{edu.startDate} – {edu.endDate}</p>
                  {edu.grade && <p className="text-[11px] text-slate-500">{edu.grade}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {!isHidden('skills') && skills.length > 0 && (
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Skills</h3>
            <div className="flex flex-wrap gap-1">
              {skills.map((s) => (
                <span key={s.id} className="text-[11px] px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200 shadow-2xs font-medium">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {!isHidden('languages') && languages.length > 0 && (
          <div className="border-t border-slate-200 pt-4 text-xs">
            <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Languages</h3>
            {languages.map((l) => (
              <div key={l.id} className="flex justify-between py-0.5">
                <span className="font-medium text-slate-800">{l.name}</span>
                <span className="text-slate-500 text-[11px]">{l.proficiency}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content Column (8 of 12 cols) */}
      <div className="col-span-8 p-6 space-y-5">
        {/* Summary */}
        {!isHidden('summary') && summary && (
          <section className="resume-section-block">
            <h2 className="text-xs uppercase font-bold text-sky-800 tracking-wider border-b border-sky-100 pb-1 mb-2">
              Profile Overview
            </h2>
            <p className="text-xs leading-relaxed text-slate-700">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {!isHidden('experience') && experience.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs uppercase font-bold text-sky-800 tracking-wider border-b border-sky-100 pb-1 mb-3">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-slate-900">{exp.jobTitle}</h3>
                    <span className="text-[11px] text-slate-500 font-medium">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                  </div>
                  <p className="text-xs text-sky-700 font-semibold mb-1">{exp.company} • {exp.location}</p>
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

        {/* Projects */}
        {!isHidden('projects') && projects.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs uppercase font-bold text-sky-800 tracking-wider border-b border-sky-100 pb-1 mb-3">
              Highlighted Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-slate-900">{proj.title}</h3>
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-sky-600">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">{proj.startDate}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>
                  {proj.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-sky-50 text-sky-800 font-medium">
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

        {/* Achievements / Certs */}
        {!isHidden('achievements') && achievements.length > 0 && (
          <section className="resume-section-block">
            <h2 className="text-xs uppercase font-bold text-sky-800 tracking-wider border-b border-sky-100 pb-1 mb-2">
              Honors & Certifications
            </h2>
            <div className="space-y-1.5 text-xs">
              {achievements.map((a) => (
                <div key={a.id}>
                  <span className="font-semibold text-slate-900">{a.title}: </span>
                  <span className="text-slate-600">{a.description}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
