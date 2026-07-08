export const FLAGSHIP_DOMAINS = [
  {
    id: "software-development",
    name: "Software & Web Development",
    category: "Tech",
    iconName: "Code",
    description: "Build applications, design websites, and orchestrate the software running our digital world.",
    signalProfile: {
      creation: 8,
      logic: 9,
      structure: 7,
      analysis: 6
    },
    roadmap: [
      {
        phase: "Phase 1: Programming Foundations",
        milestones: [
          "Learn programming fundamentals (variables, control flow, loops, data structures) using Python or JavaScript.",
          "Build 3 simple command-line applications (calculator, todo list, guess-the-number game).",
          "Understand git version control, GitHub repositories, and basic terminal commands.",
          "Familiarize yourself with basic HTML/CSS structural design layout rules."
        ]
      },
      {
        phase: "Phase 2: Core Engineering & Libraries",
        milestones: [
          "Master a core application stack (Frontend: React/Vite, or Backend: Node/Express/Python).",
          "Learn relational and non-relational database principles (SQL queries, schemas, indexing).",
          "Build a fully-functional CRUD application with user authentication and database persistence.",
          "Integrate external web REST APIs and handle asynchronous data streams."
        ]
      },
      {
        phase: "Phase 3: Architecture & Systems",
        milestones: [
          "Study data structures and algorithms (arrays, hash maps, sorting, Big O notation).",
          "Learn testing paradigms (unit testing, integration testing, debugging strategies).",
          "Explore CI/CD deployment pipelines (GitHub Actions, Vercel, Docker packaging).",
          "Implement API security standards (JWT, OAuth, hashing, CORS protection)."
        ]
      },
      {
        phase: "Phase 4: Scaling & Portfolio",
        milestones: [
          "Design a highly optimized, responsive personal portfolio website highlighting 3 full-stack projects.",
          "Write clean, technical case studies detailing architectural choices for each project.",
          "Contribute to open-source software projects or build a tool collaborating with a team.",
          "Prepare for technical interviews and whiteboarding exercises."
        ]
      }
    ],
    resources: [
      { name: "Roadmap.sh Frontend/Backend", description: "Comprehensive, visual guides to developer learning paths.", url: "https://roadmap.sh" },
      { name: "MDN Web Docs", description: "The definitive reference manual for HTML, CSS, JavaScript, and Web APIs.", url: "https://developer.mozilla.org" },
      { name: "React Documentation", description: "Official tutorials and documentation for modern frontend React state management.", url: "https://react.dev" }
    ],
    videoId: "zJsK70GZ3Dw"
  },
  {
    id: "data-science",
    name: "Data Science",
    category: "Tech",
    iconName: "BarChart3",
    description: "Extract insights from massive datasets, build predictive models, and guide strategic decisions.",
    signalProfile: {
      analysis: 9,
      logic: 8,
      structure: 7,
      exploration: 6
    },
    roadmap: [
      {
        phase: "Phase 1: Statistics & Mathematics",
        milestones: [
          "Master college-level descriptive and inferential statistics (probability distributions, hypothesis testing).",
          "Learn essential linear algebra and calculus concepts (matrices, eigenvectors, derivatives).",
          "Learn base Python syntax, including variables, lists, dicts, and functions.",
          "Set up Jupyter notebook workflows and virtual environment containers."
        ]
      },
      {
        phase: "Phase 2: Data Manipulation & Wrangling",
        milestones: [
          "Master NumPy and Pandas libraries for cleaning, sorting, and pivoting datasets.",
          "Learn SQL queries to select, join, and aggregate datasets in relational databases.",
          "Create visual charts using Matplotlib and Seaborn to communicate data distributions.",
          "Build an exploratory data analysis (EDA) project on a public dataset from Kaggle."
        ]
      },
      {
        phase: "Phase 3: Machine Learning & Modeling",
        milestones: [
          "Learn supervised learning algorithms (Linear/Logistic Regression, Decision Trees, Random Forests).",
          "Implement unsupervised learning models (K-means clustering, PCA dimensional reduction) using Scikit-Learn.",
          "Understand model validation techniques (cross-validation, confusion matrices, RMSE/AUC metrics).",
          "Practice feature engineering to optimize data pipeline modeling inputs."
        ]
      },
      {
        phase: "Phase 4: Big Data & Presentation",
        milestones: [
          "Get introduced to big data tools (PySpark, SQL data warehouses, cloud computing nodes).",
          "Build an interactive dashboard showcasing predictions using Streamlit, Tableau, or PowerBI.",
          "Compile a GitHub portfolio containing 3 Jupyter Notebooks with end-to-end analytical pipelines.",
          "Write a technical write-up detailing the business value derived from your analytical models."
        ]
      }
    ],
    resources: [
      { name: "Roadmap.sh Data Science", description: "Structured visual roadmap for learning data science.", url: "https://roadmap.sh/datascience" },
      { name: "Kaggle", description: "Platform for datasets, notebooks, and machine learning competitions.", url: "https://www.kaggle.com" },
      { name: "Towards Data Science", description: "Community-driven publication highlighting machine learning and statistics articles.", url: "https://towardsdatascience.com" }
    ],
    videoId: "KxryzSO1Fjs"
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    category: "Creative & Design",
    iconName: "Figma",
    description: "Research user behavior, draft interfaces, and design premium, highly accessible digital products.",
    signalProfile: {
      visual: 9,
      exploration: 8,
      social: 7,
      creation: 6
    },
    roadmap: [
      {
        phase: "Phase 1: Design Fundamentals",
        milestones: [
          "Learn visual design principles (typography, color theory, spacing grid layouts, contrast hierarchy).",
          "Understand user-centered design methodologies and the UX double-diamond framework.",
          "Master basic Figma vectors, frame structures, and simple screen mockups.",
          "Analyze 5 popular apps, writing reviews on their usability and interface layout choices."
        ]
      },
      {
        phase: "Phase 2: Wireframing & Prototyping",
        milestones: [
          "Sketch low-fidelity paper wireframes to map user actions and user flows.",
          "Convert sketches to medium-fidelity wireframes, mapping click-paths.",
          "Build high-fidelity prototypes in Figma using components, Auto-Layout, and interactive states.",
          "Design simple micro-interactions and transitions to replicate product feedback."
        ]
      },
      {
        phase: "Phase 3: User Research & Testing",
        milestones: [
          "Write research questionnaires, conduct 3 user interviews, and compile user personas.",
          "Create empathy maps and customer journey charts detailing user frustrations.",
          "Conduct moderated/unmoderated usability test runs, identifying navigation issues.",
          "Synthesize research findings into actionable design improvement iterations."
        ]
      },
      {
        phase: "Phase 4: Design Systems & Portfolio",
        milestones: [
          "Build a miniature design system with unified buttons, typography tokens, and form controls.",
          "Assemble 3 high-quality portfolio case studies highlighting user problem statements and iterative designs.",
          "Publish your designs on Behance, Dribbble, or a personal premium website.",
          "Learn to inspect design tokens and hand off files to developers."
        ]
      }
    ],
    resources: [
      { name: "Figma Learn", description: "Official visual design and Figma software tutorials.", url: "https://www.figma.com/resource-library/learn-design/" },
      { name: "Nielsen Norman Group", description: "The premier research house for usability guidelines and articles.", url: "https://www.nngroup.com" },
      { name: "Laws of UX", description: "An interactive index of cognitive psychology rules governing design UX.", url: "https://lawsofux.com" }
    ],
    videoId: "c9Wg6Ry_zmo"
  },
  {
    id: "game-development",
    name: "Game Development",
    category: "Creative & Design",
    iconName: "Gamepad2",
    description: "Design game mechanics, script physics systems, and craft immersive environments.",
    signalProfile: {
      creation: 9,
      visual: 8,
      logic: 7,
      structure: 6
    },
    roadmap: [
      {
        phase: "Phase 1: Game Design & Core Tools",
        milestones: [
          "Understand game loops, rule systems, difficulty scaling, and mechanic concepts.",
          "Set up Unity Engine or Unreal Engine software suite and study interface layouts.",
          "Learn standard scripting (C# for Unity, or Blueprints/C++ for Unreal Engine).",
          "Recreate a simple classic arcade game (Pong, Flappy Bird, or Asteroids) from scratch."
        ]
      },
      {
        phase: "Phase 2: Physics & Game Systems",
        milestones: [
          "Implement collision systems, custom movement inputs, jump arcs, and gravity math.",
          "Build state machines managing player status (idle, run, jump, slide, attack).",
          "Learn simple user interface structures (HUD overlays, health bars, inventory systems).",
          "Import, scale, and manage 2D/3D sprite assets, tilesets, and model files."
        ]
      },
      {
        phase: "Phase 3: Level Design & Audio",
        milestones: [
          "Map out level flows, balancing pacing, checkpoints, and enemy placements.",
          "Incorporate visual particles, cameras, and lighting nodes to generate mood.",
          "Integrate audio triggers, background music loops, and spatial SFX layers.",
          "Build a fully-functional multi-level prototype featuring saving/loading."
        ]
      },
      {
        phase: "Phase 4: Polish & Distribution",
        milestones: [
          "Conduct playtest runs with 3 friends, gathering feedback on controls and difficulty.",
          "Optimize frame rates, compile code bundles, and reduce build file sizes.",
          "Deploy a playable browser build or publish on platforms like itch.io.",
          "Build a developer diary case study documenting your mechanic designs."
        ]
      }
    ],
    resources: [
      { name: "Unity Learn", description: "Official learning pathways for learning game design and C# coding.", url: "https://learn.unity.com" },
      { name: "Unreal Engine Docs", description: "Reference guidelines for Blueprint systems and C++ architectures.", url: "https://docs.unrealengine.com" },
      { name: "GameDev.net", description: "Longstanding community repository of game development resources and forums.", url: "https://www.gamedev.net" }
    ],
    videoId: "z06QR-y1LkA"
  },
  {
    id: "finance",
    name: "Finance",
    category: "Business & Commerce",
    iconName: "TrendingUp",
    description: "Manage capital, structure investments, analyze corporate earnings, and model market trends.",
    signalProfile: {
      analysis: 9,
      structure: 8,
      logic: 7,
      social: 6
    },
    roadmap: [
      {
        phase: "Phase 1: Financial & Accounting Basics",
        milestones: [
          "Understand double-entry bookkeeping and how financial statement metrics interconnect.",
          "Learn to read and interpret Income Statements, Balance Sheets, and Cash Flow Statements.",
          "Master keyboard-only Excel operations, shortcuts, and basic lookup formulas.",
          "Study macroeconomic indicators (interest rates, inflation, GDP output, currency markets)."
        ]
      },
      {
        phase: "Phase 2: Corporate Finance & Modeling",
        milestones: [
          "Learn standard ratios (P/E ratios, debt-to-equity, profit margins, ROE returns).",
          "Build detailed 3-statement forecast financial models in Excel.",
          "Understand time-value-of-money concepts (NPV, IRR calculations, discounting).",
          "Build a Discounted Cash Flow (DCF) model for a publicly-traded stock."
        ]
      },
      {
        phase: "Phase 3: Valuation & Assets",
        milestones: [
          "Study different valuation approaches (Comparable Companies Analysis, Precedent Transactions).",
          "Understand asset classes (Equities, Fixed Income, Derivatives, Commodities).",
          "Explore corporate capital budgeting decisions and debt/equity capital structures.",
          "Create a professional investment pitch presentation evaluating a company."
        ]
      },
      {
        phase: "Phase 4: Specialized Portfolios & Careers",
        milestones: [
          "Determine your career niche (Investment Banking, Corporate Finance, Equity Research, Wealth Management).",
          "Build a virtual investment portfolio, documenting performance and risk analysis.",
          "Understand ethical guidelines, fiduciary responsibilities, and CFA/Series exam prerequisites.",
          "Analyze case study models used in commercial valuation screenings."
        ]
      }
    ],
    resources: [
      { name: "Investopedia", description: "Comprehensive library for explaining financial and market terms.", url: "https://www.investopedia.com" },
      { name: "Corporate Finance Institute", description: "Professional courses on modeling, valuations, and finance structures.", url: "https://corporatefinanceinstitute.com" },
      { name: "Bloomberg News", description: "Real-time industry reporting on global economic trends and equity research.", url: "https://www.bloomberg.com" }
    ],
    videoId: "g8ZzP94V9i0"
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    category: "Business & Commerce",
    iconName: "Megaphone",
    description: "Launch advertising campaigns, design SEO strategies, audit social media, and track conversions.",
    signalProfile: {
      social: 9,
      exploration: 8,
      visual: 6,
      structure: 6
    },
    roadmap: [
      {
        phase: "Phase 1: Marketing & Funnel Foundations",
        milestones: [
          "Understand marketing frameworks (4 Ps, customer journey maps, conversion funnels).",
          "Learn to draft compelling copy headlines and targeted copy pitches.",
          "Explore the fundamentals of Search Engine Optimization (keywords, search intent, metadata).",
          "Analyze 3 successful ad campaigns, writing case reports on their strategies."
        ]
      },
      {
        phase: "Phase 2: Channels & Content Management",
        milestones: [
          "Design content strategies for different channels (Instagram, LinkedIn, Email, Blogs).",
          "Learn to build and organize email campaigns (segmentation, automated drip lines).",
          "Understand paid search and paid social advertising architectures (Google Ads, Meta Ads Manager).",
          "Set up tracking pixels and configure landing pages to optimize conversion funnels."
        ]
      },
      {
        phase: "Phase 3: Analytics & Conversion",
        milestones: [
          "Master tracking tools (Google Analytics 4, Tag Manager, UTM tagging structure).",
          "Learn to run and analyze A/B split testing experiments for webpages.",
          "Calculate core metrics (Customer Acquisition Cost, Lifetime Value, ROI, Click-Through Rates).",
          "Synthesize advertising reports, identifying cost leaks and optimization opportunities."
        ]
      },
      {
        phase: "Phase 4: Marketing Campaigns & Strategy",
        milestones: [
          "Create an end-to-end digital marketing campaign proposal for a real or mock business.",
          "Outline the timeline budget distribution, target audience profiles, and KPIs.",
          "Publish visual design assets and copy templates on a clean digital portfolio page.",
          "Acquire official certifications (HubSpot Content Marketing, Google Search Ads)."
        ]
      }
    ],
    resources: [
      { name: "HubSpot Academy", description: "Free marketing certifications on inbound, email, and social strategies.", url: "https://academy.hubspot.com" },
      { name: "Google Digital Garage", description: "Fundamentals of digital marketing with certificate options.", url: "https://learndigital.withgoogle.com" },
      { name: "Moz Beginner's Guide to SEO", description: "The industry-standard tutorial explaining modern search engine ranking algorithms.", url: "https://moz.com/beginners-guide-to-seo" }
    ],
    videoId: "j5mC3B-iW3M"
  },
  {
    id: "biology-sciences",
    name: "Biology & Life Sciences",
    category: "Science & Research",
    iconName: "Dna",
    description: "Analyze cellular mechanisms, design genetics protocols, and conduct clinical research studies.",
    signalProfile: {
      analysis: 9,
      exploration: 8,
      "helping-others": 7,
      structure: 6
    },
    roadmap: [
      {
        phase: "Phase 1: Foundations & Scientific Method",
        milestones: [
          "Review core biology principles (cell structure, molecular biology, biochemistry pathways).",
          "Understand hypothesis formulation, controls, variables, and experiment designs.",
          "Practice reading and dissecting published peer-reviewed research papers.",
          "Study basic ethics guidelines concerning bio-safety and animal/human trials."
        ]
      },
      {
        phase: "Phase 2: Laboratory Techniques & Data",
        milestones: [
          "Master common lab tools (pipetting techniques, microscopy, centrifuge safety).",
          "Understand laboratory assays (PCR sequences, gel electrophoresis, ELISA assays).",
          "Maintain a precise, timestamped lab notebook document tracking details.",
          "Learn standard statistics tools (T-tests, ANOVA, statistical significance levels)."
        ]
      },
      {
        phase: "Phase 3: Bioinformatics & Advanced Research",
        milestones: [
          "Learn basic scripting (R or Python) to query public gene banks and genomic databases.",
          "Familiarize yourself with molecular modeling platforms and cell culture setups.",
          "Design a mock research proposal outlining timeline, budget, and experimental steps.",
          "Participate in local science colloquiums or assist in a university research laboratory."
        ]
      },
      {
        phase: "Phase 4: Publication & Thesis Steps",
        milestones: [
          "Write a comprehensive literature review summarizing research on a selected biological topic.",
          "Draft a mock scientific poster demonstrating experiment outcomes and charts.",
          "Identify career specialization preferences (Biotech, Ecology, Clinical Trials, Bio-Medicine).",
          "Present your research summaries to peers, preparing for thesis critiques."
        ]
      }
    ],
    resources: [
      { name: "NCBI Resources", description: "National Center for Biotechnology Information genomic databases.", url: "https://www.ncbi.nlm.nih.gov" },
      { name: "Nature Journal Articles", description: "Leading weekly international journal publishing peer-reviewed science papers.", url: "https://www.nature.com" },
      { name: "Khan Academy Biology", description: "In-depth video tutorials covering advanced cellular and molecular biology.", url: "https://www.khanacademy.org/science/biology" }
    ],
    videoId: "F37n45Pq-yY"
  },
  {
    id: "psychology",
    name: "Psychology",
    category: "Humanities & Social Impact",
    iconName: "HeartHandshake",
    description: "Support mental health, research cognitive patterns, and analyze behavioral development.",
    signalProfile: {
      "helping-others": 9,
      social: 8,
      analysis: 7,
      exploration: 6
    },
    roadmap: [
      {
        phase: "Phase 1: Psychology Foundations",
        milestones: [
          "Study major historical theories (Freudian concepts, Behavioral conditioning, Cognitive models).",
          "Learn brain anatomy basics, neurotransmitter functions, and sensory systems.",
          "Understand developmental phases, from early childhood to aging stages.",
          "Read popular psychological summaries explaining cognitive biases and personality frameworks."
        ]
      },
      {
        phase: "Phase 2: Research & Statistics",
        milestones: [
          "Understand research designs (case studies, longitudinal research, double-blind trials).",
          "Learn descriptive and inferential statistics used to calculate clinical scores.",
          "Study cognitive behavioral frameworks, emotional regulations, and stress mitigations.",
          "Draft a literature summary analyzing a specific mental health condition."
        ]
      },
      {
        phase: "Phase 3: Counseling & Ethics",
        milestones: [
          "Learn active listening protocols, building trust, and empathy communications.",
          "Familiarize yourself with DSM-5 diagnostic frameworks and mental classifications.",
          "Understand legal confidentiality standards, HIPAA, and ethical boundaries.",
          "Volunteer at local crisis help hotlines or community support clinics."
        ]
      },
      {
        phase: "Phase 4: Professional Case Work",
        milestones: [
          "Select a specialty career path (Clinical, Counseling, Industrial/Organizational, Neuropsychology).",
          "Conduct a mock case-study analysis, outlining assessments and therapy interventions.",
          "Explore graduate school application guidelines, GRE prep, and internship options.",
          "Write a personal professional ethics statement detailing your therapy approach."
        ]
      }
    ],
    resources: [
      { name: "American Psychological Association", description: "Official resource hub detailing research standards and clinical practices.", url: "https://www.apa.org" },
      { name: "Simply Psychology", description: "Highly accessible articles explaining major cognitive theories and experiments.", url: "https://www.simplypsychology.org" },
      { name: "Psychology Today", description: "Articles covering behavioral analysis and diagnostic guidance directories.", url: "https://www.psychologytoday.com" }
    ],
    videoId: "vo4pMVb0R6M"
  }
];

