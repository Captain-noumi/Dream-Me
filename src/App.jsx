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
