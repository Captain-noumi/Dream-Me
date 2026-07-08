import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { CATEGORIES, FLAGSHIP_DOMAINS } from '../utils/domainsData';
import { safeFetchWatsonx } from '../utils/apiClient';

// Dynamic domains data set (AI-suggested)
const DYNAMIC_DOMAINS = [
  {
    id: "cybersecurity",
    name: "Cybersecurity Analyst",
    category: "Tech",
    iconName: "Shield",
    description: "Protect systems, audit networks, and defend digital infrastructure against cyber threats.",
    signalProfile: { logic: 8, structure: 8, analysis: 7, creation: 5 },
    isFlagship: false
  },
  {
    id: "artificial-intelligence",
    name: "AI & Machine Learning Engineer",
    category: "Tech",
    iconName: "Brain",
    description: "Train neural networks, program models, and design intelligent systems.",
    signalProfile: { logic: 9, analysis: 9, creation: 7, exploration: 6 },
    isFlagship: false
  },
  {
    id: "illustration-animation",
    name: "Illustration & Animation",
    category: "Creative & Design",
    iconName: "Palette",
    description: "Draw characters, animate storyboards, and craft vector art for digital media.",
    signalProfile: { visual: 9, creation: 8, exploration: 6, social: 5 },
    isFlagship: false
  },
  {
    id: "performing-arts-music",
    name: "Performing Arts & Music",
    category: "Creative & Design",
    iconName: "Music",
    description: "Express stories and emotions through dance choreography, professional singing, music composition, or live theatre performance.",
    signalProfile: { social: 9, creation: 8, visual: 7, exploration: 6 },
    isFlagship: false
  },
  {
    id: "cinema-filmmaking",
    name: "Cinema & Filmmaking",
    category: "Creative & Design",
    iconName: "Film",
    description: "Direct scenes, write screenplays, capture frames, and produce audio-visual stories for cinema and digital media.",
    signalProfile: { creation: 9, visual: 8, structure: 7, exploration: 7 },
    isFlagship: false
  },
  {
    id: "physics-chemistry",
    name: "Physics & Chemistry Research",
    category: "Science & Research",
    iconName: "Atom",
    description: "Formulate compounds, study quantum systems, and publish academic research models.",
    signalProfile: { analysis: 9, exploration: 7, logic: 7, structure: 6 },
    isFlagship: false
  },
  {
    id: "environmental-science",
    name: "Environmental Science",
    category: "Science & Research",
    iconName: "Globe",
    description: "Study ecological systems, map conservation policies, and fight climate change.",
    signalProfile: { exploration: 8, analysis: 7, "helping-others": 6, social: 6 },
    isFlagship: false
  },
  {
    id: "product-management",
    name: "Product Management",
    category: "Business & Commerce",
    iconName: "Briefcase",
    description: "Coordinate team timelines, prioritize feature backlogs, and launch product updates.",
    signalProfile: { social: 8, structure: 8, analysis: 6, logic: 6 },
    isFlagship: false
  },
  {
    id: "entrepreneurship",
    name: "Entrepreneurship & Innovation",
    category: "Business & Commerce",
    iconName: "Lightbulb",
    description: "Fund startups, draft pitch models, and assemble team operations from scratch.",
    signalProfile: { social: 8, creation: 8, exploration: 7, structure: 6 },
    isFlagship: false
  },
  {
    id: "journalism",
    name: "Journalism & Media Writing",
    category: "Humanities & Social Impact",
    iconName: "BookOpen",
    description: "Investigate stories, interview subjects, and publish columns covering global issues.",
    signalProfile: { social: 8, exploration: 8, "helping-others": 6, analysis: 6 },
    isFlagship: false
  },
  {
    id: "social-work",
    name: "Social Work & Support Services",
    category: "Humanities & Social Impact",
    iconName: "Users",
    description: "Offer therapy resources, navigate public support programs, and assist families in need.",
    signalProfile: { "helping-others": 9, social: 8, exploration: 5, structure: 5 },
    isFlagship: false
  },
  {
    id: "public-policy",
    name: "Public Policy & Urban Planning",
    category: "Humanities & Social Impact",
    iconName: "Scale",
    description: "Audit housing plans, outline municipal budgets, and write local laws.",
    signalProfile: { analysis: 8, structure: 7, "helping-others": 7, social: 6 },
    isFlagship: false
  }
];

