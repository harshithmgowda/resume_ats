import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Palette,
  Sparkles,
  BarChart3,
  Star,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  ExternalLink,
  Layers,
  Home,
  CheckCircle,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { ActiveView } from '../../types/resume';

export const Sidebar: React.FC<{
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenImportModal: () => void;
}> = ({ isOpenMobile = false, onCloseMobile, onOpenImportModal }) => {
  const {
    activeView,
    setActiveView,
    resumes,
    activeResumeId,
    switchResume,
    createNewResume,
    currentResume,
    favorites,
  } = useResume();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showResumesDropdown, setShowResumesDropdown] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'editor', label: 'Resume Builder', icon: <Layers className="w-4 h-4" />, badge: 'Active' },
    { id: 'templates', label: 'Templates', icon: <Palette className="w-4 h-4" />, badge: '12' },
    { id: 'aiAssistant', label: 'AI Assistant', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { id: 'analyzer', label: 'Resume Analyzer', icon: <BarChart3 className="w-4 h-4" />, badge: '87%' },
    { id: 'publicView', label: 'Public Web Resume', icon: <ExternalLink className="w-4 h-4" /> },
    { id: 'landingPage', label: 'Product Tour', icon: <Home className="w-4 h-4" /> },
  ];

  return (
    <>
      <aside
        className={`bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 z-30 select-none ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isOpenMobile ? 'fixed inset-y-0 left-0 shadow-2xl flex' : 'hidden md:flex'
        }`}
      >
        {/* Top Header & Logo */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
            <button
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div>
                  <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                    Resume<span className="text-blue-600">Forge</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                    AI Studio & Market
                  </span>
                </div>
              )}
            </button>

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Create Button */}
          <div className="p-3">
            <button
              onClick={() => createNewResume()}
              className={`w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs rounded-xl py-2.5 transition-all shadow-sm flex items-center justify-center gap-2 ${
                isCollapsed ? 'px-0' : 'px-3'
              }`}
              title="Create New Resume"
            >
              <Plus className="w-4 h-4" />
              {!isCollapsed && <span>New Resume</span>}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-2 space-y-1 mt-1">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>{item.icon}</span>
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-blue-200/70 text-blue-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* My Resumes Quick List (when not collapsed) */}
          {!isCollapsed && (
            <div className="mt-5 px-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
                <span>My Resumes ({resumes.length})</span>
                <button
                  onClick={() => setShowResumesDropdown(!showResumesDropdown)}
                  className="text-blue-600 hover:underline capitalize text-[11px]"
                >
                  {showResumesDropdown ? 'Hide' : 'View'}
                </button>
              </div>

              {showResumesDropdown && (
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {resumes.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        switchResume(r.id);
                        setActiveView('editor');
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between truncate transition-colors ${
                        r.id === activeResumeId
                          ? 'bg-slate-100 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate flex-1">{r.name}</span>
                      {r.id === activeResumeId && (
                        <CheckCircle className="w-3 h-3 text-blue-600 shrink-0 ml-1.5" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom User Profile & Support */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {/* Help & Support Button */}
          <button
            onClick={() => setShowSupportModal(true)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Help & Support"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            {!isCollapsed && <span>Help & Guides</span>}
          </button>

          <div className="pt-2 px-1 text-center">
            {!isCollapsed && (
              <p className="text-[10px] text-slate-400 font-medium">
                ResumeForge • Free & Private
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Support / Quick Help Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-2">ResumeForge Support & Tips</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              ResumeForge allows you to build, customize, ATS-analyze, animate, and export professional resumes in seconds.
            </p>
            <div className="space-y-2 text-xs text-slate-700 mb-5">
              <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
                <span className="font-bold text-blue-900">💡 100% Vector PDF:</span> Use "Download PDF" for client-side document synthesis, or "Print Resume" to save with native browser print.
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100">
                <span className="font-bold text-amber-900">✨ AI Suggestions:</span> Use "Improve with AI" on any summary or bullet point to generate ATS-optimized phrasing.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900">🎨 Safe Template Switching:</span> You can change between all 12 templates anytime without losing any of your data!
              </div>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
