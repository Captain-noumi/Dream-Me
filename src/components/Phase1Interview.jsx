import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, AlertCircle } from 'lucide-react';
import { safeFetchWatsonx } from '../utils/apiClient';

const OPENING_QUESTION = "Welcome to Dream Me. Don't worry if you're clueless—we'll figure this out together. To start, what is one hobby, activity, or subject you've spent time on recently that didn't feel like a chore?";
const TOTAL_QUESTIONS_TARGET = 5;

export default function Phase1Interview({ 
  messages, 
  setMessages, 
  answers, 
  setAnswers, 
  onComplete 
}) {
  const [currentQuestionText, setCurrentQuestionText] = useState(OPENING_QUESTION);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    setInputValue('');
    setApiError(null);

    // 1. Add user message
    const updatedMessages = [...messages, { sender: 'user', text }];
    setMessages(updatedMessages);

    // 2. Save answer
    const newAnswers = [...answers, { question: currentQuestionText, answer: text }];
    setAnswers(newAnswers);

    const answeredCount = newAnswers.length;

    if (answeredCount === TOTAL_QUESTIONS_TARGET) {
      // All questions completed! Perform signal evaluation
      setIsLoading(true);
      try {
        const data = await safeFetchWatsonx({
          action: 'evaluate_signals',
          answers: newAnswers
        });
        onComplete(newAnswers, data);
      } catch (err) {
        console.error("Evaluation error, creating client fallback signals:", err);
        const clientMockSignals = simulateSignalsClientSide(newAnswers);
        onComplete(newAnswers, { signals: clientMockSignals, matches: [] });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Fetch next dynamic question from Watsonx
      setIsLoading(true);
      try {
        const data = await safeFetchWatsonx({
          action: 'generate_questions',
          answers: newAnswers
        });
        
        const nextQText = data.question || (data.questions && data.questions[0]) || "Tell me more about how you explore new topics?";
        setCurrentQuestionText(nextQText);
        setMessages([
          ...updatedMessages,
          { sender: 'assistant', text: nextQText }
        ]);
      } catch (err) {
        console.error(err);
        setApiError("Network timeout. Connecting local counselor backup...");
        // Fallback standard dynamic questions depending on length
        const fallbackQs = [
          "What specifically do you enjoy most about this hobby or activity?",
          "Would you generally prefer fixing/improving something broken, or designing/building something new from scratch?",
          "When you are learning a new tool or hobby, do you prefer reading the instructions first, or just diving in?",
          "Would you rather present your finished ideas to a group of people, or work behind the scenes to optimize the details?"
        ];
        const nextQText = fallbackQs[answeredCount - 1] || "Can you share what other activities you enjoy?";
        setCurrentQuestionText(nextQText);
        setMessages([
          ...updatedMessages,
          { sender: 'assistant', text: nextQText }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Simple client-side fallback if Watsonx token expires or fails
  const simulateSignalsClientSide = (allAnswers) => {
    const text = allAnswers.map(a => a.answer).join(' ').toLowerCase();
    const categories = ['creation', 'exploration', 'analysis', 'structure', 'visual', 'logic', 'social', 'helping-others'];
    const mockSignals = {};
    
    categories.forEach(cat => {
      let score = 4;
      let evidence = "Your conversational trends.";
      let reason = "Indicates basic comfort levels in this trait.";

      if (cat === 'creation' && (text.includes('make') || text.includes('build') || text.includes('code') || text.includes('art'))) {
        score = 8;
        evidence = "Preference for building/making elements.";
      } else if (cat === 'logic' && (text.includes('math') || text.includes('logic') || text.includes('code') || text.includes('puzzle'))) {
        score = 8;
        evidence = "Analytical focus during the interview.";
      }

      mockSignals[cat] = { score, evidence, reason };
    });
    return mockSignals;
  };

  const handleKeyDown = (e) => {
    // If Enter is pressed without Shift, submit the message
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Progress Calculation
  const percentComplete = Math.round((answers.length / TOTAL_QUESTIONS_TARGET) * 100);

  return (
    <div className="card chat-window animate-scale-in" style={{ width: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
        <span style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Discovery Interview Phase (Conversational)
        </span>
      </div>

      {/* Progress */}
      <div className="progress-meter">
        <span>Signal Tagging Interview</span>
        <span>{percentComplete}% Complete</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percentComplete}%` }}></div>
      </div>

      {apiError && (
        <div style={{ display: 'flex', gap: '8px', padding: '12px 16px', background: 'rgba(255, 59, 48, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '13px', alignItems: 'center' }}>
          <AlertCircle size={16} />
          <span>Note: {apiError}</span>
        </div>
      )}

      {/* Messages History */}
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender}`}>
            <div>{msg.text}</div>
            <div className="chat-bubble-meta">
              {msg.sender === 'assistant' ? 'Dream Me Advisor' : 'You'}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-bubble assistant" style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', padding: '12px 20px' }}>
            <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', marginRight: '8px' }}></span>
            <span>Reflecting on signals...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input / Controls */}
      <div className="chat-input-area">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          style={{ display: 'flex', width: '100%', gap: '12px' }}
        >
          <textarea
            className="chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Processing response..." : "Respond to the advisor... (Press Enter to send, Shift + Enter for new line)"}
            disabled={isLoading}
            autoFocus
            rows={1}
          />
          <button 
            type="submit" 
            className="btn btn-primary btn-icon pulse-button"
            disabled={!inputValue.trim() || isLoading}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
