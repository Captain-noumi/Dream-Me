import React, { useState } from 'react';
import { Sparkles, Compass, HelpCircle } from 'lucide-react';
import Phase1Interview from './components/Phase1Interview';
import Phase2Recommendations from './components/Phase2Recommendations';
import Phase3Dashboard from './components/Phase3Dashboard';

export default function App() {
  const [phase, setPhase] = useState('interview'); // 'interview' | 'recommendations' | 'dashboard'
  const [answers, setAnswers] = useState([]);
  const [signals, setSignals] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);

  const handleInterviewComplete = (finalAnswers, evaluationResult) => {
    setAnswers(finalAnswers);
    if (evaluationResult && evaluationResult.signals) {
      setSignals(evaluationResult.signals);
      setMatches(evaluationResult.matches || []);
    } else {
      setSignals(evaluationResult);
      setMatches([]);
    }
    setPhase('recommendations');
  };

  const handleSelectDomain = (domain) => {
    setSelectedDomain(domain);
    setPhase('dashboard');
  };

  const handleReset = () => {
    setAnswers([]);
    setSignals(null);
    setMatches([]);
    setSelectedDomain(null);
    setPhase('interview');
  };

  const handleTriggerRefinement = (updatedAnswers, evaluationResult) => {
    setAnswers(updatedAnswers);
    if (evaluationResult && evaluationResult.signals) {
      setSignals(evaluationResult.signals);
      setMatches(evaluationResult.matches || []);
    } else {
      setSignals(evaluationResult);
    }
  };

  const handleSwitchDomain = (domain) => {
    setSelectedDomain(domain);
  };

  return (
    <div className="app-container">
      {/* 1. Global Navigation Header */}
      <header className="app-header">
        <div className="app-logo">
          <Sparkles className="logo-sparkle" size={24} style={{ color: 'var(--accent)' }} />
          <span>Dream Me</span>
          <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--text-secondary)', marginLeft: '10px', display: 'inline-flex', alignItems: 'center' }}>
            Find your dream here!!
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {phase === 'recommendations' && (
            <button className="btn btn-outline" onClick={handleReset}>
              Start Over 🔄
            </button>
          )}
          {phase === 'dashboard' && (
            <>
              <button className="btn btn-outline" onClick={() => setPhase('recommendations')}>
                ← Back to Matches
              </button>
              <button className="btn btn-secondary" onClick={handleReset}>
                Reset Discovery 🔄
              </button>
            </>
          )}
        </div>
      </header>

      {/* 2. Page Router State Machine */}
      <main style={{ flexGrow: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        {phase === 'interview' && (
          <Phase1Interview onComplete={handleInterviewComplete} />
        )}
        
        {phase === 'recommendations' && (
          <Phase2Recommendations 
            signals={signals} 
            answers={answers}
            matches={matches}
            onSelectDomain={handleSelectDomain} 
            onTriggerRefinement={handleTriggerRefinement}
          />
        )}
        
        {phase === 'dashboard' && (
          <Phase3Dashboard
            selectedDomain={selectedDomain}
            allMatchedDomains={matches}
            answers={answers}
            signals={signals}
            onReset={handleReset}
            onSwitchDomain={handleSwitchDomain}
          />
        )}
      </main>

    </div>
  );
}

// Simple local duplicate matching rules for App rendering sidebar domains list
// This avoids code duplication while keeping matchedDomains arrays aligned
import { FLAGSHIP_DOMAINS } from './utils/domainsData';
const DYNAMIC_DOMAINS_MOCK = [
  { id: "cybersecurity", name: "Cybersecurity Analyst", category: "Tech", isFlagship: false, iconName: "Shield", signalProfile: { logic: 8, structure: 8, analysis: 7, creation: 5 } },
  { id: "artificial-intelligence", name: "AI & Machine Learning Engineer", category: "Tech", isFlagship: false, iconName: "Brain", signalProfile: { logic: 9, analysis: 9, creation: 7, exploration: 6 } },
  { id: "illustration-animation", name: "Illustration & Animation", category: "Creative & Design", isFlagship: false, iconName: "Palette", signalProfile: { visual: 9, creation: 8 } },
  { id: "performing-arts-music", name: "Performing Arts & Music", category: "Creative & Design", isFlagship: false, iconName: "Music", signalProfile: { social: 9, creation: 8, visual: 7, exploration: 6 } },
  { id: "cinema-filmmaking", name: "Cinema & Filmmaking", category: "Creative & Design", isFlagship: false, iconName: "Film", signalProfile: { creation: 9, visual: 8, structure: 7, exploration: 7 } },
  { id: "physics-chemistry", name: "Physics & Chemistry Research", category: "Science & Research", isFlagship: false, iconName: "Atom", signalProfile: { analysis: 9, exploration: 7, logic: 7 } },
  { id: "environmental-science", name: "Environmental Science", category: "Science & Research", isFlagship: false, iconName: "Globe", signalProfile: { exploration: 8, analysis: 7 } },
  { id: "product-management", name: "Product Management", category: "Business & Commerce", isFlagship: false, iconName: "Briefcase", signalProfile: { social: 8, structure: 8 } },
  { id: "entrepreneurship", name: "Entrepreneurship & Innovation", category: "Business & Commerce", isFlagship: false, iconName: "Lightbulb", signalProfile: { social: 8, creation: 8 } },
  { id: "journalism", name: "Journalism & Media Writing", category: "Humanities & Social Impact", isFlagship: false, iconName: "BookOpen", signalProfile: { social: 8, exploration: 8 } },
  { id: "social-work", name: "Social Work & Support Services", category: "Humanities & Social Impact", isFlagship: false, iconName: "Users", signalProfile: { "helping-others": 9, social: 8 } },
  { id: "public-policy", name: "Public Policy & Urban Planning", category: "Humanities & Social Impact", isFlagship: false, iconName: "Scale", signalProfile: { analysis: 8, structure: 7 } }
];

const FLAGSHIP_DOMAINS_MOCK = (signals) => {
  if (!signals) return [];
  const list = [...FLAGSHIP_DOMAINS, ...DYNAMIC_DOMAINS_MOCK];
  return list.map(domain => {
    let matchScore = 0;
    let maxPossible = 0;
    Object.entries(domain.signalProfile).forEach(([signalName, targetWeight]) => {
      const userVal = signals[signalName]?.score || 0;
      matchScore += Math.min(userVal, targetWeight) * 1.2 + (userVal > 5 ? 2 : 0);
      maxPossible += targetWeight * 1.2 + 2;
    });
    const percent = maxPossible > 0 ? Math.min(Math.round((matchScore / maxPossible) * 100), 100) : 0;
    let confidence = "Worth exploring";
    if (percent >= 75) {
      confidence = "Strong match";
    }
    return { ...domain, matchPercentage: percent, confidence };
  });
};
