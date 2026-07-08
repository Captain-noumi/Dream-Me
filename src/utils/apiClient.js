import { FLAGSHIP_DOMAINS } from './domainsData';

const MOCK_VIDEOS = {
  "zJsK70GZ3Dw": {
    videoId: "zJsK70GZ3Dw",
    title: "How to become a Software Engineer - The Ultimate Roadmap",
    channelTitle: "Developer Career Paths"
  },
  "KxryzSO1Fjs": {
    videoId: "KxryzSO1Fjs",
    title: "Data Science Roadmap - Learn Data Science in 12 Months",
    channelTitle: "DataInsight"
  },
  "c9Wg6Ry_zmo": {
    videoId: "c9Wg6Ry_zmo",
    title: "UI/UX Design Masterclass - Roadmap for Beginners",
    channelTitle: "DesignAcademy"
  },
  "z06QR-y1LkA": {
    videoId: "z06QR-y1LkA",
    title: "Game Development Guide: From Concept to Launch",
    channelTitle: "PixelCraft"
  },
  "g8ZzP94V9i0": {
    videoId: "g8ZzP94V9i0",
    title: "Corporate Finance and Valuation Basics",
    channelTitle: "Financial Analyst Group"
  },
  "j5mC3B-iW3M": {
    videoId: "j5mC3B-iW3M",
    title: "Digital Marketing Complete Roadmap for Beginners",
    channelTitle: "MarketMinds"
  },
  "F37n45Pq-yY": {
    videoId: "F37n45Pq-yY",
    title: "Introduction to Life Sciences and Biology Careers",
    channelTitle: "ScienceHub"
  },
  "vo4pMVb0R6M": {
    videoId: "vo4pMVb0R6M",
    title: "Psychology Careers & Paths - Learn to Help Others",
    channelTitle: "Insightful Minds"
  }
};

const getGenericMockVideo = (query) => ({
  videoId: "dQw4w9WgXcQ",
  title: `Ultimate Career Masterclass & Roadmap: ${query || "Your Dream Path"}`,
  channelTitle: "Dream Me Education",
  description: `A comprehensive overview and roadmap explaining how to break into the field of ${query || "your chosen career"} with modern guidelines and industry strategies.`,
  thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop"
});

