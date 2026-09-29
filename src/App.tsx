import React, { useState } from 'react';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ResumeEditor } from './components/editor/ResumeEditor';
import { Dashboard } from './components/dashboard/Dashboard';
import { TemplateMarketplace } from './components/templates/TemplateMarketplace';
import { ATSAnalyzerView } from './components/analyzer/ATSAnalyzerView';
import { JobMatcherView } from './components/jobMatcher/JobMatcherView';
import { AIAssistantView } from './components/ai/AIAssistantView';
import { PublicResumeView } from './components/public/PublicResumeView';
import { LandingPage } from './components/landing/LandingPage';
import { ShareModal } from './components/modals/ShareModal';
import { ImportResumeModal } from './components/modals/ImportResumeModal';
import { ExportSuccessModal } from './components/modals/ExportSuccessModal';
import { TemplatePreviewModal } from './components/modals/TemplatePreviewModal';
import { TemplateDefinition } from './types/resume';

const MainAppContent: React.FC = () => {
  const { activeView } = useResume();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportSuccessOpen, setIsExportSuccessOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);

  // Standalone full views
  if (activeView === 'publicView') {
    return (
      <>
        <PublicResumeView onOpenShare={() => setIsShareOpen(true)} />
        <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      </>
    );
  }

  if (activeView === 'landingPage') {
    return <LandingPage />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc]">
      {/* Left Navigation Sidebar */}
      <Sidebar
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        onOpenImportModal={() => setIsImportOpen(true)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Navigation */}
        <Topbar
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onOpenShareModal={() => setIsShareOpen(true)}
          onOpenExportSuccess={() => setIsExportSuccessOpen(true)}
        />

        {/* View Router */}
        <main className="flex-1 flex overflow-hidden">
          {activeView === 'dashboard' && (
            <Dashboard
              onOpenImportModal={() => setIsImportOpen(true)}
              onOpenShareModal={() => setIsShareOpen(true)}
              onPreviewTemplate={(tplId) => {
                const tpl = (tplId as any)?.id ? (tplId as any) : null;
                setPreviewTemplate(tpl);
              }}
            />
          )}

          {activeView === 'editor' && <ResumeEditor />}

          {activeView === 'templates' && (
            <TemplateMarketplace
              onPreviewTemplate={(tpl) => setPreviewTemplate(tpl)}
            />
          )}

          {activeView === 'analyzer' && <ATSAnalyzerView />}

          {activeView === 'jobMatcher' && <JobMatcherView />}

          {activeView === 'aiAssistant' && <AIAssistantView />}
        </main>
      </div>

      {/* Global Modals */}
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />

      <ImportResumeModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />

      <ExportSuccessModal
        isOpen={isExportSuccessOpen}
        onClose={() => setIsExportSuccessOpen(false)}
        onOpenShare={() => setIsShareOpen(true)}
      />

      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </div>
  );
};

export function App() {
  return (
    <ResumeProvider>
      <MainAppContent />
    </ResumeProvider>
  );
}

export default App;
