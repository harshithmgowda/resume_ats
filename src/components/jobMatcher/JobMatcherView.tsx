import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { matchJobDescription, JobMatchResult } from '../../utils/atsAnalyzer';

const SAMPLE_JOBS = [
  {
    title: 'Full-Stack Software Engineer (React / FastAPI / AWS)',
    company: 'TechCorp Enterprise',
    description: `We are looking for a Software Engineer to architect full-stack applications.
Requirements:
- Strong programming experience in Python, TypeScript, and modern JavaScript.
- Hands-on experience building frontend web applications with React and Tailwind CSS.
- Proven track record designing RESTful APIs and asynchronous backends using FastAPI or Node.js.
- Familiarity with Docker, Kubernetes, AWS, Redis caching, and PostgreSQL databases.
- Experience with CI/CD deployment pipelines and Git collaboration.`,
  },
  {
    title: 'AI / Machine Learning Engineer (PyTorch / NLP)',
    company: 'Neural Innovations AI',
    description: `Seeking an AI/ML Engineer passionate about building scalable model inference pipelines.
Key Qualifications:
- Proficiency in Python, PyTorch, TensorFlow, and deep learning architectures.
- Experience with FastAPI microservices, Docker containerization, and vector databases (FAISS, Chroma).
- Familiarity with natural language processing, embeddings, OpenCV, and LLM fine-tuning.
- Strong mathematical foundation in Linear Algebra, Probability, and Algorithms.`,
  },
];

export const JobMatcherView: React.FC = () => {
  const { currentResume, addSkill, setActiveView } = useResume();
  const [jobText, setJobText] = useState(SAMPLE_JOBS[0].description);
  const [matchResult, setMatchResult] = useState<JobMatchResult>(() =>
    matchJobDescription(currentResume, SAMPLE_JOBS[0].description)
  );
  const [addedSkills, setAddedSkills] = useState<string[]>([]);

  const handleAnalyze = () => {
    const res = matchJobDescription(currentResume, jobText);
    setMatchResult(res);
  };

  const handleAddMissingSkill = (skill: string) => {
    addSkill({
      name: skill,
      category: 'Cloud',
      level: 4,
    });
    setAddedSkills((prev) => [...prev, skill]);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-7 max-w-5xl mx-auto w-full select-none">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
            Job Targeting & Keyword Match
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Match Resume to Job Description
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Paste the target job requirements to detect matching keywords and fill critical skill gaps.
        </p>
      </div>

      {/* Input & Quick Samples */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900">Target Job Description</label>
          {/* Quick preset chips */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Load Sample:</span>
            {SAMPLE_JOBS.map((j, i) => (
              <button
                key={i}
                onClick={() => {
                  setJobText(j.description);
                  setMatchResult(matchJobDescription(currentResume, j.description));
                }}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {i === 0 ? 'Full-Stack' : 'AI/ML'}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={5}
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          placeholder="Paste job description requirements, qualifications, and responsibilities here..."
          className="w-full p-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-xs text-slate-800 leading-relaxed outline-none"
        />

        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Match Rate</span>
          </button>
        </div>
      </div>

      {/* Match Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Match Percentage Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between items-center text-center">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Compatibility Match
            </span>
            <div className="text-5xl font-extrabold text-blue-600 font-mono my-3">
              {matchResult.matchPercentage}%
            </div>
            <p className="text-xs font-semibold text-slate-800">
              {matchResult.matchPercentage >= 75 ? 'Strong Candidate Alignment' : 'Moderate Alignment'}
            </p>
          </div>

          <button
            onClick={() => setActiveView('editor')}
            className="mt-6 w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold transition-colors"
          >
            Apply to Resume
          </button>
        </div>

        {/* Matched Keywords */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Matched Keywords ({matchResult.matchedKeywords.length})</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Detected on your resume and matched with target posting:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {matchResult.matchedKeywords.map((kw, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
              >
                ✓ {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing / High-Priority Keywords */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <XCircle className="w-4 h-4 text-amber-500" />
            <span>Missing Keywords ({matchResult.missingKeywords.length})</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Click to add directly into your resume skillset:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {matchResult.missingKeywords.map((kw, i) => {
              const wasAdded = addedSkills.includes(kw);
              return (
                <button
                  key={i}
                  onClick={() => !wasAdded && handleAddMissingSkill(kw)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
                    wasAdded
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>{kw}</span>
                  {wasAdded && <span className="text-[10px] ml-0.5 font-bold">Added</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Suggested Improvements */}
      {matchResult.suggestedAdditions.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Tailoring Recommendations
          </h3>
          <div className="space-y-2">
            {matchResult.suggestedAdditions.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