const DOMAIN_DESCRIPTIONS = {
  "software-development": "Build applications, design websites, and orchestrate the software running our digital world.",
  "data-science": "Extract insights from massive datasets, build predictive models, and guide strategic decisions.",
  "ui-ux-design": "Research user behavior, draft interfaces, and design premium, highly accessible digital products.",
  "game-development": "Design game mechanics, script physics systems, and craft immersive environments.",
  "finance": "Manage capital, structure investments, analyze corporate earnings, and model market trends.",
  "digital-marketing": "Launch advertising campaigns, design SEO strategies, audit social media, and track conversions.",
  "biology-sciences": "Analyze cellular mechanisms, design genetics protocols, and conduct clinical research studies.",
  "psychology": "Support mental health, research cognitive patterns, and analyze behavioral development.",
  "cybersecurity": "Protect systems, audit networks, and defend digital infrastructure against cyber threats.",
  "artificial-intelligence": "Train neural networks, program models, and design intelligent systems.",
  "illustration-animation": "Draw characters, animate storyboards, and craft vector art for digital media.",
  "performing-arts-music": "Express stories and emotions through dance choreography, professional singing, music composition, or live theatre performance.",
  "cinema-filmmaking": "Direct scenes, write screenplays, capture frames, and produce audio-visual stories for cinema and digital media.",
  "film-criticism": "Analyze cinematic themes, deconstruct storytelling elements, and write professional analytical media reviews.",
  "creative-writing": "Write novels, scripts, screenplays, and articles using advanced narrative structures and creative prose.",
  "bioinformatics": "Apply algorithmic coding tools to study genetic structures and biological datasets.",
  "environmental-science": "Study ecological systems, map conservation policies, and fight climate change.",
  "physics-chemistry": "Formulate compounds, study quantum systems, and publish academic research models.",
  "astronomy-astrophysics": "Model star lifecycles, study galaxy movements, and analyze deep space data feeds.",
  "cognitive-neuroscience": "Study brain mapping patterns, sensory signals, and behavioral neurology.",
  "product-management": "Coordinate team timelines, prioritize feature backlogs, and launch product updates.",
  "entrepreneurship": "Fund startups, draft pitch models, and assemble team operations from scratch.",
  "actuarial-science": "Calculate insurance pricing models, audit risk ratios, and forecast life event likelihoods.",
  "journalism": "Investigate stories, interview subjects, and publish columns covering global issues.",
  "social-work": "Offer therapy resources, navigate public support programs, and assist families in need.",
  "public-policy": "Audit housing plans, outline municipal budgets, and write local laws.",
  "anthropology-culture": "Study ancient relics, trace language roots, and write ethnographies about human social history.",
  "speech-pathology": "Diagnose communication disorders, create vocal exercises, and help patients regain speaking skills."
};

// Helper to render Lucide icons dynamically
const DomainIcon = ({ name, className }) => {
  const IconComponent = Icons[name] || Icons.HelpCircle;
  return <IconComponent className={className} size={24} />;
};