export const CATEGORIES = [
  "Tech",
  "Creative & Design",
  "Science & Research",
  "Business & Commerce",
  "Humanities & Social Impact"
];

// Helper to match user signals to domain profiles
export const calculateMatches = (userSignals) => {
  // If signals are weak or non-existent, return empty
  if (!userSignals || Object.keys(userSignals).length === 0) {
    return [];
  }

  return FLAGSHIP_DOMAINS.map(domain => {
    let matchScore = 0;
    let maxPossible = 0;

    Object.entries(domain.signalProfile).forEach(([signalName, targetWeight]) => {
      const userVal = userSignals[signalName]?.score || 0;
      // Calculate how close the user score is to the target weight (ideal fit)
      // High user score matching high target weight is the best score
      matchScore += Math.min(userVal, targetWeight) * 1.2 + (userVal > 5 ? 2 : 0);
      maxPossible += targetWeight * 1.2 + 2;
    });

    const percent = maxPossible > 0 ? Math.min(Math.round((matchScore / maxPossible) * 100), 100) : 0;
    
    // Determine honest confidence
    let confidence = "Worth exploring";
    if (percent >= 75) {
      confidence = "Strong match";
    }

    // Generate specific encouragement line based on the user's highest signal that matches the domain
    const domainSignals = Object.keys(domain.signalProfile);
    const highestUserMatchingSignal = domainSignals
      .map(sig => ({ name: sig, score: userSignals[sig]?.score || 0 }))
      .sort((a, b) => b.score - a.score)[0];

    let fitReason = `Matches your traits in systematic workflow structures.`;
    if (highestUserMatchingSignal && highestUserMatchingSignal.score > 5) {
      const sigName = highestUserMatchingSignal.name;
      const evidenceText = userSignals[sigName]?.evidence || "";
      
      switch (sigName) {
        case 'creation':
          fitReason = `A great fit because you enjoy hands-on building, as shown when you described: ${evidenceText || "making custom things"}.`;
          break;
        case 'exploration':
          fitReason = `Fits your curiosity and search for new patterns, aligning with: ${evidenceText || "exploring and learning"}.`;
          break;
        case 'analysis':
          fitReason = `Perfect for your investigative nature and data skills: ${evidenceText || "analyzing complex facts"}.`;
          break;
        case 'structure':
          fitReason = `Matches your skill in organizing and correcting systems: ${evidenceText || "fixing or plans"}.`;
          break;
        case 'visual':
          fitReason = `Aligns with your aesthetic sense and graphic design style: ${evidenceText || "design layouts"}.`;
          break;
        case 'logic':
          fitReason = `Suits your logical problem-solving and coding interests: ${evidenceText || "logical puzzles"}.`;
          break;
        case 'social':
          fitReason = `Great match for your interest in teamwork, sharing, and communication.`;
          break;
        case 'helping-others':
          fitReason = `Committed to mentorship and human support, reflecting: ${evidenceText || "supporting others"}.`;
          break;
      }
    }

    return {
      ...domain,
      matchPercentage: percent,
      confidence,
      fitReason,
      isFlagship: true
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
};
