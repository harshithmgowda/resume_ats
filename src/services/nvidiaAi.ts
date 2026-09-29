import { ResumeData } from '../types/resume';
import { ATSAnalysisResult } from '../utils/atsAnalyzer';

// NVIDIA NIM Base URL & DeepSeek V4.1 Flash Model
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL_NAME = 'deepseek-ai/deepseek-v4.1-flash';

// Get API Key from Vite env or fallback to provided key
export const getNvidiaApiKey = (): string => {
  return (
    (import.meta as any).env?.VITE_NVIDIA_API_KEY ||
    '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'
  );
};

export interface DeepSeekChatResponse {
  content: string;
  model: string;
  error?: string;
}

/**
 * Direct call to NVIDIA NIM OpenAI-compatible chat completions endpoint
 */
export async function callNvidiaDeepSeek(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: { temperature?: number; max_tokens?: number }
): Promise<string> {
  const apiKey = getNvidiaApiKey();

  const response = await fetch(NVIDIA_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages,
      temperature: options?.temperature ?? 0.2,
      max_tokens: options?.max_tokens ?? 2500,
      top_p: 0.95,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NVIDIA API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  return content;
}

export interface DeepSeekATSResult extends ATSAnalysisResult {
  isAiGenerated: boolean;
  modelUsed: string;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  atsReadabilityNotes?: string;
}

/**
 * Evaluates a resume using DeepSeek V4.1 Flash via NVIDIA NIM
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

  const rawResponse = await callNvidiaDeepSeek([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  // Clean and parse JSON response
  let cleaned = rawResponse.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```$/, '').trim();
  }

  const parsed = JSON.parse(cleaned);

  return {
    ...parsed,
    isAiGenerated: true,
    modelUsed: MODEL_NAME,
  };
}

/**
 * Ask DeepSeek to improve or rewrite a specific section
 */
export async function improveWithDeepSeek(
  actionType: string,
  inputText: string,
  context?: { role?: string; skills?: string[] }
): Promise<{ suggestedText: string; rationale: string }> {
  const prompt = `You are a career coach and professional technical resume writer.
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

  const responseText = await callNvidiaDeepSeek([
    { role: 'system', content: 'You are an expert resume optimization engine. Return valid JSON only.' },
    { role: 'user', content: prompt },
  ]);

  let cleaned = responseText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```$/, '').trim();
  }

  try {
    const parsed = JSON.parse(cleaned);
    return {
      suggestedText: parsed.suggestedText || inputText,
      rationale: parsed.rationale || 'Enhanced with DeepSeek AI for ATS performance.',
    };
  } catch {
    return {
      suggestedText: cleaned,
      rationale: 'Generated with DeepSeek V4.1 Flash via NVIDIA NIM.',
    };
  }
}
