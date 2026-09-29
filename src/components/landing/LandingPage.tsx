import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Download,
  CheckCircle2,
  Palette,
  Star,
  Layers,
  ChevronDown,
  HelpCircle,
  FileText,
  Briefcase,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { templatesList } from '../../data/templates';
import { TemplateRenderer } from '../templates/TemplateRenderer';

export const LandingPage: React.FC = () => {
  const { setActiveView, createNewResume, setTemplate, currentResume, designConfig } = useResume();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Will my resume pass Applicant Tracking Systems (ATS)?',
      a: 'Yes! Our ATS templates are strictly designed with clean typographic hierarchy, standard headings, and direct text extractability to guarantee high compatibility across Workday, Taleo, Greenhouse, and Lever.',
    },
    {
      q: 'Can I switch templates without losing my entered information?',
      a: 'Absolutely. ResumeForge uses a unified data schema across all 12 templates. You can switch between Modern Blue, Minimal Black, Developer Dark, or Fresh Graduate anytime without losing a single word.',
    },
    {
      q: 'How does the online motion / animated resume work?',
      a: 'When sharing your public web link, your resume displays subtle, modern CSS entrance motions. When exporting to PDF or printing, all animations are automatically stripped to guarantee a pristine, static vector document.',
    },
    {
      q: 'Can I download the resume as an editable file or PDF?',
      a: 'Yes, you can export a crisp 100% vector print-ready A4 PDF, high-resolution PNG, or structured text / DOCX format with zero watermarks.',
    },
  ];

  return (
    <div className="flex-1 bg-white overflow-y-auto select-none">
      {/* Top Banner Navigation */}
      <header className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            Resume<span className="text-blue-600">Forge</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              createNewResume();
              setActiveView('editor');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <span>Create My Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen AI Resume Builder & Template Marketplace</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Build a Resume That Gets <span className="text-blue-600 underline decoration-blue-200">Noticed</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mt-5 leading-relaxed">
          Create, customize, analyze, and download a professional resume in minutes. Powered by 12+ ATS-compliant templates and intelligent AI bullet optimization.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            onClick={() => {
              createNewResume();
              setActiveView('editor');
            }}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
          >
            <span>Create My Resume — Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveView('templates')}
            className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-sm font-bold transition-all"
          >
            Explore 12+ Templates
          </button>
        </div>

        {/* Live Hero Resume Preview Mockup */}
        <div className="mt-14 max-w-4xl mx-auto bg-slate-100/80 p-4 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl relative">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-2 font-mono text-[11px]">
                {typeof window !== 'undefined' ? window.location.host : 'resumeats-three.vercel.app'}/preview
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                {currentResume.atsScore && currentResume.atsScore > 0 ? `${currentResume.atsScore}% ATS Score` : 'Live ATS Scanner'}
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl shadow-sheet flex justify-center bg-white">
            <div className="transform scale-[0.8] origin-top my-[-50px]">
              <TemplateRenderer
                resume={currentResume}
                design={designConfig}
                animation={{ enabled: false, duration: 0.6, textAnimation: 'none', sectionAnimation: 'none', photoAnimation: 'none', delay: 0, trigger: 'onload' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why ResumeForge Feature Highlights */}
      <section className="py-16 bg-slate-50 border-y border-slate-200 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Modern Tech Job Hunting
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Everything you need to turn college coursework and engineering projects into high-paying offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">100% ATS Scannable</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tested against automated applicant parsing bots with standard headings, semantic hierarchy, and clean text layers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Bullet Point Enhancer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transform simple phrases like "worked on website" into impactful metrics like "architected responsive interfaces boosting speed by 35%".
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Zero Data Loss Switching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Switch seamlessly between 12 visual templates anytime without re-typing your education, skills, or projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Template Marketplace Teaser */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Template Gallery
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Templates Tailored to Every Role
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Curated layouts for students, developers, researchers, and executives.
            </p>
          </div>
          <button
            onClick={() => setActiveView('templates')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All 12 Templates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {templatesList.slice(0, 4).map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => {
                setTemplate(tpl.id);
                setActiveView('editor');
              }}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-card p-4 transition-all cursor-pointer group"
            >
              <div className="h-44 bg-slate-100 rounded-xl mb-3 flex items-center justify-center p-3 relative overflow-hidden group-hover:bg-blue-50/50 transition-colors">
                <div className="w-28 h-36 bg-white shadow-md rounded-xs p-2 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-1.5 rounded-full mb-1" style={{ backgroundColor: tpl.defaultColors.primary }} />
                    <div className="w-16 h-1 bg-slate-300 rounded-full mb-2" />
                    <div className="w-full h-0.5 bg-slate-100 my-1" />
                    <div className="space-y-1">
                      <div className="w-full h-1 bg-slate-200" />
                      <div className="w-4/5 h-1 bg-slate-200" />
                    </div>
                  </div>
                  <div className="w-12 h-1 bg-slate-300 rounded-full" />
                </div>
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {tpl.name}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{tpl.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / Free Tier Guarantee */}
      <section className="py-16 bg-slate-50 border-t border-slate-200 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Transparent Pricing
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            100% Free for Students & Builders
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Unlimited resume edits, all 12 ATS-tested templates, AI assistance previews, and high-res vector PDF downloads.
          </p>

          <div className="pt-6">
            <button
              onClick={() => {
                createNewResume();
                setActiveView('editor');
              }}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/25 transition-all"
            >
              Get Started Now — No Credit Card Needed
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white">ResumeForge</span>
            <span>— AI Resume Builder & Template Marketplace</span>
          </div>
          <div>Built with React, TypeScript, Tailwind CSS & Vite</div>
        </div>
      </footer>
    </div>
  );
};
