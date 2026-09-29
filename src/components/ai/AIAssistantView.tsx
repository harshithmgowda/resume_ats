import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  X,
  Wand2,
  FileText,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  Send,
  Cpu,
  Copy,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { AIHelper, AISuggestion } from '../../utils/aiAssistant';
import { improveWithDeepSeek, askAiCareerQuestion } from '../../services/nvidiaAi';

export const AIAssistantView: React.FC = () => {
  const { currentResume, updateSummary, updateExperienceBullet, setActiveView } = useResume();
  const [activeSuggestion, setActiveSuggestion] = useState<AISuggestion | null>(null);
  const [activeChatAnswer, setActiveChatAnswer] = useState<{
    question: string;
    answer: string;
    modelUsed: string;
  } | null>(null);
  const [appliedNotice, setAppliedNotice] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleAction = async (actionKey: string) => {
    setAppliedNotice(false);
    setActiveChatAnswer(null);
    setIsGenerating(true);

    try {
      let type: 'summary' | 'bullet' | 'rewrite' = 'summary';
      let original = currentResume.summary || 'Aspiring Software Engineer';

      if (actionKey === 'experience' || actionKey === 'verb') {
        type = 'bullet';
        original = currentResume.experience[0]?.highlights[0] || 'Worked on software development';
      }

      // Call NVIDIA AI
      const context = {
        role: currentResume.personal.jobTitle || 'Software Engineer',
        skills: currentResume.skills.map((s) => s.name),
      };

      const result = await improveWithDeepSeek(actionKey, original, context);

      setActiveSuggestion({
        id: 'sug-' + Date.now(),
        type,
        originalText: original,
        suggestedText: result.suggestedText,
        rationale: result.rationale,
      });
    } catch (err) {
      console.warn('AI call failed, using heuristic helper:', err);
      let fallback: AISuggestion;
      switch (actionKey) {
        case 'summary':
          fallback = AIHelper.improveSummary(currentResume.summary);
          break;
        case 'ats':
          fallback = AIHelper.makeAtsFriendly(currentResume.summary);
          break;
        case 'concise':
          fallback = AIHelper.makeConcise(currentResume.summary);
          break;
        case 'profile':
          fallback = AIHelper.generateSummaryFromProfile(currentResume);
          break;
        case 'experience':
          const b = currentResume.experience[0]?.highlights[0] || 'Worked on software development';
          fallback = AIHelper.improveBullet(b);
          break;
        case 'verb':
          const eb = currentResume.experience[0]?.highlights[0] || 'Worked on system features';
          fallback = AIHelper.addActionVerb(eb);
          break;
        default:
          fallback = AIHelper.improveSummary(currentResume.summary);
      }
      setActiveSuggestion(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomPromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setActiveSuggestion(null);
    setAppliedNotice(false);
    setCopiedNotice(false);

    const questionAsked = customPrompt.trim();

    try {
      const result = await askAiCareerQuestion(questionAsked, currentResume);
      setActiveChatAnswer({
        question: questionAsked,
        answer: result.answer,
        modelUsed: result.modelUsed,
      });
      setCustomPrompt('');
    } catch (err: any) {
      console.error('Custom prompt error:', err);
      setActiveChatAnswer({
        question: questionAsked,
        answer:
          'To optimize your resume for technical recruiters:\n\n' +
          '• Lead each bullet with high-impact action verbs (Architected, Engineered, Streamlined, Spearheaded).\n' +
          '• Quantify your results (% latency reductions, scale of requests, performance benchmarks).\n' +
          '• Align your technical skills section directly with target job postings (Languages, Frameworks, Cloud & Databases).\n' +
          '• Keep the layout clean, single or two-column, and free of complex tables for 100% ATS readability.',
        modelUsed: 'ResumeForge Co-Pilot Engine',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!activeSuggestion) return;
    if (activeSuggestion.type === 'summary' || activeSuggestion.type === 'rewrite') {
      updateSummary(activeSuggestion.suggestedText);
    } else if (activeSuggestion.type === 'bullet' && currentResume.experience.length > 0) {
      updateExperienceBullet(currentResume.experience[0].id, 0, activeSuggestion.suggestedText);
    }
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 2500);
  };

  const handleCopyAnswer = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-7 max-w-5xl mx-auto w-full select-none">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              AI Co-Pilot Studio
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Cpu className="w-3 h-3 text-blue-600" />
              NVIDIA NIM AI Engine
            </span>
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          ✨ Resume AI Assistant
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Ask any question about your resume, generate impactful summaries, or get tailored recruiter tips powered by NVIDIA NIM.
        </p>
      </div>

      {/* Custom AI Prompt Input */}
      <form
        onSubmit={handleCustomPromptSubmit}
        className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-2.5"
      >
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Wand2 className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Ask AI anything: e.g., 'How to stand out for FAANG?', 'Write 3 bullets for my Python project', 'Critique my skills'..."
          className="flex-1 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
        />
        <button
          type="submit"
          disabled={!customPrompt.trim() || isGenerating}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
        >
          {isGenerating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          <span>Ask AI</span>
        </button>
      </form>

      {/* Preset Action Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
        {[
          { key: 'summary', title: 'Enhance Summary', desc: 'Inject power keywords and career vision', icon: <FileText className="w-4 h-4 text-blue-600" /> },
          { key: 'profile', title: 'Synthesize From Profile', desc: 'Craft summary from your skills & projects', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
          { key: 'experience', title: 'Elevate Experience Bullets', desc: 'Add quantifiable metrics and results', icon: <Briefcase className="w-4 h-4 text-emerald-600" /> },
          { key: 'verb', title: 'Insert Action Verbs', desc: 'Replace passive phrases with power words', icon: <Zap className="w-4 h-4 text-indigo-600" /> },
          { key: 'ats', title: 'ATS Optimize Phrasing', desc: 'Align vocabulary with recruiter bots', icon: <ShieldCheck className="w-4 h-4 text-purple-600" /> },
          { key: 'concise', title: 'Make Crisp & Concise', desc: 'Remove fluff and tighten sentence lengths', icon: <Wand2 className="w-4 h-4 text-rose-600" /> },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => handleAction(item.key)}
            disabled={isGenerating}
            className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-card text-left transition-all group disabled:opacity-60"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Loading indicator */}
      {isGenerating && (
        <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
          <span className="text-xs font-semibold text-blue-900">
            Querying NVIDIA AI Engine... Generating intelligent answer...
          </span>
        </div>
      )}

      {/* Dedicated Q&A Chat Answer Card */}
      {activeChatAnswer && !isGenerating && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200 shadow-card space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900">
                Q: {activeChatAnswer.question}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
              {activeChatAnswer.modelUsed}
            </span>
          </div>

          <div className="text-xs text-slate-800 leading-relaxed space-y-3 whitespace-pre-wrap select-text bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            {activeChatAnswer.answer}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveChatAnswer(null)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Close Answer
            </button>

            <button
              onClick={() => handleCopyAnswer(activeChatAnswer.answer)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>Copy Answer</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Preset Action Suggestion Review Card */}
      {activeSuggestion && !isGenerating && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200 shadow-card space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                AI Recommendation
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              NVIDIA NIM Engine
            </span>
          </div>

          <div className="space-y-4">
            {activeSuggestion.originalText && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Original Reference Text
                </span>
                <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                  "{activeSuggestion.originalText}"
                </p>
              </div>
            )}

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                Optimized Result
              </span>
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 text-xs text-slate-800 leading-relaxed font-medium select-text">
                {activeSuggestion.suggestedText}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Recruiter Impact Rationale
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">{activeSuggestion.rationale}</p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveSuggestion(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors w-full sm:w-auto"
            >
              Dismiss
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleApply}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {appliedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Applied to Resume!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Apply to Active Resume</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveView('editor')}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="View in resume editor"
              >
                <span>Go to Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
