import { ResumeData } from '../types/resume';
import { ATSAnalysisResult } from '../utils/atsAnalyzer';

// NVIDIA NIM – only meta/llama-3.2-11b-vision-instruct is verified active on this API key
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const ACTIVE_MODEL = 'meta/llama-3.2-11b-vision-instruct';

export const SUPPORTED_MODELS = [ACTIVE_MODEL];

export const getNvidiaApiKey = (): string => {
  return (
    (import.meta as any).env?.VITE_NVIDIA_API_KEY ||
    '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'
  );
};

/**
 * Core NVIDIA NIM caller — proxy first, direct fallback with retry
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
        model: ACTIVE_MODEL,
        temperature: options?.temperature ?? 0.4,
        max_tokens: options?.max_tokens ?? 4000,
      }),
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      const content = data.choices?.[0]?.message?.content || '';
      if (content.trim()) {
        return {
          content,
          modelUsed: data.modelUsed || ACTIVE_MODEL,
        };
      }
    }
  } catch (proxyError: any) {
    console.warn('Proxy /api/chat failed, attempting direct endpoint fallback:', proxyError.message);
  }

  // 2. Direct fallback with retry logic
  const apiKey = getNvidiaApiKey();

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(NVIDIA_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: ACTIVE_MODEL,
          messages,
          temperature: options?.temperature ?? 0.4,
          max_tokens: options?.max_tokens ?? 4000,
          top_p: 0.9,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`NVIDIA API attempt ${attempt + 1} returned HTTP ${response.status}:`, errorText);
        if (response.status >= 500 && attempt === 0) {
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      if (content.trim()) {
        return { content, modelUsed: ACTIVE_MODEL };
      }
    } catch (err: any) {
      console.warn(`NVIDIA API attempt ${attempt + 1} failed:`, err.message);
      if (attempt === 1) throw err;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  throw new Error('NVIDIA AI failed to respond after retries.');
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
  const isResumeEmpty =
    !resume.personal?.fullName?.trim() &&
    !resume.summary?.trim() &&
    (resume.experience?.length || 0) === 0 &&
    (resume.projects?.length || 0) === 0 &&
    (resume.skills?.length || 0) === 0;

  if (isResumeEmpty) {
    return {
      score: 0,
      grade: 'Unrated',
      summary:
        'Your resume is currently blank. Start adding your contact information, summary, skills, and work experience to calculate your live ATS compatibility score.',
      categories: [
        {
          name: 'Contact & Links',
          score: 0,
          weight: '20%',
          status: 'error',
          feedback: 'No contact information provided yet.',
        },
        {
          name: 'Keywords & Skills',
          score: 0,
          weight: '25%',
          status: 'error',
          feedback: 'No technical skills or keywords detected.',
        },
        {
          name: 'Experience Impact',
          score: 0,
          weight: '30%',
          status: 'error',
          feedback: 'No work experience or projects added.',
        },
        {
          name: 'Professional Summary',
          score: 0,
          weight: '15%',
          status: 'error',
          feedback: 'No executive summary provided.',
        },
        {
          name: 'Education & Credentials',
          score: 0,
          weight: '10%',
          status: 'warning',
          feedback: 'No education credentials listed.',
        },
      ],
      passedChecks: [],
      warningChecks: [
        'Add your full name, email, and phone number',
        'List target technical skills and frameworks',
        'Add work experience or projects with quantifiable achievements',
        'Write a concise 2-3 sentence professional summary',
      ],
      suggestions: [
        {
          id: 'sug-empty-1',
          section: 'Summary',
          title: 'Add Executive Summary',
          description: 'A 2-3 sentence overview gives ATS and recruiters context on your engineering level.',
          sampleFix: 'Software Engineer specializing in modern web architecture, frontend performance, and scalable cloud APIs.',
        },
      ],
      isAiGenerated: false,
      modelUsed: 'ResumeForge Live Input Evaluator',
      matchedKeywords: [],
      missingKeywords: [],
      atsReadabilityNotes: 'Start adding content in the builder to generate custom ATS readability suggestions.',
    };
  }

  const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Your job is to evaluate resumes exactly as enterprise ATS systems like Workday, Greenhouse, and Lever do.

IMPORTANT INSTRUCTIONS:
- Analyze the resume data below very carefully
- Score each section based ONLY on what is actually present in the data
- Be specific in feedback — reference the actual content from the resume
- Do NOT give generic advice — tailor everything to THIS specific resume
${targetJobDescription ? `\nCompare it against this TARGET JOB DESCRIPTION:\n"""\n${targetJobDescription}\n"""` : '\nEvaluate for general software/tech industry ATS compatibility.'}

You MUST respond with ONLY a valid JSON object. No markdown, no extra text, no code fences. Just pure JSON matching this exact structure:

{"score":<0-100>,"grade":"<A+|A|B+|B|C|Unrated>","summary":"<2 sentences about THIS specific resume>","categories":[{"name":"Contact & Links","score":<0-100>,"weight":"20%","status":"<good|warning|error>","feedback":"<specific feedback>"},{"name":"Keywords & Skills","score":<0-100>,"weight":"25%","status":"<good|warning|error>","feedback":"<specific feedback>"},{"name":"Experience Impact","score":<0-100>,"weight":"30%","status":"<good|warning|error>","feedback":"<specific feedback>"},{"name":"Professional Summary","score":<0-100>,"weight":"15%","status":"<good|warning|error>","feedback":"<specific feedback>"},{"name":"Education & Credentials","score":<0-100>,"weight":"10%","status":"<good|warning|error>","feedback":"<specific feedback>"}],"passedChecks":["<specific things done well>"],"warningChecks":["<specific things to fix>"],"suggestions":[{"id":"sug-1","section":"<Summary|Experience|Skills|Projects>","title":"<action title>","description":"<why this matters>","sampleFix":"<concrete improved text>"}],"matchedKeywords":["<actual keywords found>"],"missingKeywords":["<recommended keywords to add>"],"atsReadabilityNotes":"<parser friendliness advice>"}`;

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

  const userPrompt = `Analyze this resume and return ONLY the JSON result:\n${JSON.stringify(resumePayload, null, 2)}`;

  const res = await callNvidiaAi([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ], { temperature: 0.2, max_tokens: 4000 });

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
 * Ask AI to improve or rewrite a specific resume section
 */
