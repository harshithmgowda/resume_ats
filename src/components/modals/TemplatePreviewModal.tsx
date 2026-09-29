import React from 'react';
import { X, Check, Star, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { TemplateDefinition } from '../../types/resume';
import { useResume } from '../../context/ResumeContext';
import { TemplateRenderer } from '../templates/TemplateRenderer';

export const TemplatePreviewModal: React.FC<{
  template: TemplateDefinition | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ template, isOpen, onClose }) => {
  const { currentResume, designConfig, setTemplate, setActiveView } = useResume();

  if (!isOpen || !template) return null;

  const previewDesign = {
    ...designConfig,
    templateId: template.id,
    primaryColor: template.defaultColors.primary,
    headingColor: template.defaultColors.heading,
    accentColor: template.defaultColors.accent,
    backgroundColor: template.defaultColors.background,
  };

  const handleUseTemplate = () => {
    setTemplate(template.id);
    onClose();
    setActiveView('editor');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">{template.name}</h3>
            {template.atsFriendly && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" /> ATS Friendly
              </span>
            )}
            {template.isPro && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                PRO
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleUseTemplate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Use This Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Details & Right Scrollable Preview */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* Details Sidebar */}
          <div className="p-6 bg-slate-50 border-r border-slate-100 space-y-5 overflow-y-auto">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Description
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {template.description}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Rating</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {template.rating} / 5.0
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Target Role</span>
                <span className="font-semibold text-slate-800">{template.category}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Recommended For
              </span>
              <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                {template.recommendedFor}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900">
              <span className="font-bold block mb-0.5">Zero Data Loss Guarantee</span>
              Your existing resume content, education, experience, and custom sections are automatically mapped.
            </div>

            <button
              onClick={handleUseTemplate}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span>Apply to Current Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Live Preview Canvas */}
          <div className="col-span-2 bg-slate-200/70 p-6 overflow-y-auto flex justify-center items-start">
            <div className="transform scale-[0.75] origin-top transition-transform shadow-2xl rounded-sm">
              <TemplateRenderer
                resume={currentResume}
                design={previewDesign}
                isPrintMode={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
