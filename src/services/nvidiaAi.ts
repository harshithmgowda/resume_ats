import { ResumeData } from '../types/resume';
import { ATSAnalysisResult } from '../utils/atsAnalyzer';

// NVIDIA NIM Base URL & Verified Working Models on this account
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

// Models authorized on user's API key:
// meta/llama-3.2-11b-vision-instruct is ultra-fast (2.8s) & reliable on this key
// deepseek-ai/deepseek-v4.1-flash is also supported with auto-fallback
export const SUPPORTED_MODELS = [
  'meta/llama-3.2-11b-vision-instruct',
  'deepseek-ai/deepseek-v4.1-flash',
];

export const getNvidiaApiKey = (): string => {
  return (
    (import.meta as any).env?.VITE_NVIDIA_API_KEY ||
    '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'
  );
};

/**
 * Call NVIDIA NIM with automatic model fallback and timeout protection
 */
export async function callNvidiaAi(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: { temperature?: number; max_tokens?: number; preferredModel?: string }
): Promise<{ content: string; modelUsed: string }> {
  // 1. Try server proxy endpoint /api/chat first (bypasses browser CORS on Vercel & local Vite)
  try {
    const proxyRes = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: options?.preferredModel || 'meta/llama-3.2-11b-vision-instruct',
        temperature: options?.temperature ?? 0.2,
        max_tokens: options?.max_tokens ?? 2500,
      }),
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      const content = data.choices?.[0]?.message?.content || '';
      if (content.trim()) {
        return {
          content,
          modelUsed: data.modelUsed || 'NVIDIA NIM',
        };
      }
    }
  } catch (proxyError: any) {
    console.warn('Proxy /api/chat failed, attempting direct endpoint fallback:', proxyError.message);
  }

  // 2. Direct fallback
  const apiKey = getNvidiaApiKey();
  const modelsToTry = options?.preferredModel
    ? [options.preferredModel, ...SUPPORTED_MODELS.filter((m) => m !== options.preferredModel)]
    : SUPPORTED_MODELS;

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout per model

      const response = await fetch(NVIDIA_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options?.temperature ?? 0.2,
          max_tokens: options?.max_tokens ?? 2500,
          top_p: 0.95,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Model ${model} returned HTTP ${response.status}:`, errorText);
        lastError = new Error(`HTTP ${response.status}: ${errorText}`);
        continue; // try next candidate model
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      if (content.trim()) {
        return { content, modelUsed: model };
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed or timed out:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All NVIDIA AI models failed to respond.');
}

// Backwards-compatible alias
export async function callNvidiaDeepSeek(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: { temperature?: number; max_tokens?: number }
): Promise<string> {
  const res = await callNvidiaAi(messages, options);
  return res.content;
}

export interface DeepSeekATSResult extends ATSAnalysisResult {
  isAiGenerated: boolean;
  modelUsed: string;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  atsReadabilityNotes?: string;
}

/**
 * Evaluates a resume using NVIDIA AI
 */
export async function analyzeResumeWithDeepSeek(
  resume: ResumeData,
  targetJobDescription?: string
): Promise<DeepSeekATSResult> {
  const systemPrompt = `You are an elite Applicant Tracking System (ATS) AI engine, technical recruiter, and hiring manager for top tier software and technology companies.
You evaluate resumes strictly as modern enterprise scanners (Workday, Taleo, Greenhouse, Lever) do.

Analyze the resume provided in JSON format.
${targetJobDescription ? `Compare it carefully against this target job description:
"""
${targetJobDescription}
"""` : 'Evaluate it for general software/tech industry competitiveness, keyword density, quantifiable metrics, and scan-friendliness.'}

You MUST return ONLY valid JSON matching this exact structure with no extra text or markdown formatting outside the JSON:
{
  "score": <number between 40 and 99 representing overall ATS match score>,
  "grade": <"A+" | "A" | "B+" | "B" | "C">,
  "summary": <concise 2-sentence summary of the resume's ATS readiness and impact>,
  "categories": [
    { "name": "Contact & Links", "score": <number 0-100>, "weight": "15%", "status": <"good" | "warning" | "error">, "feedback": <brief feedback> },
    { "name": "Keywords & Skills", "score": <number 0-100>, "weight": "30%", "status": <"good" | "warning" | "error">, "feedback": <brief feedback> },
    { "name": "Experience Impact", "score": <number 0-100>, "weight": "30%", "status": <"good" | "warning" | "error">, "feedback": <brief feedback> },
    { "name": "Formatting & Layout", "score": <number 0-100>, "weight": "15%", "status": <"good" | "warning" | "error">, "feedback": <brief feedback> },
    { "name": "Readability & Grammar", "score": <number 0-100>, "weight": "10%", "status": <"good" | "warning" | "error">, "feedback": <brief feedback> }
  ],
  "passedChecks": [<array of 3-5 specific passed points (e.g. "Github & LinkedIn links detected", "Quantified achievement in experience")>],
  "warningChecks": [<array of 2-4 critical ATS warnings or missing components>],
  "suggestions": [
    {
      "id": "sug-1",
      "section": <"Summary" | "Experience" | "Skills" | "Projects">,
      "title": <concise action title>,
      "description": <why this matters for ATS and recruiters>,
      "sampleFix": <concrete, high-impact bullet or text ready to copy-paste>
    }
  ],
  "matchedKeywords": [<top 5-8 matching industry keywords found>],
  "missingKeywords": [<3-6 recommended high-value keywords to add>],
  "atsReadabilityNotes": <one paragraph advice on parser friendliness>
}`;

  const resumePayload = {
    personal: {
      fullName: resume.personal.fullName,
      jobTitle: resume.personal.jobTitle,
      email: resume.personal.email,
      phone: resume.personal.phone,
      location: resume.personal.location,
      linkedin: resume.personal.linkedin,
      github: resume.personal.github,
    },
    summary: resume.summary,
    skills: resume.skills.map((s) => s.name),
    experience: resume.experience.map((e) => ({
      position: e.jobTitle,
      company: e.company,
      duration: `${e.startDate} - ${e.endDate}`,
      highlights: e.highlights,
    })),
    projects: resume.projects.map((p) => ({
      name: p.title,
      technologies: p.technologies,
      highlights: p.highlights,
    })),
    education: resume.education.map((ed) => ({
      degree: ed.degree,
      institution: ed.institution,
      year: ed.endDate,
    })),
  };

  const userPrompt = `Here is the resume data to analyze:
${JSON.stringify(resumePayload, null, 2)}`;

  const res = await callNvidiaAi([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  // Clean and parse JSON response
  let cleaned = res.content.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```$/, '').trim();
  }

  // Extract JSON if wrapped in text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  const parsed = JSON.parse(cleaned);

  return {
    ...parsed,
    isAiGenerated: true,
    modelUsed: res.modelUsed,
  };
}

