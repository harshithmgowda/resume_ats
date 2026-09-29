import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Globe, Lock, Share2, QrCode } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

export const ShareModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { currentResume, setActiveView } = useResume();
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  if (!isOpen) return null;

  const slug = (currentResume.personal.fullName || 'user')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  const shareUrl = `https://resumeforge.app/r/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPublicView = () => {
    onClose();
    setActiveView('publicView');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Share Your Resume</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Privacy Switch */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              {isPublic ? (
                <Globe className="w-4 h-4 text-emerald-600" />
              ) : (
                <Lock className="w-4 h-4 text-slate-500" />
              )}
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {isPublic ? 'Public Web Link' : 'Private Only'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {isPublic ? 'Anyone with the link can view your live animated resume' : 'Only visible to you'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                isPublic ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform transform shadow-xs ${
                  isPublic ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Shareable Link Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Unique Resume URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 select-all outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* QR Code Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
            <div className="w-16 h-16 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
              <QrCode className="w-12 h-12 text-slate-800" />
            </div>
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900 block mb-0.5">Scannable QR Code</span>
              Recruiters can instantly scan this from your phone screen or printed portfolio.
            </div>
          </div>

          {/* View Live Page Action */}
          <button
            onClick={handleOpenPublicView}
            className="w-full py-2.5 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <span>Preview Public Resume Webpage</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
