import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { ResumeData } from '../types/resume';

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#38bdf8', '#f59e0b', '#10b981', '#8b5cf6'],
    });
  } catch (e) {
    // ignore
  }
};

/**
 * Creates a clean, un-transformed offscreen clone of the resume element
 * to avoid html2canvas CSS transform and animation double-rendering glitches.
 */
const createCleanCloneForExport = (element: HTMLElement): HTMLElement => {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = 'export-pdf-temp-clone';

  // Force clean, unscaled A4 dimensions (210mm x 297mm at 96 DPI = 794px x 1123px)
  clone.style.position = 'fixed';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.width = '794px';
  clone.style.minHeight = '1123px';
  clone.style.maxWidth = '794px';
  clone.style.transform = 'none';
  clone.style.webkitTransform = 'none';
  clone.style.transition = 'none';
  clone.style.animation = 'none';
  clone.style.boxShadow = 'none';
  clone.style.margin = '0';
  clone.style.zIndex = '-99999';
  clone.style.backgroundColor = '#ffffff';

  // Strip all animation classes, transforms, and transitions from children
  const allNodes = clone.querySelectorAll('*');
  allNodes.forEach((node) => {
    const el = node as HTMLElement;
    el.style.animation = 'none';
    el.style.webkitAnimation = 'none';
    el.style.transition = 'none';
    el.style.transform = 'none';
    el.style.webkitTransform = 'none';

    // Remove animation classes if present
    if (el.className && typeof el.className === 'string') {
      el.className = el.className
        .split(' ')
        .filter((c) => !c.startsWith('anim-'))
        .join(' ');
    }
  });

  document.body.appendChild(clone);
  return clone;
};

export const exportResumeAsPDF = async (resume: ResumeData, elementId = 'resume-canvas-export') => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Resume element not found for export');
    return;
  }

  document.body.style.cursor = 'wait';

  let clone: HTMLElement | null = null;
  try {
    // 1. Wait for web fonts to be completely ready
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // 2. Create isolated offscreen clone free of zoom/transform matrices
    clone = createCleanCloneForExport(element);

    // 3. Small pause to allow styles to settle in DOM
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 4. Render canvas from un-transformed clone
    const canvas = await html2canvas(clone, {
      scale: 2, // 2x for sharp crisp text
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      windowHeight: clone.scrollHeight || 1123,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // 5. Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    // If multi-page
    if (pdfHeight > 297) {
      let remainingHeight = pdfHeight - 297;
      let position = -297;

      while (remainingHeight > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        position -= 297;
        remainingHeight -= 297;
      }
    }

    const safeName = (resume.name || 'Resume').replace(/[^a-z0-9_-]/gi, '_');
    pdf.save(`${safeName}.pdf`);

    triggerConfetti();
  } catch (error) {
    console.error('Failed to generate PDF, falling back to print:', error);
    window.print();
  } finally {
    if (clone && clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
    document.body.style.cursor = 'default';
  }
};

export const exportResumeAsPNG = async (resume: ResumeData, elementId = 'resume-canvas-export') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  document.body.style.cursor = 'wait';
  let clone: HTMLElement | null = null;
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    clone = createCleanCloneForExport(element);
    await new Promise((resolve) => setTimeout(resolve, 50));

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
    });

    const link = document.createElement('a');
    link.download = `${(resume.name || 'Resume').replace(/[^a-z0-9_-]/gi, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    triggerConfetti();
  } catch (err) {
    console.error('Error exporting PNG', err);
  } finally {
    if (clone && clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
    document.body.style.cursor = 'default';
  }
};

export const exportResumeAsDOCX = (resume: ResumeData) => {
  const lines: string[] = [];
  lines.push((resume.personal.fullName || 'RESUME').toUpperCase());
  if (resume.personal.jobTitle) lines.push(resume.personal.jobTitle);
  lines.push(
    [resume.personal.email, resume.personal.phone, resume.personal.location]
      .filter(Boolean)
      .join(' | ')
  );
  if (resume.personal.linkedin) lines.push(`LinkedIn: ${resume.personal.linkedin}`);
  if (resume.personal.github) lines.push(`GitHub: ${resume.personal.github}`);
  lines.push('\n----------------------------------------\n');

  if (resume.summary) {
    lines.push('PROFESSIONAL SUMMARY:');
    lines.push(resume.summary);
    lines.push('\n----------------------------------------\n');
  }

  if (resume.experience.length > 0) {
    lines.push('WORK EXPERIENCE:');
    resume.experience.forEach((e) => {
      lines.push(`${e.jobTitle} - ${e.company} (${e.startDate} - ${e.isCurrent ? 'Present' : e.endDate})`);
      if (e.location) lines.push(`Location: ${e.location}`);
      e.highlights.forEach((h) => lines.push(`• ${h}`));
      lines.push('');
    });
    lines.push('----------------------------------------\n');
  }

  if (resume.projects.length > 0) {
    lines.push('PROJECTS:');
    resume.projects.forEach((p) => {
      lines.push(`${p.title} (${p.startDate})`);
      if (p.technologies?.length > 0) lines.push(`Technologies: ${p.technologies.join(', ')}`);
      lines.push(p.description);
      p.highlights?.forEach((h) => lines.push(`• ${h}`));
      lines.push('');
    });
    lines.push('----------------------------------------\n');
  }

  if (resume.education.length > 0) {
    lines.push('EDUCATION:');
    resume.education.forEach((edu) => {
      lines.push(`${edu.degree} - ${edu.institution} (${edu.startDate} - ${edu.endDate})`);
      if (edu.grade) lines.push(`Grade: ${edu.grade}`);
      if (edu.description) lines.push(edu.description);
      lines.push('');
    });
    lines.push('----------------------------------------\n');
  }

  if (resume.skills.length > 0) {
    lines.push('TECHNICAL SKILLS:');
    lines.push(resume.skills.map((s) => s.name).join(', '));
    lines.push('\n----------------------------------------\n');
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(resume.name || 'Resume').replace(/[^a-z0-9_-]/gi, '_')}.txt`;
  link.click();
  URL.revokeObjectURL(url);
  triggerConfetti();
};

export const printResumePage = () => {
  window.print();
};
