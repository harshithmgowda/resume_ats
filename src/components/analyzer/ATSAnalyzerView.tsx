import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Wand2,
  Cpu,
  RefreshCw,
  Target,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { analyzeResumeATS } from '../../utils/atsAnalyzer';
import {
  analyzeResumeWithDeepSeek,
  DeepSeekATSResult,
} from '../../services/nvidiaAi';

export const ATSAnalyzerView: React.FC = () => {
  const { currentResume, updateSummary, updateExperienceBullet, setActiveView } = useResume();

  const [aiAnalysis, setAiAnalysis] = useState<DeepSeekATSResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [targetJobDesc, setTargetJobDesc] = useState('');
  const [showJobInput, setShowJobInput] = useState(false);
  const [appliedFixId, setAppliedFixId] = useState<string | null>(null);

  // Baseline heuristic analysis
  const baseAnalysis = useMemo(() => {
    return analyzeResumeATS(currentResume);
  }, [currentResume]);

  // Active display analysis (AI if run, else baseline)
  const activeAnalysis = aiAnalysis || {
    ...baseAnalysis,
    isAiGenerated: false,
    modelUsed: 'Heuristic Baseline Engine',
  };

  const handleRunAiAnalysis = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await analyzeResumeWithDeepSeek(
        currentResume,
        targetJobDesc.trim() ? targetJobDesc : undefined
      );
      setAiAnalysis(result);
    } catch (err: any) {
      console.error('DeepSeek AI analysis failed:', err);
      setErrorMessage(
        err.message || 'Could not connect to NVIDIA DeepSeek AI. Falling back to local scanner.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFix = (sampleFix: string, section: string, id: string) => {
    if (section === 'Summary') {
      updateSummary(sampleFix);
    } else if (section === 'Experience' && currentResume.experience.length > 0) {
      updateExperienceBullet(currentResume.experience[0].id, 0, sampleFix);
    }
    setAppliedFixId(id);
    setTimeout(() => setAppliedFixId(null), 3000);
  };

  // Circular gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (activeAnalysis.score / 100) * circumference;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-7 max-w-5xl mx-auto w-full select-none">
      {/* Title & Engine Badge */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              Applicant Tracking System Engine
            </span>

            {activeAnalysis.isAiGenerated && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                NVIDIA DeepSeek V4.1 Flash
              </span>
            )}
          </div>

          {/* AI Trigger Button */}
          <button
            onClick={handleRunAiAnalysis}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Scanning with DeepSeek AI...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>
                  {activeAnalysis.isAiGenerated
                    ? 'Re-Analyze with DeepSeek AI'
                    : 'Scan with NVIDIA DeepSeek AI'}
                </span>
              </>
            )}
          </button>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Resume ATS Compatibility Score
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Simulate enterprise scanners (Workday, Taleo, Greenhouse, Lever) using advanced AI keyword extraction and metric indexing.
        </p>
      </div>

      {/* Target Job Match Drawer Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <button
          onClick={() => setShowJobInput(!showJobInput)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Target Job Description Matching (Optional)
              </span>
              <span className="text-[11px] text-slate-500">
                Paste a specific job opening to calculate exact keyword match percentage with DeepSeek AI
              </span>
            </div>
          </div>
          <div className="text-slate-400">
            {showJobInput ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showJobInput && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/40 space-y-3">
            <textarea
              rows={4}
              value={targetJobDesc}
              onChange={(e) => setTargetJobDesc(e.target.value)}
              placeholder="Paste job title, responsibilities, and required qualifications from LinkedIn, Indeed, or company careers page..."
              className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed font-sans"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {targetJobDesc.length > 0 ? `${targetJobDesc.length} characters entered` : 'No job description pasted'}
              </span>
              <button
                onClick={handleRunAiAnalysis}
                disabled={isLoading || !targetJobDesc.trim()}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Match Resume Against Job</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error notification if any */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Notice:</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Main Score Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Circular SVG Score Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-100"
                strokeWidth="14"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={`transition-all duration-1000 ease-out ${
                  activeAnalysis.score >= 85
                    ? 'text-blue-600'
                    : activeAnalysis.score >= 70
                    ? 'text-indigo-600'
                    : 'text-amber-500'
                }`}
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {activeAnalysis.score}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Grade {activeAnalysis.grade} • Highly Scannable</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {activeAnalysis.score >= 85 ? 'Strong Interview Readiness' : 'Optimization Recommended'}
            </h3>
            <p className="text-xs text-slate-600 max-w-md mt-1 leading-relaxed">
              {activeAnalysis.summary}
            </p>
            <div className="text-[11px] text-slate-400 font-medium mt-2 flex items-center gap-1">
              <span>Engine:</span>
              <span className="text-slate-600 font-semibold">
                {activeAnalysis.isAiGenerated
                  ? 'NVIDIA NIM deepseek-ai/deepseek-v4.1-flash'
                  : 'Fast Rule-Based Scanner'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveView('editor')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all shrink-0"
        >
          <span>Open Editor to Polish</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Keywords Cloud (if AI analysis ran) */}
      {(activeAnalysis.matchedKeywords || activeAnalysis.missingKeywords) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeAnalysis.matchedKeywords && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Detected Tech Keywords ({activeAnalysis.matchedKeywords.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeAnalysis.matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeAnalysis.missingKeywords && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 text-indigo-800 text-xs font-bold uppercase tracking-wider">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Recommended Keywords to Add ({activeAnalysis.missingKeywords.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeAnalysis.missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-xs font-semibold"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Breakdowns */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
          Pillar Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeAnalysis.categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">{cat.name}</span>
                <span className="font-mono font-semibold text-blue-600">{cat.score}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.score}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">{cat.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Passed & Warning Checks Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Passed checks */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Passed Verifications ({activeAnalysis.passedChecks.length})</span>
          </div>

          <div className="space-y-2">
            {activeAnalysis.passedChecks.map((check, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span>{check}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning checks */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Improvement Opportunities ({activeAnalysis.warningChecks.length})</span>
          </div>

          <div className="space-y-2">
            {activeAnalysis.warningChecks.map((warn, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <span className="text-amber-500 font-bold shrink-0">⚠</span>
                <span>{warn}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Fixes */}
      {activeAnalysis.suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
            Actionable AI Enhancements
          </h3>

          <div className="space-y-3">
            {activeAnalysis.suggestions.map((sug) => (
              <div
                key={sug.id}
                className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {sug.section}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{sug.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600">{sug.description}</p>
                  <p className="text-[11px] font-mono text-blue-900 mt-1 italic bg-white p-2.5 rounded-lg border border-blue-100 select-text">
                    "{sug.sampleFix}"
                  </p>
                </div>

                <button
                  onClick={() => handleApplyFix(sug.sampleFix, sug.section, sug.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 shadow-2xs flex items-center gap-1.5 transition-colors ${
                    appliedFixId === sug.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {appliedFixId === sug.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Applied!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Apply Auto-Fix</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engine Details / Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed text-center flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          <strong className="text-slate-700">AI Model:</strong> deepseek-ai/deepseek-v4.1-flash via NVIDIA NIM Endpoint.
        </span>
        <span className="text-slate-400">
          Evaluated against modern applicant tracking heuristics & recruiter ranking criteria.
        </span>
      </div>
    </div>
  );
};
