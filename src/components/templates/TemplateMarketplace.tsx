import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Star,
  Users,
  ShieldCheck,
  Heart,
  Eye,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { templatesList } from '../../data/templates';
import { TemplateDefinition } from '../../types/resume';
import { useResume } from '../../context/ResumeContext';

const CATEGORIES = [
  'All',
  'Students',
  'Freshers',
  'Software Engineer',
  'AI/ML',
  'Web Developer',
  'Backend Developer',
  'Business',
  'Academic',
  'Creative',
  'Minimal',
  'Executive',
];

export const TemplateMarketplace: React.FC<{
  onPreviewTemplate: (template: TemplateDefinition) => void;
}> = ({ onPreviewTemplate }) => {
  const { setTemplate, designConfig, setActiveView, favorites, toggleFavorite } = useResume();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [atsOnly, setAtsOnly] = useState(false);
  const [proFilter, setProFilter] = useState<'all' | 'free' | 'pro'>('all');

  const filteredTemplates = useMemo(() => {
    return templatesList.filter((tpl) => {
      // Search
      const matchesSearch =
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCat =
        selectedCategory === 'All' ||
        tpl.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Students' && ['Students', 'Freshers'].includes(tpl.category));

      // ATS
      const matchesAts = !atsOnly || tpl.atsFriendly;

      // Pro
      const matchesPro =
        proFilter === 'all' || (proFilter === 'free' ? !tpl.isPro : tpl.isPro);

      return matchesSearch && matchesCat && matchesAts && matchesPro;
    });
  }, [selectedCategory, searchQuery, atsOnly, proFilter]);

  const handleUseTemplate = (tplId: string) => {
    setTemplate(tplId);
    setActiveView('editor');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-7 max-w-7xl mx-auto w-full select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
            12+ Designer Themes
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Choose your perfect template
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            ATS-tested layouts built to pass recruiter screenings and highlight your achievements.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Filters Strip */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Toggles: ATS Friendly & Pro/Free */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={() => setAtsOnly(!atsOnly)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition-all ${
              atsOnly
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% ATS Friendly Only</span>
          </button>

          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5">
            <button
              onClick={() => setProFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium ${
                proFilter === 'all' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setProFilter('free')}
              className={`px-2.5 py-1 rounded-lg font-medium ${
                proFilter === 'free' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500'
              }`}
            >
              Free
            </button>
            <button
              onClick={() => setProFilter('pro')}
              className={`px-2.5 py-1 rounded-lg font-medium ${
                proFilter === 'pro' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500'
              }`}
            >
              PRO
            </button>
          </div>

          <span className="text-slate-400 text-xs ml-auto">
            Showing {filteredTemplates.length} templates
          </span>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => {
          const isFavorite = favorites.includes(tpl.id);
          const isCurrentActive = designConfig.templateId === tpl.id;

          return (
            <div
              key={tpl.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-card transition-all overflow-hidden flex flex-col group"
            >
              {/* Template Card Mockup Preview Header */}
              <div
                onClick={() => onPreviewTemplate(tpl)}
                className="h-52 bg-slate-100 relative p-4 flex items-center justify-center cursor-pointer overflow-hidden border-b border-slate-100 group-hover:bg-slate-200/60 transition-colors"
              >
                {/* Visual miniature template mockup */}
                <div className="w-40 h-56 bg-white shadow-lg rounded-xs p-3 transition-transform duration-300 group-hover:scale-105 flex flex-col justify-between">
                  <div>
                    {/* Header bar */}
                    <div
                      className="w-16 h-2 rounded-full mb-1"
                      style={{ backgroundColor: tpl.defaultColors.primary }}
                    />
                    <div className="w-24 h-1 bg-slate-300 rounded-full mb-2" />
                    <div
                      className="w-full h-0.5 my-1"
                      style={{ backgroundColor: `${tpl.defaultColors.primary}30` }}
                    />

                    {/* Fake lines */}
                    <div className="space-y-1.5 mt-2">
                      <div className="w-full h-1 bg-slate-200 rounded-xs" />
                      <div className="w-5/6 h-1 bg-slate-200 rounded-xs" />
                      <div className="w-4/6 h-1 bg-slate-200 rounded-xs" />
                    </div>

                    <div className="space-y-1 mt-3">
                      <div className="w-full h-1 bg-slate-200 rounded-xs" />
                      <div className="w-3/4 h-1 bg-slate-200 rounded-xs" />
                    </div>
                  </div>

                  <div className="flex gap-1 pt-2 border-t border-slate-100">
                    <div className="w-4 h-1 rounded-full bg-slate-300" />
                    <div className="w-6 h-1 rounded-full bg-slate-300" />
                    <div className="w-5 h-1 rounded-full bg-slate-300" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {tpl.isPro && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs">
                      PRO
                    </span>
                  )}
                  {tpl.badge && !tpl.isPro && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs">
                      {tpl.badge}
                    </span>
                  )}
                  {isCurrentActive && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                      Active
                    </span>
                  )}
                </div>

                {/* Favorite Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(tpl.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-white/80 hover:bg-white backdrop-blur-xs text-slate-400 hover:text-red-500 shadow-2xs transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-500'
                    }`}
                  />
                </button>
              </div>

              {/* Template Card Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {tpl.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-bold">{tpl.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-3">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {tpl.usageCount}
                    </span>
                    {tpl.atsFriendly && (
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ATS Friendly
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onPreviewTemplate(tpl)}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleUseTemplate(tpl.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
