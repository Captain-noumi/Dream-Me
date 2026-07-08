// In-process rate limiter queue capping requests to callWatsonx at 2 calls per 1000ms
class RateLimiter {
  constructor(limit = 2, interval = 1000) {
    this.limit = limit;
    this.interval = interval;
    this.queue = [];
    this.requestTimes = [];
  }

  async execute(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.queue.length === 0) return;

    const now = Date.now();
    this.requestTimes = this.requestTimes.filter(t => now - t < this.interval);

    if (this.requestTimes.length < this.limit) {
      const item = this.queue.shift();
      this.requestTimes.push(now);
      try {
        const result = await item.fn();
        item.resolve(result);
      } catch (err) {
        item.reject(err);
      } finally {
        setTimeout(() => this.processQueue(), 50);
      }
    } else {
      const oldest = this.requestTimes[0];
      const delay = this.interval - (now - oldest) + 10;
      setTimeout(() => this.processQueue(), Math.max(delay, 50));
    }
  }
}

const watsonxLimiter = new RateLimiter(2, 1000);

// Server-side session history storage mapped by sessionId (capped at 10 messages/5 QA pairs per session)
const sessions = {};

// Mock Generator for local testing or if Watsonx credentials are not provided
const generateMockResponse = (action, body) => {
  const { answers, domain, signals } = body;

  if (action === 'generate_questions') {
    // Basic analysis of answers to make mock questions feel dynamic
    const allAnswersText = (answers || []).map(a => a.answer).join(' ').toLowerCase();
    
    let followUps = [];
    if (allAnswersText.includes('game') || allAnswersText.includes('play') || allAnswersText.includes('design')) {
      followUps = [
        "You mentioned an interest in design and gameplay. Would you prefer designing the rules and logic of a system, or creating its visual look and feel?",
        "When you play games or explore systems, are you more drawn to finding hidden secrets, or competing and mastering the mechanics?"
      ];
    } else if (allAnswersText.includes('code') || allAnswersText.includes('program') || allAnswersText.includes('math')) {
      followUps = [
        "Since you like building logical systems, do you prefer working on visual interfaces that people interact with, or backend systems that handle data and logic?",
        "How do you feel about debugging? Does solving a complex, hidden logic bug excite you, or do you find it frustrating?"
      ];
    } else {
      followUps = [
        "When working on a project, do you find yourself more excited about brainstorming the initial idea, or organizing the execution steps to get it done?",
        "Do you prefer working on tasks where you can collaborate closely with a team, or do you work best in a quiet, focused environment?"
      ];
    }

    // Limit to 1-2 questions
    return { questions: followUps.slice(0, 2) };
  }

  if (action === 'evaluate_signals') {
    // Generate mock signals based on basic keyword matching in answers
    const allText = (answers || []).map(a => a.answer).join(' ').toLowerCase();
    
    const categories = [
      { name: 'creation', keywords: ['make', 'build', 'create', 'write', 'code', 'design', 'art', 'game', 'scratch'] },
      { name: 'exploration', keywords: ['learn', 'find', 'explore', 'discover', 'travel', 'read', 'new'] },
      { name: 'analysis', keywords: ['math', 'data', 'analyze', 'science', 'research', 'why', 'logic', 'problem'] },
      { name: 'structure', keywords: ['organize', 'plan', 'structure', 'schedule', 'list', 'fix', 'broken'] },
      { name: 'visual', keywords: ['draw', 'paint', 'ui', 'ux', 'art', 'color', 'look', 'graphic', 'web'] },
      { name: 'logic', keywords: ['math', 'code', 'program', 'algorithm', 'system', 'solve', 'logic'] },
      { name: 'social', keywords: ['people', 'team', 'talk', 'share', 'friend', 'group', 'lead', 'help'] },
      { name: 'helping-others', keywords: ['help', 'teach', 'mentor', 'guide', 'social', 'psychology', 'support'] }
    ];

    const signals = {};
    categories.forEach(cat => {
      let score = 4; // base score
      let evidence = "Your overall vibe in the interview.";
      let reason = "Indicated a moderate level of comfort in this area.";

      // Check keywords
      const matchedWord = cat.keywords.find(kw => allText.includes(kw));
      if (matchedWord) {
        score = 8 + Math.floor(Math.random() * 3); // 8, 9, 10
        // Find the sentence containing the keyword
        const sentence = (answers || []).map(a => a.answer).find(ans => ans.toLowerCase().includes(matchedWord)) || "";
        evidence = sentence.length > 50 ? `"${sentence.substring(0, 50)}..."` : `"${sentence}"`;
        reason = `Directly reflects your mention of "${matchedWord}", showing an affinity for related concepts.`;
      } else {
        score = 3 + Math.floor(Math.random() * 3); // 3, 4, 5
        evidence = "General responses.";
        reason = `No explicit mention of ${cat.name}-related activities, suggesting it may not be your primary driver.`;
      }

      signals[cat.name] = { score, evidence, reason };
    });

    return { signals };
  }

  if (action === 'generate_roadmap') {
    const dom = domain || 'Custom Path';
    return {
      roadmap: [
        {
          phase: "Phase 1: Fundamentals & Discovery",
          milestones: [
            `Learn the core concepts of ${dom}`,
            "Understand standard industry terminology and methodologies",
            "Set up your basic local development or creation environment",
            "Complete 2-3 introductory exercises or small projects"
          ]
        },
        {
          phase: "Phase 2: Core Competencies",
          milestones: [
            "Master key tools and essential techniques used by professionals",
            "Build an intermediate-level project showcasing core mechanics",
            "Learn how to troubleshoot, debug, or refine your workflow",
            "Join an online community to participate in peer reviews"
          ]
        },
        {
          phase: "Phase 3: Deep Dive & Specialization",
          milestones: [
            "Explore advanced concepts and specialize in a sub-niche",
            "Integrate third-party services, APIs, or advanced toolsets",
            "Optimize performance, scalability, or visual design aesthetics",
            "Contribute to open-source or collaborate on a shared project"
          ]
        },
        {
          phase: "Phase 4: Professional Portfolio & Launch",
          milestones: [
            "Assemble 3 high-quality pieces into a premium personal portfolio website",
            "Write detailed case studies explaining your process and design choices",
            "Prepare for industry interviews and technical screenings",
            "Submit your work to platforms like GitHub, Behance, or relevant networks"
          ]
        }
      ],
      resources: [
        {
          name: `${dom} Starter Guide`,
          description: "An interactive repository mapping out the complete layout of modern standards and skills."
        },
        {
          name: `Official ${dom} Documentation & Handbook`,
          description: "The authoritative reference guide containing detailed usage guides, tutorials, and APIs."
        },
        {
          name: `Awesome ${dom} Curated List`,
          description: "A community-curated repository listing essential libraries, packages, and learning assets."
        }
      ]
    };
  }

  if (action === 'generate_transparency') {
    const dom = domain || 'your suggested domain';
    const firstAns = answers && answers[0] ? answers[0].answer : "doing things you enjoy";
    return {
      explanation: `Your alignment with ${dom} comes from your strong focus on hands-on building and self-directed exploration. Specifically, you highlighted your enjoyment of "${firstAns.substring(0, 40)}${firstAns.length > 40 ? '...' : ''}", which indicates a natural capacity for systematic thinking and creation. Furthermore, you chose options reflecting a preference for solving complex problems over simple routine, matching the exact core requirements of this field.`
    };
  }

  return { error: 'Unknown action' };
};

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const action = req.body?.action || req.query?.action;
  const sessionId = req.body?.sessionId || req.query?.sessionId || 'default';

  // Handle server-side chat history clearing
  if (action === 'clear_history') {
    sessions[sessionId] = [];
    console.log(`Server-side chat history cleared for session: ${sessionId}`);
    return res.status(200).json({ success: true, message: 'Chat history cleared successfully' });
  }

  const apiKey = process.env.WATSONX_APIKEY;
  const projectId = process.env.WATSONX_PROJECT_ID;
  const answers = req.body?.answers;
  const domain = req.body?.domain;
  const signals = req.body?.signals;

  if (!action) {
    return res.status(400).json({ error: 'Missing action parameter' });
  }

  // Fallback to Mock if variables are not provided
  if (!apiKey || !projectId) {
    console.log(`Watsonx keys not configured. Falling back to intelligent mock data for action: ${action}`);
    const mockData = generateMockResponse(action, req.body);
    return res.status(200).json({ ...mockData, isMock: true });
  }

  try {
    // 1. Get access token from IBM Cloud IAM
    const accessToken = await getWatsonxToken(apiKey);

    // 2. Build prompt depending on action
    let systemPrompt = "";
    let userPrompt = "";

    if (action === 'generate_questions') {
      // Sync server-side history mapping
      if (!sessions[sessionId]) {
        sessions[sessionId] = [];
      }
      if (answers && answers.length > 0) {
        answers.forEach(a => {
          const exists = sessions[sessionId].some(h => h.question === a.question && h.answer === a.answer);
          if (!exists) {
            sessions[sessionId].push(a);
          }
        });
      }
      // Cap at last 5 QA pairs (10 messages total)
      if (sessions[sessionId].length > 5) {
        sessions[sessionId] = sessions[sessionId].slice(-5);
      }
      const history = sessions[sessionId];
      const qas = history.map((a, i) => `Q${i+1}: ${a.question}\nA${i+1}: ${a.answer}`).join('\n\n');
      const step = answers ? answers.length : history.length;

      let guidance = "";
      if (step === 1) {
        guidance = `The user has just told you about their hobby/interest: "${history[0].answer}".
Your goal is to generate Question 2. Warmly acknowledge their interest. Then, ask them a conversational question probing what specifically they enjoy about it: is it building, exploring, or analyzing?
Keep the question short, direct, and concise (under 2 sentences). Do not elaborate.`;
      } else if (step === 2) {
        guidance = `The user described what they enjoy about their interest: "${history[1].answer}".
Your goal is to generate Question 3. Ask them a short scenario question customized to their interest (e.g. 'would you rather fix a broken system that already exists, or build a new one from scratch?') to probe structure vs. ambiguity.
Keep the question short, direct, and under 2 sentences.`;
      } else {
        guidance = `Review their answers so far. Your goal is to generate Question ${step + 1}.
Ask a warm, natural follow-up question that targets their strongest or most ambiguous career signals.
Keep the question short, direct, and under 2 sentences.`;
      }

      systemPrompt = `You are a warm, highly intuitive, and empathetic career guidance counselor.
Your objective is to review the user's career interview answers and generate a single, deeply personalized follow-up question.
Keep your response concise. The question must be short, direct, and to the point (no more than 1-2 sentences). Do not include any greeting or conversational filler beyond a short warm acknowledgment.

${guidance}

Keep the tone encouraging, curious, and professional.

You must respond ONLY with a valid JSON object matching this structure (do not add text outside the JSON):
{
  "question": "Your tailored follow-up question here"
}

Do not wrap in markdown code blocks.`;

      userPrompt = `Here is our conversation history so far:
${qas}

Generate the next personalized question (Question ${step + 1}).`;

    } else if (action === 'evaluate_signals') {
      const history = (sessions[sessionId] && sessions[sessionId].length > 0) ? sessions[sessionId] : (answers || []);
      const qas = history.map((a, i) => `Q${i+1}: ${a.question}\nA${i+1}: ${a.answer}`).join('\n\n');
      systemPrompt = `You are a high-fidelity Watsonx career counseling assistant.
Analyze the user's responses to evaluate their affinity score (0 to 10) for each of these 8 categories:
- creation (making things, writing, painting, coding)
- exploration (seeking new environments, discovering secrets, learning new topics)
- analysis (math, research, scientific inquiry, debugging)
- structure (organization, planning, detail-oriented schedules, fixing systems)
- visual (aesthetics, design, graphical interface, visual harmony)
- logic (computational thinking, algorithmic systems, abstract problem-solving)
- social (collaborating, sharing, speaking, leading teams)
- helping-others (teaching, mentorship, psychology, social service)

For each category, extract a short verbatim-adjacent snippet (1-2 sentences) from their answers that justifies the score, and provide a short reason.

Based on their answers, select the top 4-6 matching domains from the following pool. Your selections must be at least 80% accurate to their explicit interests and responses (e.g. if they say they enjoy watching movies and review them, map them to 'Film Criticism & Media Studies' rather than 'Cinema & Filmmaking' or 'Software Development').

Available Domains Pool:
- Flagship (Curated) Domains:
  - "software-development": Software & Web Development (Tech)
  - "data-science": Data Science (Tech)
  - "ui-ux-design": UI/UX Design (Creative & Design)
  - "game-development": Game Development (Creative & Design)
  - "finance": Finance (Business & Commerce)
  - "digital-marketing": Digital Marketing (Business & Commerce)
  - "biology-sciences": Biology & Life Sciences (Science & Research)
  - "psychology": Psychology (Humanities & Social Impact)
- Dynamic / Niche Domains:
  - "cybersecurity": Cybersecurity Analyst (Tech)
  - "artificial-intelligence": AI & Machine Learning Engineer (Tech)
  - "bioinformatics": Bioinformatics Specialist (Tech/Science) [Niche]
  - "illustration-animation": Illustration & Animation (Creative & Design)
  - "performing-arts-music": Performing Arts & Music (Creative & Design)
  - "cinema-filmmaking": Cinema & Filmmaking (Creative & Design)
  - "film-criticism": Film Criticism & Media Studies (Creative & Design) [Niche]
  - "creative-writing": Creative Writing & Screenwriting (Creative & Design) [Niche]
  - "environmental-science": Environmental Science (Science & Research)
  - "physics-chemistry": Physics & Chemistry Research (Science & Research)
  - "astronomy-astrophysics": Astronomy & Astrophysics (Science & Research) [Niche]
  - "cognitive-neuroscience": Cognitive Neuroscience (Science & Research) [Niche]
  - "product-management": Product Management (Business & Commerce)
  - "entrepreneurship": Entrepreneurship & Innovation (Business & Commerce)
  - "actuarial-science": Actuarial Science (Business & Commerce) [Niche]
  - "journalism": Journalism & Media Writing (Humanities & Social Impact)
  - "social-work": Social Work & Support Services (Humanities & Social Impact)
  - "public-policy": Public Policy & Urban Planning (Humanities & Social Impact)
  - "anthropology-culture": Anthropology & Cultural Studies (Humanities & Social Impact) [Niche]
  - "speech-pathology": Speech-Language Pathology (Humanities/Science) [Niche]

For each matched domain:
- Assign an accurate matchPercentage (0 to 100) reflecting how close it is to their responses.
- Set confidence as 'Strong match' if percentage >= 75, else 'Worth exploring'.
- Provide a personalized 'fitReason' explaining why it matches based on their responses.
- Set isFlagship as true if it is in the Flagship pool, else false.
- Set iconName matching their icon (e.g. 'Film' for film-criticism or cinema-filmmaking, 'Music' for performing-arts-music, 'Code' for software-development, 'TrendingUp' for finance, etc.).

You must respond ONLY with a valid JSON object matching the following structure:
{
  "signals": {
    "creation": { "score": 8, "evidence": "I enjoyed writing custom rules for D&D", "reason": "Demonstrates desire to build systems and experiences from scratch" },
    ...
  },
  "matches": [
    {
      "id": "film-criticism",
      "name": "Film Criticism & Media Studies",
      "category": "Creative & Design",
      "matchPercentage": 88,
      "confidence": "Strong match",
      "fitReason": "Matches your interest in analyzing cinema and writing reviews, as you mentioned enjoying watching anime and reviewing story elements.",
      "isFlagship": false,
      "iconName": "Film"
    },
    ...
  ]
}

Do not include any introductory or concluding text. Do not wrap in markdown code blocks.`;

      userPrompt = `Here are the completed interview answers:
${qas}

Evaluate the signals and return the matched domains JSON object.`;

    } else if (action === 'generate_roadmap') {
      const signalSummary = Object.entries(signals || {})
        .map(([k, v]) => `${k}: score=${v.score}, evidence="${v.evidence}"`)
        .join('\n');
      systemPrompt = `You are a high-fidelity Watsonx career counseling assistant.
Generate a structured, comprehensive career learning roadmap for the following dynamic domain: "${domain}".
The user has the following signal profile:
${signalSummary}

You must create a 4-phase learning timeline (e.g., Foundations, Core, Advanced, Portfolio) with exactly 3-4 specific milestones per phase, and suggest 3 learning resource/launchpad names (with a brief description, NO links).

You must respond ONLY with a valid JSON object matching the following structure:
{
  "roadmap": [
    {
      "phase": "Foundations",
      "milestones": ["Milestone 1", "Milestone 2"]
    },
    ...
  ],
  "resources": [
    { "name": "Resource Name", "description": "Resource Description" }
  ]
}

Do not include any introductory or concluding text. Do not wrap in markdown code blocks.`;

      userPrompt = `Generate the roadmap and resource recommendations for the domain: "${domain}".`;

    } else if (action === 'generate_transparency') {
      const history = (sessions[sessionId] && sessions[sessionId].length > 0) ? sessions[sessionId] : (answers || []);
      const qas = history.map((a, i) => `Q${i+1}: ${a.question}\nA${i+1}: ${a.answer}`).join('\n\n');
      systemPrompt = `You are a high-fidelity Watsonx career counseling assistant.
Explain to the user why they matched with the domain "${domain}" using evidence from their own answers.
Cite specific quotes or verbatim concepts from their responses to create a highly personalized, psychological explanation.
Be encouraging, transparent, and direct. Keep the explanation brief, concise, and focused (no more than 3-4 sentences).

You must respond ONLY with a valid JSON object matching the following structure:
{
  "explanation": "You matched with software engineering because in Q1 you mentioned 'building custom scripts'..."
}

Do not include any introductory or concluding text. Do not wrap in markdown code blocks.`;

      userPrompt = `Explain why the user matched with "${domain}" based on their interview answers:
${qas}`;
    }

    // Combine system & user prompt into the input format
    const fullInput = `<|system|>\n${systemPrompt}\n<|user|>\n${userPrompt}\n<|assistant|>\n`;

    // 3. Make Watsonx Generation call
    let maxTokens = 1000;
    if (action === 'generate_questions') {
      maxTokens = 400; // Allow enough space for JSON markup structure
    } else if (action === 'generate_transparency') {
      maxTokens = 500; // Allow enough space for explanation and JSON wrapper
    }
    const generatedText = await callWatsonx(accessToken, projectId, fullInput, maxTokens);

    // 4. Parse JSON out of generated response
    const parsedData = cleanAndParseJSON(generatedText);
    return res.status(200).json(parsedData);

  } catch (error) {
    console.error('Watsonx API handler error:', error);
    // Fall back to Mock in case of API errors, preventing app crash
    const mockData = generateMockResponse(action, req.body);
    return res.status(200).json({ ...mockData, isMock: true, apiError: error.message });
  }
}

