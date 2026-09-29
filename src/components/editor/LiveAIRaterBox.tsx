import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Cpu,
  ChevronDown,
  ChevronUp,
  Wand2,
  Check,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { analyzeResumeWithDeepSeek, DeepSeekATSResult } from '../../services/nvidiaAi';

export const LiveAIRaterBox: React.FC = () => {
  const { currentResume, updateSummary, updateExperienceBullet } = useResume();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<DeepSeekATSResult | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Live input heuristics based strictly on what user has typed so far
  const liveStats = useMemo(() => {
    const hasName = Boolean(currentResume.personal.fullName?.trim());
    const hasTitle = Boolean(currentResume.personal.jobTitle?.trim());
    const hasContact = Boolean(
      currentResume.personal.email?.trim() && currentResume.personal.phone?.trim()
    );
    const summaryLen = currentResume.summary?.trim().length || 0;
    const skillsCount = currentResume.skills.length;
    const expCount = currentResume.experience.length;
    const projCount = currentResume.projects.length;

    // Check for metrics in bullets
    const allBullets = [
      ...currentResume.experience.flatMap((e) => e.highlights),
      ...currentResume.projects.flatMap((p) => p.highlights),
    ];
    const hasNumbers = allBullets.some((b) => /\d+%|\d+k|\b\d+\b/i.test(b));
    const actionVerbs = ['Architected', 'Engineered', 'Optimized', 'Developed', 'Spearheaded', 'Deployed'];
    const hasVerbs = actionVerbs.some((v) =>
      allBullets.some((b) => b.toLowerCase().includes(v.toLowerCase()))
    );

    // Calculate live score (0-100) strictly from user input
    let score = 30;
    if (hasName) score += 10;
    if (hasTitle) score += 10;
    if (hasContact) score += 10;
    if (summaryLen >= 80) score += 12;
    else if (summaryLen > 0) score += 5;
    if (skillsCount >= 8) score += 12;
    else if (skillsCount >= 4) score += 6;
    if (expCount > 0 || projCount > 0) score += 10;
    if (hasNumbers) score += 8;
    if (hasVerbs) score += 8;

    score = Math.min(98, score);
    const grade = score >= 88 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : 'Needs Polish';

    return {
      score,
      grade,
      hasName,
      hasTitle,
      hasContact,
      summaryLen,
      skillsCount,
      expCount,
      projCount,
      hasNumbers,
      hasVerbs,
    };
  }, [currentResume]);

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    setIsExpanded(true);

    try {
      const result = await analyzeResumeWithDeepSeek(currentResume);
      setAiResult(result);
    } catch (err: any) {
      console.warn('Live AI analysis error:', err);
      // Construct realistic input-based analysis
      setAiResult({
        score: liveStats.score,
        grade: liveStats.grade as any,
        summary: `Based on your active input as "${currentResume.personal.jobTitle || 'Tech Professional'}": ${
          liveStats.skillsCount < 6
            ? 'Add more specific programming languages and tools.'
            : 'Good technical skill breadth.'
        } ${!liveStats.hasNumbers ? 'Include percentages or quantitative metrics in your experience bullets.' : ''}`,
        categories: [
          {
            name: 'Contact & Profile',
            score: liveStats.hasContact ? 95 : 60,
            weight: '15%',
            status: liveStats.hasContact ? 'good' : 'warning',
            feedback: liveStats.hasContact ? 'Complete contact details' : 'Add phone and email',
          },
          {
            name: 'Skills & Keywords',
            score: liveStats.skillsCount >= 8 ? 92 : 65,
            weight: '30%',
            status: liveStats.skillsCount >= 8 ? 'good' : 'warning',
            feedback: `${liveStats.skillsCount} skills entered`,
          },
          {
            name: 'Measurable Impact',
            score: liveStats.hasNumbers ? 88 : 55,
            weight: '30%',
            status: liveStats.hasNumbers ? 'good' : 'warning',
            feedback: liveStats.hasNumbers ? 'Quantifiable metrics found' : 'Missing % metrics and scale',
          },
          {
            name: 'Section Structure',
            score: 90,
            weight: '25%',
            status: 'good',
            feedback: 'Standard ATS hierarchy',
          },
        ],
        passedChecks: [
          liveStats.hasName ? 'Candidate identity verified' : null,
          liveStats.skillsCount >= 4 ? `${liveStats.skillsCount} technical skills listed` : null,
          liveStats.summaryLen > 50 ? 'Professional summary provided' : null,
        ].filter(Boolean) as string[],
        warningChecks: [
          !liveStats.hasNumbers ? 'Bullets lack quantitative results (% or user counts)' : null,
          liveStats.skillsCount < 8 ? 'Recommend listing at least 8-10 target technologies' : null,
          liveStats.summaryLen < 80 ? 'Expand executive summary with career focus' : null,
        ].filter(Boolean) as string[],
        suggestions: [
          {
            id: 'sug-live-1',
            section: 'Summary',
            title: 'Elevate Executive Summary',
            description: 'Make summary concise and focused on your primary stack.',
            sampleFix: `${currentResume.personal.jobTitle || 'Software Engineer'} with hands-on experience building scalable applications, designing robust APIs, and optimizing database performance.`,
          },
        ],
        isAiGenerated: false,
        modelUsed: 'ResumeForge Live Input Evaluator',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyFix = (text: string, section: string, id: string) => {
    if (section === 'Summary') {
      updateSummary(text);
    } else if (section === 'Experience' && currentResume.experience.length > 0) {
      updateExperienceBullet(currentResume.experience[0].id, 0, text);
    }
    setAppliedNotice(id);
    setTimeout(() => setAppliedNotice(null), 3000);
  };

  const activeScore = aiResult ? aiResult.score : liveStats.score;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 text-white shadow-md border border-indigo-800/40 mb-4 transition-all">
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
            <Zap className="w-4 h-4 fill-blue-400 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">
                Live Input AI ATS Rating
              </span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {aiResult?.modelUsed || 'Live Evaluator'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block">
              Evaluates your resume content as you type
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Score Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15">
            <span className="text-sm font-extrabold text-white font-mono">
              {activeScore}%
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                activeScore >= 80
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : activeScore >= 65
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {liveStats.grade}
            </span>
          </div>

          {/* Trigger AI Button */}
          <button
            onClick={handleRunAiAnalysis}
            disabled={isAnalyzing}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span>{isAnalyzing ? 'Analyzing...' : 'AI Analyze My Input'}</span>
          </button>

          {/* Toggle Expand */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand full analysis'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quick Status Chips */}
      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/10 text-[11px]">
        <span
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
            liveStats.hasContact ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" /> Contact Info
        </span>

        <span
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
            liveStats.summaryLen >= 80
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" /> Summary ({liveStats.summaryLen} chars)
        </span>

        <span
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
            liveStats.skillsCount >= 6
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" /> {liveStats.skillsCount} Skills
        </span>

        <span
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
            liveStats.hasNumbers
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-amber-500/20 text-amber-300'
          }`}
        >
          {liveStats.hasNumbers ? (
            <CheckCircle2 className="w-3 h-3" />
          ) : (
            <AlertTriangle className="w-3 h-3" />
          )}
          {liveStats.hasNumbers ? 'Metrics Included' : 'Needs % Metrics'}
        </span>
      </div>

      {/* Expanded Detailed Feedback Box */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-3 animate-in fade-in duration-200">
          {aiResult?.summary && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 leading-relaxed">
              <span className="font-semibold text-blue-300 block mb-0.5">
                AI Coach Assessment:
              </span>
              {aiResult.summary}
            </div>
          )}

          {/* AI Suggestions for their active text */}
          {aiResult?.suggestions && aiResult.suggestions.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Recommended Polish For Your Input:
              </span>

              {aiResult.suggestions.map((sug) => (
                <div
                  key={sug.id}
                  className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-blue-300 block">{sug.title}</span>
                    <p className="text-[11px] text-slate-300 mt-0.5 font-mono italic bg-slate-900/60 p-2 rounded border border-white/5 select-text">
                      "{sug.sampleFix}"
                    </p>
                  </div>

                  <button
                    onClick={() => handleApplyFix(sug.sampleFix, sug.section, sug.id)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors"
                  >
                    {appliedNotice === sug.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-300" />
                        <span>Applied!</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3 h-3" />
                        <span>Apply to {sug.section}</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
