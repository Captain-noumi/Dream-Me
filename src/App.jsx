import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, HelpCircle, Sun, Moon } from 'lucide-react';
import Phase1Interview from './components/Phase1Interview';
import Phase2Recommendations from './components/Phase2Recommendations';
import Phase3Dashboard from './components/Phase3Dashboard';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dream-me-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dream-me-theme', theme);
  }, [theme]);

  const [phase, setPhase] = useState('interview'); // 'interview' | 'recommendations' | 'dashboard'
  const [answers, setAnswers] = useState([]);
  const [signals, setSignals] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: "Welcome to Dream Me. Don't worry if you're clueless—we'll figure this out together. To start, what is one hobby, activity, or subject you've spent time on recently that didn't feel like a chore?" }
  ]);

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
    setShowHistory(false);
    setMessages([
      { sender: 'assistant', text: "Welcome to Dream Me. Don't worry if you're clueless—we'll figure this out together. To start, what is one hobby, activity, or subject you've spent time on recently that didn't feel like a chore?" }
    ]);
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
          <Sparkles className="logo-sparkle" size={24} style={{ color: 'var(--logo-color)' }} />
          <span>Dream Me</span>
          <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--text-secondary)', marginLeft: '10px', display: 'inline-flex', alignItems: 'center' }}>
            Find your dream here!!
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            className="btn btn-outline" 
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            style={{ 
              padding: '10px', 
              width: '40px', 
              height: '40px', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: '50%',
              minWidth: '40px'
            }}
            title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {messages.length > 1 && (
            <button 
              className={`btn ${showHistory ? 'btn-secondary' : 'btn-outline'}`}
              onClick={() => setShowHistory(prev => !prev)}
              style={{ gap: '6px' }}
            >
              💬 {showHistory ? "Hide Conversation" : "View Conversation"}
            </button>
          )}

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
          <Phase1Interview 
            messages={messages}
            setMessages={setMessages}
            answers={answers}
            setAnswers={setAnswers}
            onComplete={handleInterviewComplete} 
          />
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

      {/* 3. Sliding Conversation History Panel */}
      {showHistory && (
        <div className="history-sidebar-overlay" onClick={() => setShowHistory(false)}>
          <div className="history-sidebar animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="history-sidebar-header">
              <h3>Conversation History</h3>
              <button className="history-sidebar-close" onClick={() => setShowHistory(false)}>×</button>
            </div>
            <div className="history-sidebar-content">
              {messages.map((msg, index) => (
                <div key={index} className={`history-bubble ${msg.sender}`}>
                  <div className="bubble-text">{msg.text}</div>
                  <div className="bubble-meta">
                    {msg.sender === 'assistant' ? 'Dream Me Advisor' : 'You'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