async function getWatsonxToken(apiKey) {
  const tokenResponse = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`,
  });
  if (!tokenResponse.ok) {
    const errText = await tokenResponse.text();
    throw new Error(`IAM token retrieval failed: ${errText}`);
  }
  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

async function callWatsonxRaw(token, projectId, promptText, maxTokens = 1000) {
  const response = await fetch('https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      model_id: 'meta-llama/llama-3-3-70b-instruct',
      project_id: projectId,
      input: promptText,
      parameters: {
        decoding_method: 'greedy',
        max_new_tokens: maxTokens,
        min_new_tokens: 1,
      },
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Watsonx API generation call failed with status ${response.status}: ${errText}`);
  }
  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error('Watsonx API returned empty results');
  }
  return data.results[0].generated_text;
}

async function callWatsonxWithRetry(token, projectId, promptText, maxTokens = 1000, retries = 3, delay = 1000) {
  try {
    return await watsonxLimiter.execute(() => callWatsonxRaw(token, projectId, promptText, maxTokens));
  } catch (error) {
    const errorMsg = error.message || "";
    const isRateLimit = errorMsg.includes("429") || errorMsg.includes("rate_limit_reached_requests");
    if (isRateLimit && retries > 0) {
      console.warn(`Watsonx rate limit (429) hit. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWatsonxWithRetry(token, projectId, promptText, maxTokens, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function callWatsonx(token, projectId, promptText, maxTokens = 1000) {
  return callWatsonxWithRetry(token, projectId, promptText, maxTokens);
}

function cleanAndParseJSON(text) {
  let cleaned = text.trim();
  // Strip markdown code block notation if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?/, '');
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    cleaned = cleaned.trim();
  }
  
  // Extract JSON structure if extra characters are appended
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse cleaned JSON:", cleaned);
    throw new Error(`JSON parsing failed: ${e.message}. Raw text: ${text}`);
  }
}
