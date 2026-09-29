import React from 'react';
import { CheckCircle2, Download, Edit3, Share2, Plus, X, BarChart3 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { exportResumeAsPDF } from '../../utils/exportResume';

export const ExportSuccessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onOpenShare: () => void;
}> = ({ isOpen, onClose, onOpenShare }) => {
  const { currentResume, createNewResume, setActiveView } = useResume();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1">
          Your resume is ready! 🎉
        </h3>
        <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">
          "{currentResume.name}" was exported successfully with 100% crisp typography and clean ATS-ready formatting.
        </p>

        <div className="space-y-2.5">
          <button
            onClick={() => exportResumeAsPDF(currentResume)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Again</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenShare();
            }}
            className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>Share Resume Link</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onClose();
                setActiveView('editor');
              }}
              className="py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Resume</span>
            </button>

            <button
              onClick={() => {
                onClose();
                createNewResume();
              }}
              className="py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>New Resume</span>
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 text-[11px] text-slate-400 hover:text-slate-600 font-medium"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