const generateClientWatsonxMock = (action, body) => {
  const { answers, domain } = body;
  const allText = (answers || []).map(a => a.answer).join(' ').toLowerCase();

  if (action === 'generate_questions') {
    const step = answers.length;
    let questionText = "";

    if (step === 1) {
      const hobby = answers[0].answer;
      questionText = `That's really interesting that you enjoy "${hobby}". What specifically is it about this that you enjoy most? For example, is it the creative act of building/making it, discovering how it works, or using it to solve puzzles?`;
    } else if (step === 2) {
      questionText = `Given what you described about your enjoyment, would you generally prefer fixing/improving something that already exists, or designing and building something completely new from scratch?`;
    } else if (step === 3) {
      questionText = `When you are learning a new tool or hobby, do you prefer reading structured instructions first, or diving straight into experimenting?`;
    } else {
      questionText = `Would you rather present your finished concepts to a group of people, or work behind the scenes to optimize the details?`;
    }

    return { question: questionText };
  }

  if (action === 'evaluate_signals') {
    const categories = ['creation', 'exploration', 'analysis', 'structure', 'visual', 'logic', 'social', 'helping-others'];
    const signals = {};
    const keywordsMap = {
      creation: ['make', 'build', 'create', 'write', 'code', 'design', 'art', 'game', 'scratch'],
      exploration: ['learn', 'find', 'explore', 'discover', 'travel', 'read', 'new'],
      analysis: ['math', 'data', 'analyze', 'science', 'research', 'why', 'logic', 'problem'],
      structure: ['organize', 'plan', 'structure', 'schedule', 'list', 'fix', 'broken'],
      visual: ['draw', 'paint', 'ui', 'ux', 'art', 'color', 'look', 'graphic', 'web', 'sketch'],
      logic: ['math', 'code', 'program', 'algorithm', 'system', 'solve', 'logic'],
      social: ['people', 'team', 'talk', 'share', 'friend', 'group', 'lead', 'help'],
      "helping-others": ['help', 'teach', 'mentor', 'guide', 'social', 'psychology', 'support']
    };

    categories.forEach(cat => {
      let score = 4;
      let evidence = "General responses.";
      let reason = "Indicates standard interest.";

      const matchedWord = keywordsMap[cat].find(kw => allText.includes(kw));
      if (matchedWord) {
        score = 8 + Math.floor(Math.random() * 3);
        const sentence = (answers || []).map(a => a.answer).find(ans => ans.toLowerCase().includes(matchedWord)) || "";
        evidence = sentence.length > 50 ? `"${sentence.substring(0, 50)}..."` : `"${sentence}"`;
        reason = `Directly reflects your mention of "${matchedWord}" in responses.`;
      } else {
        score = 3 + Math.floor(Math.random() * 3);
      }
      signals[cat] = { score, evidence, reason };
    });
    // Simulating top 4-5 matches based on answers keyword checks
    const matches = [];

    // Check movie reviewer / film critic
    if (allText.includes('movie') || allText.includes('film') || allText.includes('review') || allText.includes('critic') || allText.includes('cinema') || allText.includes('anime')) {
      matches.push({
        id: "film-criticism",
        name: "Film Criticism & Media Studies",
        category: "Creative & Design",
        matchPercentage: 88,
        confidence: "Strong match",
        fitReason: "Directly aligns with your interest in reviewing movies, analyzing narratives, and sharing opinions.",
        isFlagship: false,
        iconName: "Film"
      });
      matches.push({
        id: "cinema-filmmaking",
        name: "Cinema & Filmmaking",
        category: "Creative & Design",
        matchPercentage: 72,
        confidence: "Worth exploring",
        fitReason: "Matches your affinity for cinema, introducing you to the visual staging and scene execution.",
        isFlagship: false,
        iconName: "Film"
      });
      matches.push({
        id: "journalism",
        name: "Journalism & Media Writing",
        category: "Humanities & Social Impact",
        matchPercentage: 85,
        confidence: "Strong match",
        fitReason: "Fits your drive to report, audit media pieces, and formulate reviews.",
        isFlagship: false,
        iconName: "BookOpen"
      });
    }

    // Check code / program / dev
    if (allText.includes('code') || allText.includes('program') || allText.includes('dev') || allText.includes('software') || allText.includes('web') || allText.includes('math')) {
      matches.push({
        id: "software-development",
        name: "Software & Web Development",
        category: "Tech",
        matchPercentage: 90,
        confidence: "Strong match",
        fitReason: "Perfect fit for your programming experience and desire to build software tools.",
        isFlagship: true,
        iconName: "Code"
      });
      matches.push({
        id: "artificial-intelligence",
        name: "AI & Machine Learning Engineer",
        category: "Tech",
        matchPercentage: 82,
        confidence: "Strong match",
        fitReason: "Complements your logical skills, introducing python modeling and training nodes.",
        isFlagship: false,
        iconName: "Brain"
      });
    }

    // Add generic fallbacks if matches count is small
    if (matches.length < 3) {
      matches.push({
        id: "software-development",
        name: "Software & Web Development",
        category: "Tech",
        matchPercentage: 75,
        confidence: "Strong match",
        fitReason: "Matches your basic creative and logical structures.",
        isFlagship: true,
        iconName: "Code"
      });
      matches.push({
        id: "ui-ux-design",
        name: "UI/UX Design",
        category: "Creative & Design",
        matchPercentage: 72,
        confidence: "Worth exploring",
        fitReason: "Leverages your visual elements and user flow interests.",
        isFlagship: true,
        iconName: "Figma"
      });
      matches.push({
        id: "digital-marketing",
        name: "Digital Marketing",
        category: "Business & Commerce",
        matchPercentage: 68,
        confidence: "Worth exploring",
        fitReason: "Complements social and community sharing signals.",
        isFlagship: true,
        iconName: "Megaphone"
      });
      matches.push({
        id: "psychology",
        name: "Psychology",
        category: "Humanities & Social Impact",
        matchPercentage: 65,
        confidence: "Worth exploring",
        fitReason: "Matches your motivation to support and guide human experiences.",
        isFlagship: true,
        iconName: "HeartHandshake"
      });
    }

    return { signals, matches: matches.slice(0, 5) };
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
        { name: `${dom} Starter Guide`, description: "An interactive repository mapping out the complete layout of modern standards and skills." },
        { name: `Official ${dom} Documentation & Handbook`, description: "The authoritative reference guide containing detailed usage guides." },
        { name: `Awesome ${dom} Curated List`, description: "A community-curated repository listing essential libraries, packages, and learning assets." }
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
};

export const safeFetchWatsonx = async (body) => {
  try {
    const response = await fetch('/api/watsonx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || contentType.includes('javascript') || contentType.includes('text/html')) {
      console.warn("Vercel backend not running. Running client-side Watsonx simulation.");
      return generateClientWatsonxMock(body.action, body);
    }

    const text = await response.text();
    if (text.trim().startsWith('//') || text.includes('import')) {
      return generateClientWatsonxMock(body.action, body);
    }
    return JSON.parse(text);
  } catch (err) {
    console.warn("Watsonx fetch failed, using client simulation:", err);
    return generateClientWatsonxMock(body.action, body);
  }
};

export const safeFetchYoutube = async (params) => {
  const { videoId, q } = params;
  let url = '/api/youtube';
  if (videoId) {
    url += `?videoId=${encodeURIComponent(videoId)}`;
  } else if (q) {
    url += `?q=${encodeURIComponent(q)}`;
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || contentType.includes('javascript') || contentType.includes('text/html')) {
      console.warn("Vercel backend not running. Running client-side YouTube simulation.");
      return getClientYoutubeMock(videoId, q);
    }

    const text = await response.text();
    if (text.trim().startsWith('//') || text.includes('import')) {
      return getClientYoutubeMock(videoId, q);
    }
    return JSON.parse(text);
  } catch (err) {
    console.warn("YouTube fetch failed, using client simulation:", err);
    return getClientYoutubeMock(videoId, q);
  }
};

const getClientYoutubeMock = (videoId, q) => {
  if (videoId && MOCK_VIDEOS[videoId]) {
    return {
      ...MOCK_VIDEOS[videoId],
      description: "A complete step-by-step masterclass guiding you from zero experience to landing your first job."
    };
  }
  
  if (q) {
    const key = Object.keys(MOCK_VIDEOS).find(vidId => 
      MOCK_VIDEOS[vidId].title.toLowerCase().includes(q.toLowerCase())
    );
    if (key) return MOCK_VIDEOS[key];
  }

  return getGenericMockVideo(q);
};