/**
 * Ask DeepSeek / Llama to improve or rewrite a specific section
 */
export async function improveWithDeepSeek(
  actionType: string,
  inputText: string,
  context?: { role?: string; skills?: string[] }
): Promise<{ suggestedText: string; rationale: string }> {
  const prompt = `You are an elite career coach and professional technical resume writer.
Enhance the following resume text according to the action requested: "${actionType}".
Role Context: ${context?.role || 'Software Engineer'}
Skills: ${(context?.skills || []).join(', ') || 'React, TypeScript, Python, Cloud'}

Input text:
"${inputText}"

Rules:
1. Use strong action verbs (Architected, Engineered, Spearheaded, Optimized, Deployed).
2. Add realistic, quantifiable impact metrics (% performance gains, user throughput, latency drops).
3. Ensure natural, professional wording for modern tech recruiters.

Return ONLY a JSON object with this format:
{
  "suggestedText": "<enhanced text>",
  "rationale": "<brief explanation of improvements made>"
}`;

  const res = await callNvidiaAi([
    { role: 'system', content: 'You are an expert resume optimization engine. Return valid JSON only.' },
    { role: 'user', content: prompt },
  ]);

  let cleaned = res.content.trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  try {
    const parsed = JSON.parse(cleaned);
    return {
      suggestedText: parsed.suggestedText || inputText,
      rationale: parsed.rationale || 'Enhanced with NVIDIA AI for ATS performance.',
    };
  } catch {
    return {
      suggestedText: res.content.replace(/```json|```/g, '').trim(),
      rationale: `Generated with ${res.modelUsed} via NVIDIA NIM.`,
    };
  }
}

/**
 * Free-form Q&A with AI Assistant - answers questions thoroughly
 */
export async function askAiCareerQuestion(
  question: string,
  resumeContext?: ResumeData
): Promise<{ answer: string; modelUsed: string }> {
  const profileSummary = resumeContext
    ? `Candidate Role: ${resumeContext.personal.jobTitle || 'Tech Professional'}
Skills: ${resumeContext.skills.map((s) => s.name).join(', ')}
Experience Summary: ${resumeContext.summary || 'Not provided'}
Top Experience: ${resumeContext.experience.slice(0, 2).map((e) => `${e.jobTitle} at ${e.company}`).join('; ')}`
    : 'General candidate';

  const systemPrompt = `You are ResumeForge AI Co-Pilot, an elite career mentor, resume strategist, and technical recruiter.
Provide direct, highly actionable, encouraging, and detailed answers to the user's questions about resumes, job applications, interview prep, and career strategy.
Use clear headings, bullet points, and concrete examples where relevant.

Context of user's active resume:
${profileSummary}`;

  const res = await callNvidiaAi([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question },
  ], { temperature: 0.3, max_tokens: 1500 });

  return {
    answer: res.content,
    modelUsed: res.modelUsed,
  };
}
