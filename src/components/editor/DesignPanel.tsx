import React, { useState } from 'react';
import {
  Palette,
  Type,
  Layout,
  Sparkles,
  Sliders,
  Check,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import {
  FontFamilyType,
  FontSizeType,
  LineHeightType,
  MarginType,
  SpacingType,
  TextAnimationType,
  PhotoAnimationType,
  SectionAnimationType,
  SectionKey,
} from '../../types/resume';

const PRESET_PALETTES = [
  { name: 'Professional Blue', primary: '#2563eb', heading: '#0f172a', accent: '#3b82f6', bg: '#ffffff' },
  { name: 'Corporate Navy', primary: '#1e3a8a', heading: '#172554', accent: '#3b82f6', bg: '#ffffff' },
  { name: 'Minimal Black', primary: '#09090b', heading: '#09090b', accent: '#52525b', bg: '#ffffff' },
  { name: 'Emerald Green', primary: '#059669', heading: '#064e3b', accent: '#10b981', bg: '#ffffff' },
  { name: 'Creative Purple', primary: '#7c3aed', heading: '#4c1d95', accent: '#8b5cf6', bg: '#ffffff' },
  { name: 'Warm Amber', primary: '#d97706', heading: '#78350f', accent: '#f59e0b', bg: '#ffffff' },
  { name: 'Ruby Crimson', primary: '#dc2626', heading: '#7f1d1d', accent: '#ef4444', bg: '#ffffff' },
  { name: 'Slate Gray', primary: '#475569', heading: '#1e293b', accent: '#64748b', bg: '#ffffff' },
];

const FONTS: { id: FontFamilyType; label: string; sample: string }[] = [
  { id: 'Inter', label: 'Inter', sample: 'Modern, high legibility' },
  { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', sample: 'Sleek geometric tech' },
  { id: 'Roboto', label: 'Roboto', sample: 'Neutral, clean readability' },
  { id: 'Poppins', label: 'Poppins', sample: 'Contemporary geometric' },
  { id: 'Montserrat', label: 'Montserrat', sample: 'Bold architectural punch' },
  { id: 'Lato', label: 'Lato', sample: 'Warm corporate clarity' },
  { id: 'Merriweather', label: 'Merriweather', sample: 'Scholarly executive serif' },
  { id: 'JetBrains Mono', label: 'JetBrains Mono', sample: 'Monospace developer code' },
];

export const DesignPanel: React.FC = () => {
  const {
    designConfig,
    updateDesignConfig,
    animationConfig,
    updateAnimationConfig,
    triggerPreviewAnimation,
    reorderSections,
    toggleSectionVisibility,
  } = useResume();

  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'motion'>('colors');

  const handlePaletteSelect = (p: typeof PRESET_PALETTES[0]) => {
    updateDesignConfig({
      primaryColor: p.primary,
      headingColor: p.heading,
      accentColor: p.accent,
      backgroundColor: p.bg,
    });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const list = [...designConfig.sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    reorderSections(list);
  };

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-2xs select-none">
      {/* Panel Top Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/50 p-1.5 gap-1 shrink-0">
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'colors'
              ? 'bg-white text-blue-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Colors"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Colors</span>
        </button>

        <button
          onClick={() => setActiveTab('typography')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'typography'
              ? 'bg-white text-blue-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Typography"
        >
          <Type className="w-3.5 h-3.5" />
          <span>Fonts</span>
        </button>

        <button
          onClick={() => setActiveTab('layout')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'layout'
              ? 'bg-white text-blue-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Layout & Spacing"
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Layout</span>
        </button>

        <button
          onClick={() => setActiveTab('motion')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'motion'
              ? 'bg-white text-blue-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Motion & Online Animation"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Motion</span>
        </button>
      </div>

      {/* Panel Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* TAB 1: COLORS */}
        {activeTab === 'colors' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">Preset Color Palettes</h4>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_PALETTES.map((p) => {
                  const isSelected = designConfig.primaryColor === p.primary;
                  return (
                    <button
                      key={p.name}
                      onClick={() => handlePaletteSelect(p)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.primary }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.accent }} />
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.heading }} />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-800 block truncate">
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">Custom Colors</h4>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  Primary Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={designConfig.primaryColor}
                    onChange={(e) => updateDesignConfig({ primaryColor: e.target.value })}
                    className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={designConfig.primaryColor}
                    onChange={(e) => updateDesignConfig({ primaryColor: e.target.value })}
                    className="flex-1 text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  Section Headings Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={designConfig.headingColor}
                    onChange={(e) => updateDesignConfig({ headingColor: e.target.value })}
                    className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={designConfig.headingColor}
                    onChange={(e) => updateDesignConfig({ headingColor: e.target.value })}
                    className="flex-1 text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={designConfig.backgroundColor}
                    onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                    className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={designConfig.backgroundColor}
                    onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                    className="flex-1 text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TYPOGRAPHY */}
        {activeTab === 'typography' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">Font Family</h4>
              <div className="space-y-1.5">
                {FONTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => updateDesignConfig({ fontFamily: f.id })}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      designConfig.fontFamily === f.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{f.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{f.sample}</div>
                    </div>
                    {designConfig.fontFamily === f.id && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">Font Sizing & Spacing</h4>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1.5">
                  Body Font Size
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {(['sm', 'md', 'lg'] as FontSizeType[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateDesignConfig({ fontSize: size })}
                      className={`py-1 text-xs rounded-lg font-medium transition-all ${
                        designConfig.fontSize === size
                          ? 'bg-white text-blue-700 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {size === 'sm' ? 'Compact' : size === 'md' ? 'Default' : 'Large'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1.5">
                  Line Height
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {(['tight', 'normal', 'relaxed'] as LineHeightType[]).map((lh) => (
                    <button
                      key={lh}
                      onClick={() => updateDesignConfig({ lineHeight: lh })}
                      className={`py-1 text-xs rounded-lg font-medium capitalize transition-all ${
                        designConfig.lineHeight === lh
                          ? 'bg-white text-blue-700 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lh}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LAYOUT & SPACING */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-1.5">Page Margins</h4>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                {(['compact', 'normal', 'generous'] as MarginType[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => updateDesignConfig({ margins: m })}
                    className={`py-1 text-xs rounded-lg font-medium capitalize transition-all ${
                      designConfig.margins === m
                        ? 'bg-white text-blue-700 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-1.5">Profile Photo Shape</h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { shape: 'rounded', label: 'Rounded' },
                  { shape: 'circle', label: 'Circle' },
                  { shape: 'square', label: 'Square' },
                ].map(({ shape, label }) => (
                  <button
                    key={shape}
                    onClick={() => updateDesignConfig({ photoShape: shape as any })}
                    className={`py-2 px-1 text-xs rounded-xl border text-center font-medium transition-all ${
                      designConfig.photoShape === shape
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h4 className="text-xs font-bold text-slate-900 mb-1">Section Order & Visibility</h4>
              <p className="text-[10px] text-slate-400 mb-2.5">
                Reorder or toggle sections in the resume
              </p>

              <div className="space-y-1.5">
                {designConfig.sectionOrder.map((sec, index) => {
                  const isHidden = designConfig.hiddenSections.includes(sec);
                  return (
                    <div
                      key={sec}
                      className="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      <span className={`capitalize font-medium ${isHidden ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {sec}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveSection(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveSection(index, 'down')}
                          disabled={index === designConfig.sectionOrder.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleSectionVisibility(sec)}
                          className="p-1 text-slate-400 hover:text-blue-600"
                          title={isHidden ? 'Show section' : 'Hide section'}
                        >
                          {isHidden ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MOTION & ONLINE ANIMATION */}
        {activeTab === 'motion' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold block mb-1">🎬 Online Motion Preview:</span>
              Bring your online web resume to life with subtle CSS entrance animations! When exporting to PDF, animations are automatically removed to guarantee clean, static ATS compliance.
            </div>

            {/* Toggle Enable */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-900">Enable Motion Effects</span>
              <button
                onClick={() =>
                  updateAnimationConfig({ enabled: !animationConfig.enabled })
                }
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  animationConfig.enabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform transform shadow-xs ${
                    animationConfig.enabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Replay Button */}
            <button
              onClick={triggerPreviewAnimation}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>▶ Play Animation in Preview</span>
            </button>

            {/* Text Entrance Animation */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                Text Entrance Animation
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'fadeIn', label: 'Fade In' },
                  { id: 'slideUp', label: 'Slide Up' },
                  { id: 'slideLeft', label: 'Slide Left' },
                  { id: 'slideRight', label: 'Slide Right' },
                  { id: 'scaleIn', label: 'Scale In' },
                  { id: 'none', label: 'None' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      updateAnimationConfig({
                        textAnimation: item.id as TextAnimationType,
                        enabled: true,
                      })
                    }
                    className={`py-2 px-2 text-xs rounded-xl border text-center font-medium transition-all ${
                      animationConfig.textAnimation === item.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Animation */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                Profile Photo Animation
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'float', label: 'Float' },
                  { id: 'scale', label: 'Scale' },
                  { id: 'fade', label: 'Fade' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      updateAnimationConfig({
                        photoAnimation: item.id as PhotoAnimationType,
                        enabled: true,
                      })
                    }
                    className={`py-1.5 text-xs rounded-xl border text-center font-medium transition-all ${
                      animationConfig.photoAnimation === item.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Animation Speed</span>
                <span className="text-blue-600 font-mono">{animationConfig.duration}s</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="1.5"
                step="0.1"
                value={animationConfig.duration}
                onChange={(e) =>
                  updateAnimationConfig({ duration: parseFloat(e.target.value) })
                }
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
