import React, { useRef, useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Sparkles,
  FileText,
  Layers,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { TemplateRenderer } from '../templates/TemplateRenderer';

export const CanvasPreview: React.FC = () => {
  const {
    currentResume,
    designConfig,
    animationConfig,
    zoomLevel,
    setZoomLevel,
    previewAnimationKey,
    triggerPreviewAnimation,
  } = useResume();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-fit function
  const handleFitToScreen = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 48; // padding
      // A4 page width in px at standard 96dpi is ~794px
      const targetRatio = (containerWidth / 794) * 100;
      setZoomLevel(Math.min(100, Math.max(50, Math.round(targetRatio))));
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex-1 bg-slate-200/70 overflow-auto relative flex flex-col items-center p-6 lg:p-8 select-none transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 bg-slate-900/90 p-4 backdrop-blur-xs' : ''
      }`}
    >
      {/* Floating Canvas Quick Controls Bar */}
      <div className="sticky top-2 z-20 mb-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-card border border-slate-200/80 flex items-center gap-3 text-xs">
        {/* Zoom */}
        <div className="flex items-center gap-1 text-slate-600">
          <button
            onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
            className="p-1 hover:text-slate-900 rounded hover:bg-slate-100"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="w-12 text-center font-mono font-medium text-slate-800 text-[11px]">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
            className="p-1 hover:text-slate-900 rounded hover:bg-slate-100"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-px h-4 bg-slate-200" />

        <button
          onClick={handleFitToScreen}
          className="text-slate-600 hover:text-blue-600 font-medium text-[11px] px-1.5 py-0.5 rounded hover:bg-slate-100"
        >
          Fit to Screen
        </button>

        <button
          onClick={() => setZoomLevel(100)}
          className="text-slate-600 hover:text-blue-600 font-medium text-[11px] px-1.5 py-0.5 rounded hover:bg-slate-100"
        >
          100%
        </button>

        <div className="w-px h-4 bg-slate-200" />

        {/* Replay Motion */}
        <button
          onClick={triggerPreviewAnimation}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-[11px] px-2 py-0.5 rounded-lg hover:bg-blue-50 transition-colors"
          title="Replay online animation"
        >
          <Play className="w-3 h-3 fill-blue-600" />
          <span>Motion</span>
        </button>

        {/* Fullscreen toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 ml-1"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Canvas'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* A4 Sheet Canvas Wrapper with Zoom Scale */}
      <div
        className="transition-transform duration-200 origin-top flex flex-col items-center"
        style={{ transform: `scale(${zoomLevel / 100})` }}
      >
        {/* The export container target */}
        <div id="resume-canvas-export" key={previewAnimationKey} className="relative">
          <TemplateRenderer
            resume={currentResume}
            design={designConfig}
            animation={animationConfig}
          />

          {/* Page Number Marker */}
          <div className="absolute bottom-2 right-4 text-[10px] text-slate-400 font-mono no-print">
            Page 1 of 1
          </div>
        </div>

        {/* Subtle Sheet Guide Helper */}
        <div className="mt-3 text-center text-[11px] text-slate-400 no-print flex items-center gap-1.5 font-medium">
          <FileText className="w-3 h-3" />
          <span>A4 Sheet • 210mm × 297mm • Print Ready</span>
        </div>
      </div>
    </div>
  );
};
