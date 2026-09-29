import React, { useMemo } from 'react';
import { ResumeData, DesignConfig, AnimationConfig } from '../../types/resume';

// 12 Templates
import { ModernBlueTemplate } from './ModernBlueTemplate';
import { MinimalBlackTemplate } from './MinimalBlackTemplate';
import { DeveloperDarkTemplate } from './DeveloperDarkTemplate';
import { ProfessionalNavyTemplate } from './ProfessionalNavyTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { CreativePurpleTemplate } from './CreativePurpleTemplate';
import { ATSSimpleTemplate } from './ATSSimpleTemplate';
import { FreshGraduateTemplate } from './FreshGraduateTemplate';
import { TwoColumnModernTemplate } from './TwoColumnModernTemplate';
import { ElegantGrayTemplate } from './ElegantGrayTemplate';
import { AIEngineerTemplate } from './AIEngineerTemplate';
import { AcademicCVTemplate } from './AcademicCVTemplate';

interface TemplateRendererProps {
  resume: ResumeData;
  design: DesignConfig;
  animation?: AnimationConfig;
  isPrintMode?: boolean;
  className?: string;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  resume,
  design,
  animation,
  isPrintMode = false,
  className = '',
}) => {
  // Font Family class/style
  const fontStyle = useMemo(() => {
    switch (design.fontFamily) {
      case 'Plus Jakarta Sans':
        return { fontFamily: "'Plus Jakarta Sans', sans-serif" };
      case 'Roboto':
        return { fontFamily: "'Roboto', sans-serif" };
      case 'Poppins':
        return { fontFamily: "'Poppins', sans-serif" };
      case 'Montserrat':
        return { fontFamily: "'Montserrat', sans-serif" };
      case 'Lato':
        return { fontFamily: "'Lato', sans-serif" };
      case 'Merriweather':
        return { fontFamily: "'Merriweather', serif" };
      case 'JetBrains Mono':
        return { fontFamily: "'JetBrains Mono', monospace" };
      case 'Inter':
      default:
        return { fontFamily: "'Inter', sans-serif" };
    }
  }, [design.fontFamily]);

  // Font size scale class
  const fontSizeClass = useMemo(() => {
    switch (design.fontSize) {
      case 'sm':
        return 'text-[92%]';
      case 'lg':
        return 'text-[106%]';
      case 'md':
      default:
        return 'text-[100%]';
    }
  }, [design.fontSize]);

  // Line height class
  const lineHeightClass = useMemo(() => {
    switch (design.lineHeight) {
      case 'tight':
        return 'leading-tight';
      case 'relaxed':
        return 'leading-relaxed';
      case 'normal':
      default:
        return 'leading-normal';
    }
  }, [design.lineHeight]);

  // Margins & section spacing
  const marginPaddingClass = useMemo(() => {
    switch (design.margins) {
      case 'compact':
        return 'p-6';
      case 'generous':
        return 'p-10';
      case 'normal':
      default:
        return 'p-8';
    }
  }, [design.margins]);

  // Motion animation classes (disabled in print mode)
  const animClass = useMemo(() => {
    if (isPrintMode || !animation?.enabled) return '';
    switch (animation.textAnimation) {
      case 'slideUp':
        return 'anim-slideUp';
      case 'slideLeft':
        return 'anim-slideLeft';
      case 'slideRight':
        return 'anim-slideRight';
      case 'scaleIn':
        return 'anim-scaleIn';
      case 'fadeIn':
      default:
        return 'anim-fadeIn';
    }
  }, [isPrintMode, animation]);

  const photoAnimClass = useMemo(() => {
    if (isPrintMode || !animation?.enabled) return '';
    switch (animation.photoAnimation) {
      case 'scale':
        return 'anim-scaleIn';
      case 'float':
        return 'anim-float';
      case 'fade':
      default:
        return 'anim-fadeIn';
    }
  }, [isPrintMode, animation]);

  // Render chosen template
  const renderTemplateContent = () => {
    switch (design.templateId) {
      case 'minimal-black':
        return <MinimalBlackTemplate resume={resume} design={design} animClass={animClass} photoAnimClass={photoAnimClass} />;
      case 'developer-dark':
        return <DeveloperDarkTemplate resume={resume} design={design} animClass={animClass} photoAnimClass={photoAnimClass} />;
      case 'professional-navy':
        return <ProfessionalNavyTemplate resume={resume} design={design} animClass={animClass} photoAnimClass={photoAnimClass} />;
      case 'executive':
        return <ExecutiveTemplate resume={resume} design={design} animClass={animClass} photoAnimClass={photoAnimClass} />;
      case 'creative-purple':
        return <CreativePurpleTemplate resume={resume} design={design} animClass={animClass} photoAnimClass={photoAnimClass} />;
      case 'ats-simple':
        return <ATSSimpleTemplate resume={resume} design={design} animClass={animClass} photoAnimClass={photoAnimClass} />;
      case 'fresh-graduate':
        return <FreshGraduateTemplate resume={resume} design={design} animClass={animClass} photoAnimClass={photoAnimClass} />;
      case 'two-column-modern':
        return <TwoColumnModernTemplate resume={resume} design={design} animClass={animClass} photoAnimClass={photoAnimClass} />;
      case 'elegant-gray':
        return <ElegantGrayTemplate resume={resume} design={design} animClass={animClass} photoAnimClass={photoAnimClass} />;
      case 'ai-engineer':
        return <AIEngineerTemplate resume={resume} design={design} animClass={animClass} photoAnimClass={photoAnimClass} />;
      case 'academic-cv':
        return <AcademicCVTemplate resume={resume} design={design} animClass={animClass} photoAnimClass={photoAnimClass} />;
      case 'modern-blue':
      default:
        return <ModernBlueTemplate resume={resume} design={design} animClass={animClass} photoAnimClass={photoAnimClass} />;
    }
  };

  return (
    <div
      className={`resume-a4-page shadow-sheet text-slate-800 ${fontSizeClass} ${lineHeightClass} ${className}`}
      style={{
        ...fontStyle,
        ['--anim-duration' as any]: `${animation?.duration || 0.6}s`,
      }}
    >
      {renderTemplateContent()}
    </div>
  );
};
