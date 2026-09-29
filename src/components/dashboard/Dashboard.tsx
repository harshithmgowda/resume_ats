import React from 'react';
import {
  Plus,
  Palette,
  UploadCloud,
  FileText,
  Download,
  Copy,
  Trash2,
  Edit3,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { templatesList } from '../../data/templates';
import { exportResumeAsPDF } from '../../utils/exportResume';

export const Dashboard: React.FC<{
  onOpenImportModal: () => void;
  onOpenShareModal: () => void;
  onPreviewTemplate: (tplId: string) => void;
}> = ({ onOpenImportModal, onOpenShareModal, onPreviewTemplate }) => {
  const {
    resumes,
    switchResume,
    createNewResume,
    duplicateResume,
    deleteResume,
    currentResume,
    setActiveView,
    designConfig,
  } = useResume();

  const handleEditResume = (id: string) => {
    switchResume(id);
    setActiveView('editor');
  };

  const handleDownload = async (resume: typeof currentResume) => {
    switchResume(resume.id);
    await exportResumeAsPDF(resume);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full select-none">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to ResumeForge 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Build and download professional resumes — 100% free, private, client-side session.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenImportModal}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <UploadCloud className="w-4 h-4 text-slate-500" />
            <span>Import Resume</span>
          </button>

          <button
            onClick={() => setActiveView('templates')}
            className="px-3.5 py-2 rounded-xl border border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Palette className="w-4 h-4 text-blue-600" />
            <span>Browse Templates</span>
          </button>

          <button
            onClick={() => createNewResume()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm shadow-blue-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Resume</span>
          </button>
        </div>
      </div>


      {/* Recent Resumes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Resumes</h2>
            <p className="text-xs text-slate-500">Pick up right where you left off</p>
          </div>
          <button
            onClick={() => createNewResume()}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> New Resume
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map((resume, idx) => {
            const isCurrent = resume.id === currentResume.id;
            const template = templatesList[idx % templatesList.length];

            return (
              <div
                key={resume.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-card transition-all overflow-hidden flex flex-col group"
              >
                {/* Visual Resume Card Top Thumbnail / Preview Strip */}
                <div
                  onClick={() => handleEditResume(resume.id)}
                  className="h-36 bg-gradient-to-br from-slate-100 to-slate-200/70 p-4 relative cursor-pointer overflow-hidden border-b border-slate-100 flex items-center justify-center"
                >
                  {/* Mini resume paper representation */}
                  <div className="w-36 h-48 bg-white shadow-md rounded-xs p-3 transition-transform group-hover:scale-105 duration-200 flex flex-col">
                    <div
                      className="w-12 h-1.5 rounded-full mb-1"
                      style={{ backgroundColor: template.defaultColors.primary }}
                    />
                    <div className="w-20 h-1 bg-slate-300 rounded-full mb-2" />
                    <div className="w-full h-0.5 bg-slate-100 my-1" />
                    <div className="space-y-1">
                      <div className="w-full h-1 bg-slate-200 rounded-xs" />
                      <div className="w-5/6 h-1 bg-slate-200 rounded-xs" />
                      <div className="w-4/6 h-1 bg-slate-200 rounded-xs" />
                    </div>
                    <div className="w-full h-0.5 bg-slate-100 my-1.5" />
                    <div className="space-y-1">
                      <div className="w-full h-1 bg-slate-200 rounded-xs" />
                      <div className="w-3/4 h-1 bg-slate-200 rounded-xs" />
                    </div>
                  </div>

                  {/* ATS Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-800 flex items-center gap-1 shadow-2xs">
                    <ShieldCheck className={`w-3 h-3 ${resume.atsScore && resume.atsScore > 0 ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{resume.atsScore && resume.atsScore > 0 ? `${resume.atsScore}% ATS` : 'Not Scanned'}</span>
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        onClick={() => handleEditResume(resume.id)}
                        className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer truncate"
                      >
                        {resume.name}
                      </h3>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 shrink-0">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>{template.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {resume.updatedAt}
                      </span>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditResume(resume.id)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDownload(resume)}
                        className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => duplicateResume(resume.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Duplicate resume"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteResume(resume.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete resume"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Templates Quick Carousel */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-blue-500/10">
        <div className="max-w-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-blue-100">
            Template Marketplace
          </span>
          <h3 className="text-xl md:text-2xl font-bold mt-2">
            Explore 12+ ATS-Engineered Resume Templates
          </h3>
          <p className="text-xs text-blue-100 mt-1 leading-relaxed">
            Switch styles with a single click. Designed for college students, software engineers, AI researchers, and executives.
          </p>
          <button
            onClick={() => setActiveView('templates')}
            className="mt-4 px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