export default function Phase2Recommendations({ signals, answers, matches, onSelectDomain, onTriggerRefinement }) {
  const [refineQuestion, setRefineQuestion] = useState(null);
  const [refineAnswer, setRefineAnswer] = useState('');
  const [isGeneratingRefinement, setIsGeneratingRefinement] = useState(false);
  const [isSubmittingRefinement, setIsSubmittingRefinement] = useState(false);

  // Group domains by categories
  const domainsByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = (matches || []).filter(d => d.category === cat);
    return acc;
  }, {});

  // Find if there are any "Strong matches" or "Worth exploring" (> 50%)
  const hasConfidentMatch = (matches || []).some(d => d.matchPercentage >= 50);

  // Request a dynamic refinement question from Watsonx
  const handleRequestRefinement = async () => {
    setIsGeneratingRefinement(true);
    try {
      const data = await safeFetchWatsonx({
        action: 'generate_questions',
        answers: answers
      });
      setRefineQuestion(data.questions[0] || "Could you detail what type of projects you prefer organizing?");
    } catch (e) {
      setRefineQuestion("Do you prefer working with tangible materials (like building, drawing, physical setups) or digital/abstract systems (like software, numbers, concepts)?");
    } finally {
      setIsGeneratingRefinement(false);
    }
  };

  // Submit refinement answer and calculate updated signals
  const handleSubmitRefinement = async (e) => {
    e.preventDefault();
    if (!refineAnswer.trim()) return;

    setIsSubmittingRefinement(true);
    const updatedAnswers = [...answers, { question: refineQuestion, answer: refineAnswer }];
    
    try {
      const data = await safeFetchWatsonx({
        action: 'evaluate_signals',
        answers: updatedAnswers
      });
      onTriggerRefinement(updatedAnswers, data.signals);
      // Reset refinement state
      setRefineQuestion(null);
      setRefineAnswer('');
    } catch (err) {
      // Offline fallback: add random score bumps to signals mentioned in answer
      const updatedSignals = { ...signals };
      const ansLower = refineAnswer.toLowerCase();
      if (ansLower.includes('physical') || ansLower.includes('art') || ansLower.includes('drawing')) {
        if (updatedSignals.visual) updatedSignals.visual.score = Math.min(10, updatedSignals.visual.score + 2);
        if (updatedSignals.creation) updatedSignals.creation.score = Math.min(10, updatedSignals.creation.score + 2);
      } else {
        if (updatedSignals.logic) updatedSignals.logic.score = Math.min(10, updatedSignals.logic.score + 2);
        if (updatedSignals.analysis) updatedSignals.analysis.score = Math.min(10, updatedSignals.analysis.score + 2);
      }
      onTriggerRefinement(updatedAnswers, updatedSignals);
      setRefineQuestion(null);
      setRefineAnswer('');
    } finally {
      setIsSubmittingRefinement(false);
    }
  };

  const traitTitles = {
    creation: { title: "The Builder", desc: "Motivated by constructing tangible products and coding software." },
    exploration: { title: "The Seeker", desc: "Driven by discovery, exploring environments, and learning." },
    analysis: { title: "The Investigator", desc: "Prefers logic analysis, scientific research, and facts." },
    structure: { title: "The Organizer", desc: "Thrives on structured schedules and fixing system bugs." },
    visual: { title: "The Artist", desc: "Enjoys layouts, graphic design, and UI aesthetics." },
    logic: { title: "The Thinker", desc: "Computes abstract algorithms and logical problems." },
    social: { title: "The Connecter", desc: "Excels in presentations, public sharing, and teams." },
    "helping-others": { title: "The Guide", desc: "Committed to teaching, mentoring, and medical support." }
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      {/* Page Header */}
      <div className="recommendations-header">
        <h2 className="recommendations-title">Your Career Matches</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          We analyzed your conversational answers to find matching career fields. Select any domain below to view your personalized roadmap.
        </p>
      </div>

      {/* 1. What We Learned About You Section (MANDATORY FLOOR VALUE) */}
      <div className="insights-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icons.Sparkles style={{ color: 'var(--accent)' }} size={22} />
              What We Learned About You
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              These cognitive and behavioral traits were highlighted from your interview.
            </p>
          </div>
          
          {/* Refinement Button */}
          {!refineQuestion && (
            <button 
              className="btn btn-secondary" 
              onClick={handleRequestRefinement}
              disabled={isGeneratingRefinement}
            >
              {isGeneratingRefinement ? (
                <>
                  <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></span>
                  Generating Question...
                </>
              ) : (
                <>
                  <Icons.HelpCircle size={16} />
                  Refine My Signals 🔄
                </>
              )}
            </button>
          )}
        </div>

        {/* Refinement Inline Question */}
        {refineQuestion && (
          <form onSubmit={handleSubmitRefinement} className="card animate-scale-in" style={{ marginTop: '20px', padding: '20px', backgroundColor: 'var(--bg-secondary)' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icons.RefreshCw size={16} className="spin" style={{ animation: 'spin 3s infinite linear' }} />
              Refinement Question:
            </h4>
            <p style={{ fontSize: '15px', marginBottom: '16px', fontWeight: '500' }}>{refineQuestion}</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                className="chat-input"
                value={refineAnswer}
                onChange={(e) => setRefineAnswer(e.target.value)}
                placeholder="Elaborate on your preference to refine results..."
                required
                disabled={isSubmittingRefinement}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmittingRefinement || !refineAnswer.trim()}
              >
                {isSubmittingRefinement ? "Analyzing..." : "Submit Answer"}
              </button>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setRefineQuestion(null)}
                disabled={isSubmittingRefinement}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="insights-grid">
          {Object.entries(signals || {})
            .sort((a, b) => b[1].score - a[1].score)
            .map(([key, val]) => {
              const trait = traitTitles[key] || { title: key, desc: "Trait evaluated from responses." };
              return (
                <div key={key} className="insight-item">
                  <div className="insight-title">
                    <span style={{ color: val.score > 6 ? 'var(--accent)' : 'var(--text-secondary)' }}>
                      {trait.title}
                    </span>
                    <span style={{ fontSize: '11px', background: 'var(--bg-primary)', padding: '2px 6px', borderRadius: '4px', marginLeft: 'auto' }}>
                      {val.score}/10
                    </span>
                  </div>
                  
                  {/* Progress fill */}
                  <div className="progress-track" style={{ height: '4px', marginBottom: '10px' }}>
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${val.score * 10}%`, 
                        backgroundColor: val.score > 6 ? 'var(--accent)' : 'var(--text-secondary)' 
                      }}
                    ></div>
                  </div>

                  <div className="insight-val">{trait.desc}</div>
                  
                  {val.evidence && val.evidence !== "General responses." && (
                    <div className="insight-quote">
                      Evidence: {val.evidence}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Weak match fallback warnings */}
      {!hasConfidentMatch && (
        <div className="card" style={{ border: '1px solid rgba(255, 149, 0, 0.3)', backgroundColor: 'rgba(255, 149, 0, 0.05)', marginBottom: '32px' }}>
          <h4 style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Icons.AlertTriangle size={20} />
            Honest Matching Assessment: Mixed Signals
          </h4>
          <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
            Your interview responses showed a highly balanced or mixed trait profile. We haven't found a single domain matching with high confidence. We recommend using the <strong>"Refine My Signals"</strong> option above to give us more data, or explore the fields below marked <strong>"Worth exploring"</strong> to see what resonates.
          </p>
        </div>
      )}

      {/* Recommended Career Categories */}
      {CATEGORIES.map(category => {
        const categoryDomains = domainsByCategory[category] || [];
        if (categoryDomains.length === 0) return null;

        return (
          <section key={category} className="category-group">
            <h3 className="category-title">
              {category === "Tech" && <Icons.Laptop size={20} />}
              {category === "Creative & Design" && <Icons.Compass size={20} />}
              {category === "Science & Research" && <Icons.FlaskConical size={20} />}
              {category === "Business & Commerce" && <Icons.Coins size={20} />}
              {category === "Humanities & Social Impact" && <Icons.Award size={20} />}
              {category}
            </h3>
            
            <div className="cards-grid">
              {categoryDomains.map(domain => {
                const isStrong = domain.confidence === "Strong match";
                return (
                  <div 
                    key={domain.id} 
                    className="rec-card"
                    onClick={() => onSelectDomain(domain)}
                  >
                    <div>
                      <div className="rec-card-icon">
                        <DomainIcon name={domain.iconName} />
                      </div>
                      <h4 className="rec-card-title">{domain.name}</h4>
                      <p className="rec-card-description">{domain.description || DOMAIN_DESCRIPTIONS[domain.id] || "Develop specialized skills and launch your career in this dynamic field."}</p>
                      
                      <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        {domain.fitReason}
                      </div>
                    </div>

                    <div className="rec-card-footer">
                      <span className={`badge ${isStrong ? 'badge-strong' : 'badge-explore'}`}>
                        {isStrong ? (
                          <>
                            <Icons.CheckCircle2 size={12} />
                            Strong Match ({domain.matchPercentage}%)
                          </>
                        ) : (
                          <>
                            <Icons.HelpCircle size={12} />
                            Worth Exploring ({domain.matchPercentage}%)
                          </>
                        )}
                      </span>
                      
                      {!domain.isFlagship && (
                        <span className="badge badge-ai" title="Roadmap text generated live via watsonx">
                          AI-Suggested
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