export async function improveWithDeepSeek(
  actionType: string,
  inputText: string,
  context?: { role?: string; skills?: string[] }
): Promise<{ suggestedText: string; rationale: string }> {
  const roleContext = context?.role || 'Software Engineer';
  const skillsContext = (context?.skills || []).join(', ') || 'React, TypeScript, Python, Cloud';

  let taskInstruction = '';
  switch (actionType) {
    case 'summary':
      taskInstruction = `Rewrite this professional summary to be powerful, ATS-optimized, and compelling for a ${roleContext} role. Include relevant keywords from: ${skillsContext}. Make it 2-3 sentences that clearly communicate value proposition, technical depth, and career impact.`;
      break;
    case 'ats':
      taskInstruction = `Optimize this text for maximum ATS compatibility. Add industry-standard keywords, remove filler words, use standard formatting that ATS parsers (Workday, Greenhouse) can read. Target role: ${roleContext}. Key skills to weave in: ${skillsContext}.`;
      break;
    case 'concise':
      taskInstruction = `Make this text more concise and impactful. Remove redundancy, tighten language, and ensure every word adds value. Keep the core meaning but cut word count by 30-40%.`;
      break;
    case 'profile':
      taskInstruction = `Generate a complete professional summary from scratch for a ${roleContext} with skills in ${skillsContext}. Make it 2-3 sentences, action-oriented, with quantifiable impact language.`;
      break;
    case 'experience':
      taskInstruction = `Enhance this experience bullet point. Start with a powerful action verb. Add specific, realistic metrics (percentages, scale, time saved). Make it demonstrate clear business impact for a ${roleContext}.`;
      break;
    case 'verb':
      taskInstruction = `Replace weak verbs in this text with strong, ATS-friendly action verbs (Architected, Engineered, Spearheaded, Optimized, Deployed, Orchestrated). Keep the same meaning but make it more powerful.`;
      break;
    default:
      taskInstruction = `Improve this resume text to be more professional, impactful, and ATS-friendly for a ${roleContext} position.`;
  }

  const prompt = `${taskInstruction}

Original text to improve:
"${inputText}"

You MUST respond with ONLY a valid JSON object, no other text:
{"suggestedText":"<your improved text>","rationale":"<1-2 sentences explaining what you changed and why>"}`;

  const res = await callNvidiaAi([
    { role: 'system', content: 'You are an expert resume writer. You respond ONLY with valid JSON. Never include markdown formatting, code fences, or any text outside the JSON object.' },
    { role: 'user', content: prompt },
  ], { temperature: 0.4, max_tokens: 1500 });

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
    // If JSON parsing fails, use the raw text as the suggestion
    const rawText = res.content
      .replace(/```json|```/g, '')
      .replace(/["']/g, '')
      .trim();
    return {
      suggestedText: rawText || inputText,
      rationale: `Generated with ${res.modelUsed} via NVIDIA NIM.`,
    };
  }
}

/**
 * Free-form Q&A with AI Career Assistant — thorough, detailed, personalized answers
 */
export async function askAiCareerQuestion(
  question: string,
  resumeContext?: ResumeData
): Promise<{ answer: string; modelUsed: string }> {
  let profileSummary = 'No resume loaded — providing general career advice.';

  if (resumeContext) {
    const parts: string[] = [];
    if (resumeContext.personal.fullName) parts.push(`Name: ${resumeContext.personal.fullName}`);
    if (resumeContext.personal.jobTitle) parts.push(`Target Role: ${resumeContext.personal.jobTitle}`);
    if (resumeContext.skills.length > 0) parts.push(`Skills: ${resumeContext.skills.map((s) => s.name).join(', ')}`);
    if (resumeContext.summary) parts.push(`Summary: ${resumeContext.summary}`);
    if (resumeContext.experience.length > 0) {
      parts.push(`Experience: ${resumeContext.experience.map((e) => `${e.jobTitle} at ${e.company} (${e.highlights.slice(0, 2).join('; ')})`).join(' | ')}`);
    }
    if (resumeContext.education.length > 0) {
      parts.push(`Education: ${resumeContext.education.map((ed) => `${ed.degree} from ${ed.institution}`).join(', ')}`);
    }
    if (resumeContext.projects.length > 0) {
      parts.push(`Projects: ${resumeContext.projects.map((p) => `${p.title} (${p.technologies.join(', ')})`).join(' | ')}`);
    }
    profileSummary = parts.join('\n');
  }

  const systemPrompt = `You are ResumeForge AI Co-Pilot — an elite career mentor, resume strategist, and technical recruiter with 15+ years of experience at top tech companies (Google, Amazon, Meta, Microsoft).

YOUR RULES:
1. Give THOROUGH, DETAILED answers — at least 200 words for any question
2. Always reference the user's ACTUAL resume data when relevant (their skills, experience, projects)
3. Use clear structure: headings with ##, bullet points with •, and bold **key terms**
4. Provide SPECIFIC, ACTIONABLE advice — never generic platitudes
5. Include concrete examples, sample text, or frameworks the user can directly apply
6. Be encouraging but honest — point out both strengths and areas for improvement
7. If the question is about interviews, give actual sample answers
8. If the question is about salary, give real market data ranges
9. End with a clear "Next Steps" section with 2-3 specific actions

USER'S RESUME PROFILE:
${profileSummary}

Remember: Your answer should be comprehensive, personalized to their profile, and immediately useful. Think like a senior mentor who truly cares about this person's career success.`;

  const res = await callNvidiaAi([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question },
  ], { temperature: 0.5, max_tokens: 4000 });

  return {
    answer: res.content,
    modelUsed: res.modelUsed,
  };
}
