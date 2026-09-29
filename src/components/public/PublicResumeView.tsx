import React from 'react';
import {
  ArrowLeft,
  Download,
  Share2,
  Mail,
  Globe,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import { useResume } from '../../context/ResumeContext';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { exportResumeAsPDF } from '../../utils/exportResume';

export const PublicResumeView: React.FC<{ onOpenShare: () => void }> = ({ onOpenShare }) => {
  const { currentResume, designConfig, animationConfig, setActiveView } = useResume();

  const handleDownload = async () => {
    await exportResumeAsPDF(currentResume);
  };

  return (
    <div className="flex-1 bg-slate-900 min-h-screen overflow-y-auto flex flex-col select-none">
      {/* Top Floating Glass Navigation Header */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('editor')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Studio</span>
          </button>

          <div>
            <h1 className="text-sm font-bold text-white leading-tight">
              {currentResume.personal.fullName || currentResume.name || 'Live Resume'}
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              {(typeof window !== 'undefined' ? window.location.host : 'resumeats-three.vercel.app')}/?view=publicView&r={(currentResume.personal.fullName || 'resume').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}
            </p>
          </div>
        </div>

        {/* Quick Social & Action buttons */}
        <div className="flex items-center gap-2">
          {currentResume.personal.email && (
            <a
              href={`mailto:${currentResume.personal.email}`}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Send Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
          {currentResume.personal.github && (
            <a
              href={currentResume.personal.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
          {currentResume.personal.linkedin && (
            <a
              href={currentResume.personal.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={onOpenShare}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Share Resume"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      {/* Main Resume Presentation Canvas with Subtle Entrance Animation */}
      <main className="flex-1 p-6 md:p-12 flex justify-center items-start">
        <div className="max-w-[210mm] w-full shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div id="resume-canvas-export">
            <TemplateRenderer
              resume={currentResume}
              design={designConfig}
              animation={{ ...animationConfig, enabled: true }}
            />
          </div>
        </div>
      </main>

      {/* Public Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 border-t border-slate-800">
        Created with <span className="text-white font-bold">ResumeForge</span> — AI Resume Builder & Template Marketplace
      </footer>
    </div>
  );
};
