import React, { useState } from 'react';
import {
  Menu,
  Check,
  RefreshCw,
  Share2,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Printer,
  Image,
  ChevronDown,
  Sparkles,
  Palette,
  Eye,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { templatesList } from '../../data/templates';
import {
  exportResumeAsPDF,
  exportResumeAsPNG,
  exportResumeAsDOCX,
  printResumePage,
} from '../../utils/exportResume';

export const Topbar: React.FC<{
  onOpenMobileNav: () => void;
  onOpenShareModal: () => void;
  onOpenExportSuccess: () => void;
}> = ({ onOpenMobileNav, onOpenShareModal, onOpenExportSuccess }) => {
  const {
    currentResume,
    updateResume,
    autosaveStatus,
    designConfig,
    setTemplate,
    zoomLevel,
    setZoomLevel,
    triggerPreviewAnimation,
    activeView,
    setActiveView,
  } = useResume();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(currentResume.name);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const activeTemplateDef = templatesList.find((t) => t.id === designConfig.templateId) || templatesList[0];

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      updateResume((prev) => ({ ...prev, name: titleInput.trim() }));
    } else {
      setTitleInput(currentResume.name);
    }
  };

  const handleDownloadPDF = async () => {
    setShowDownloadMenu(false);
    setIsExporting(true);
    try {
      await exportResumeAsPDF(currentResume);
      onOpenExportSuccess();
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPNG = async () => {
    setShowDownloadMenu(false);
    await exportResumeAsPNG(currentResume);
    onOpenExportSuccess();
  };

  const handleDownloadDOCX = () => {
    setShowDownloadMenu(false);
    exportResumeAsDOCX(currentResume);
    onOpenExportSuccess();
  };

  const handlePrint = () => {
    setShowDownloadMenu(false);
    printResumePage();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-3 sticky top-0 z-20 select-none">
      {/* Left: Mobile hamburger & Resume Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title editing */}
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="text-sm font-bold text-slate-900 border border-blue-400 rounded-lg px-2 py-1 outline-none shadow-xs focus:ring-2 focus:ring-blue-100"
            />
          ) : (
            <div
              onClick={() => {
                setTitleInput(currentResume.name);
                setIsEditingTitle(true);
              }}
              className="group flex items-center gap-1.5 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              title="Click to rename resume"
            >
              <h2 className="text-sm font-bold text-slate-900 truncate max-w-[140px] sm:max-w-[220px]">
                {currentResume.name}
              </h2>
              <span className="text-[10px] text-slate-400 group-hover:text-blue-600 font-medium">
                ✎
              </span>
            </div>
          )}

          {/* Privacy badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Private Session • No Storage</span>
          </div>
        </div>
      </div>

      {/* Center: Template Switcher & Zoom (shown on builder/preview) */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Template Selector dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTemplateMenu(!showTemplateMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <Palette className="w-3.5 h-3.5 text-blue-600" />
            <span>{activeTemplateDef.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showTemplateMenu && (
            <div className="absolute top-full mt-1.5 left-0 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 max-h-72 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Template (12)
              </div>
              {templatesList.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setTemplate(tpl.id);
                    setShowTemplateMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                    tpl.id === designConfig.templateId
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: tpl.defaultColors.primary }}
                    />
                    <span>{tpl.name}</span>
                  </div>
                  {tpl.isPro && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                      PRO
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Zoom controls */}
        <div className="flex items-center bg-slate-100/80 rounded-xl p-1 text-slate-600 text-xs border border-slate-200">
          <button
            onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
            className="p-1 hover:text-slate-900 rounded hover:bg-white"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 text-[11px] font-medium text-slate-700 w-12 text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
            className="p-1 hover:text-slate-900 rounded hover:bg-white"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(100)}
            className="p-1 hover:text-slate-900 rounded hover:bg-white ml-0.5"
            title="Reset to 100%"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Share Button */}
        <button
          onClick={onOpenShareModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Download Resume Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            disabled={isExporting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all shadow-sm shadow-blue-500/20"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </>
            )}
          </button>

          {showDownloadMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Export Options
              </div>
              <button
                onClick={handleDownloadPDF}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-800 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 font-medium transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-semibold">Download PDF (Clean A4)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Direct high-res file download</div>
                </div>
              </button>

              <button
                onClick={handlePrint}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-800 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 font-medium transition-colors"
              >
                <Printer className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-semibold text-slate-900">Save as PDF / Print (Vector)</div>
                  <div className="text-[10px] text-emerald-600 font-normal">100% crisp selectable text</div>
                </div>
              </button>

              <button
                onClick={handleDownloadPNG}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-800 hover:bg-slate-50 flex items-center gap-2.5 font-medium transition-colors"
              >
                <Image className="w-4 h-4 text-slate-600" />
                <div>
                  <div className="font-semibold">Download PNG Image</div>
                  <div className="text-[10px] text-slate-400 font-normal">High-res 2x raster</div>
                </div>
              </button>

              <button
                onClick={handleDownloadDOCX}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-800 hover:bg-slate-50 flex items-center gap-2.5 font-medium transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-600" />
                <div>
                  <div className="font-semibold">Download Text / DOCX</div>
                  <div className="text-[10px] text-slate-400 font-normal">Editable structured text</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
