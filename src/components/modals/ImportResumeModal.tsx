import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { ResumeData } from '../../types/resume';

export const ImportResumeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { importResumeData, setActiveView } = useResume();
  const [step, setStep] = useState<'upload' | 'parsing' | 'review'>('upload');
  const [fileName, setFileName] = useState('');
  const [parseProgress, setParseProgress] = useState(0);

  // Extracted data ready for user confirmation
  const [extractedData, setExtractedData] = useState<Partial<ResumeData>>({
    name: 'Imported Resume',
    personal: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      photoUrl: '',
      showPhoto: false,
      fieldVisibility: {
        email: true,
        phone: true,
        location: true,
        website: true,
        linkedin: true,
        github: true,
      },
    },
    summary: '',
  });

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const guessedName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/resume/gi, '')
        .replace(/[_-]/g, ' ')
        .trim();

      setExtractedData({
        name: guessedName ? `${guessedName} Resume` : 'Imported Resume',
        personal: {
          fullName: guessedName && guessedName.length < 35 ? guessedName : '',
          jobTitle: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          github: '',
          photoUrl: '',
          showPhoto: false,
          fieldVisibility: {
            email: true,
            phone: true,
            location: true,
            website: true,
            linkedin: true,
            github: true,
          },
        },
        summary: '',
      });
      setStep('parsing');
      setParseProgress(15);

      const interval = setInterval(() => {
        setParseProgress((p) => {
          if (p >= 95) {
            clearInterval(interval);
            setTimeout(() => setStep('review'), 300);
            return 100;
          }
          return p + 20;
        });
      }, 300);
    }
  };

  const handleConfirmImport = () => {
    importResumeData(extractedData);
    onClose();
    setStep('upload');
    setActiveView('editor');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Import Existing Resume</h3>
              <p className="text-[11px] text-slate-400">PDF, DOCX, or text format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Upload Dropzone */}
        {step === 'upload' && (
          <div className="mt-5 space-y-4">
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/30 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Click or drag & drop your resume file
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports PDF, DOCX, or RTF (up to 10MB)
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Our AI parser extracts work experience, projects, skills, education, and links directly into our 12 customizable templates.
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Parsing Animation */}
        {step === 'parsing' && (
          <div className="py-12 px-4 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Parsing "{fileName}"...
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Extracting contact info, sections, and technical skills
              </p>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${parseProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 3: Review Extracted Data */}
        {step === 'review' && (
          <div className="mt-4 space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Resume parsed successfully! Review the extracted preview below.</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs max-h-60 overflow-y-auto">
              <div>
                <span className="font-bold text-slate-700 block">Candidate Name:</span>
                <span className="text-slate-900">{extractedData.personal?.fullName || fileName || 'Ready for entry'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Professional Title:</span>
                <span className="text-slate-900">{extractedData.personal?.jobTitle || 'Ready for entry'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Contact:</span>
                <span className="text-slate-600">
                  {extractedData.personal?.email || 'email@example.com'} • {extractedData.personal?.phone || '+1 555-000-0000'}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Extracted Summary:</span>
                <span className="text-slate-600">{extractedData.summary || 'Ready to format and customize in the builder.'}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep('upload')}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
              >
                Upload Different File
              </button>
              <button
                onClick={handleConfirmImport}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Import to Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
