import React from 'react';
import { ResumeData, DesignConfig } from '../../types/resume';
import { ContactBar } from './shared';
import { Cpu, Brain, Network, GitFork, ExternalLink } from 'lucide-react';

export const AIEngineerTemplate: React.FC<{
  resume: ResumeData;
  design: DesignConfig;
  animClass?: string;
  photoAnimClass?: string;
}> = ({ resume, design, animClass = '', photoAnimClass = '' }) => {
  const { personal, summary, education, experience, projects, skills, certifications, languages, achievements } = resume;
  const isHidden = (key: string) => design.hiddenSections.includes(key as any);

  // Split skills into AI/ML and general
  const mlSkills = skills.filter((s) => s.category === 'AI/ML' || ['Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'Docker'].includes(s.name));
  const otherSkills = skills.filter((s) => !mlSkills.some((m) => m.id === s.id));

  return (
    <div className={`p-8 font-sans text-slate-800 ${animClass}`} style={{ backgroundColor: design.backgroundColor }}>
      {/* AI Engineer Header */}
      <header className="border-b-2 border-indigo-600 pb-5 mb-5 flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-mono font-semibold mb-1">
            <Brain className="w-4 h-4" />
            <span>AI / ML RESEARCH & APPLIED ENGINEERING</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {personal.fullName}
          </h1>
          <p className="text-sm font-semibold text-indigo-600 mt-0.5">
            {personal.jobTitle}
          </p>
          <div className="mt-3">
            <ContactBar personal={personal} iconClass="w-3.5 h-3.5 text-indigo-600" />
          </div>
        </div>
        {personal.showPhoto && personal.photoUrl && (
          <img
            src={personal.photoUrl}
            alt={personal.fullName}
            className={`w-22 h-22 object-cover border-2 border-indigo-600 shadow-sm ${photoAnimClass} ${
              design.photoShape === 'circle' ? 'rounded-full' : 'rounded-xl'
            }`}
          />
        )}
      </header>

      {/* AI / ML Core Competencies Matrix Box */}
      <section className="mb-5 bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-xl resume-section-block">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-900 mb-2 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-indigo-600" /> Core Machine Learning & Data Matrix
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span
              key={s.id}
              className={`text-xs px-2.5 py-0.5 rounded-md font-mono font-medium ${
                s.category === 'AI/ML' || ['PyTorch', 'TensorFlow', 'FastAPI', 'Python'].includes(s.name)
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-white text-slate-700 border border-indigo-200'
              }`}
            >
              {s.name}
            </span>
          ))}
        </div>
      </section>

      {/* Research / Experience */}
      {!isHidden('experience') && experience.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs uppercase font-bold tracking-wider text-indigo-900 border-b pb-1 mb-3 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-indigo-600" /> Engineering & Research Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-3.5 border-l-2 border-indigo-400">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">{exp.jobTitle}</h3>
                  <span className="text-[11px] font-mono text-slate-500">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-xs font-semibold text-indigo-700 mb-1">{exp.company} • {exp.location}</div>
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

      {/* ML & Engineering Projects */}
      {!isHidden('projects') && projects.length > 0 && (
        <section className="mb-5 resume-section-block">
          <h2 className="text-xs uppercase font-bold tracking-wider text-indigo-900 border-b pb-1 mb-3 flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-indigo-600" /> Model Deployments & AI Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{proj.title}</h3>
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-0.5 text-[10px] font-mono">
                        [repo] <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{proj.startDate}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>
                {proj.highlights?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-700 mt-1">
                    {proj.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
                {proj.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-800">
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

      {/* Education & Achievements */}
      <div className="grid grid-cols-2 gap-5 pt-2 border-t border-slate-200">
        {!isHidden('education') && education.length > 0 && (
          <div>
            <h3 className="text-xs uppercase font-bold text-indigo-900 mb-1.5">Academic Credentials</h3>
            {education.map((edu) => (
              <div key={edu.id} className="text-xs mb-1">
                <p className="font-bold text-slate-900">{edu.degree}</p>
                <p className="text-slate-600">{edu.institution} ({edu.startDate} – {edu.endDate})</p>
                {edu.grade && <p className="text-indigo-700 font-mono text-[11px]">{edu.grade}</p>}
              </div>
            ))}
          </div>
        )}

        {!isHidden('certifications') && certifications.length > 0 && (
          <div>
            <h3 className="text-xs uppercase font-bold text-indigo-900 mb-1.5">Specializations</h3>
            {certifications.map((c) => (
              <div key={c.id} className="text-xs mb-1">
                <p className="font-semibold text-slate-900">{c.name}</p>
                <p className="text-slate-500 text-[11px]">{c.issuer} ({c.issueDate})</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
