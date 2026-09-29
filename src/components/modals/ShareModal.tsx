import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, Globe, Lock, Share2, QrCode } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

export const ShareModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { currentResume, setActiveView } = useResume();
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  // Sync current active resume to session storage for seamless cross-tab / preview viewing
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem('resumeforge_active_share', JSON.stringify(currentResume));
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen, currentResume]);

  if (!isOpen) return null;

  // Dynamically resolve actual origin (e.g. https://resumeats-three.vercel.app or localhost in dev)
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://resumeats-three.vercel.app';

  const slug = (currentResume.personal.fullName || 'resume')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'resume';

  const shareUrl = `${origin}/?view=publicView&r=${slug}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPublicView = () => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem('resumeforge_active_share', JSON.stringify(currentResume));
      } catch (e) {
        // ignore
      }
    }
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

          {/* Real Scannable QR Code */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
            <div className="w-16 h-16 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={qrCodeUrl}
                alt="Scannable QR Code"
                className="w-14 h-14 object-contain rounded"
              />
            </div>
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900 block mb-0.5">Scannable QR Code</span>
              Recruiters can instantly scan this with their phone camera to view your live resume.
            </div>
          </div>

          {/* View Live Page Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleOpenPublicView}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Preview Public Resume Webpage</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              title="Open in new browser tab"
            >
              <span>New Tab</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
