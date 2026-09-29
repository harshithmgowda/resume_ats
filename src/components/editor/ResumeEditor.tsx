import React, { useState } from 'react';
import { SectionForm } from './SectionForm';
import { CanvasPreview } from './CanvasPreview';
import { DesignPanel } from './DesignPanel';
import { Edit3, Eye, Sliders, Palette } from 'lucide-react';

export const ResumeEditor: React.FC = () => {
  // Mobile / Tablet sub-tab switcher: 'content' | 'preview' | 'design'
  const [mobileTab, setMobileTab] = useState<'content' | 'preview' | 'design'>('preview');

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Mobile / Tablet Tab Switcher */}
      <div className="flex lg:hidden bg-white border-b border-slate-200 p-1.5 gap-1 shrink-0">
        <button
          onClick={() => setMobileTab('content')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'content'
              ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Content</span>
        </button>

        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'preview'
              ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Preview</span>
        </button>

        <button
          onClick={() => setMobileTab('design')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'design'
              ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Customize Design</span>
        </button>
      </div>

      {/* Main 3-Column Desktop Grid / Responsive Mobile View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form: visible on desktop, or when mobileTab === 'content' */}
        <div
          className={`${
            mobileTab === 'content' ? 'flex flex-1 w-full' : 'hidden lg:flex'
          } shrink-0`}
        >
          <SectionForm />
        </div>

        {/* Center Preview: visible on desktop, or when mobileTab === 'preview' */}
        <div
          className={`${
            mobileTab === 'preview' ? 'flex flex-1 w-full' : 'hidden lg:flex flex-1'
          }`}
        >
          <CanvasPreview />
        </div>

        {/* Right Customization Panel: visible on desktop, or when mobileTab === 'design' */}
        <div
          className={`${
            mobileTab === 'design' ? 'flex flex-1 w-full' : 'hidden 2xl:flex'
          } shrink-0`}
        >
          <DesignPanel />
        </div>
      </div>
    </div>
  );
};
