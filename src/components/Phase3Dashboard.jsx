import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { downloadRoadmapPDF } from '../utils/pdfGenerator';
import { safeFetchWatsonx, safeFetchYoutube } from '../utils/apiClient';

export default function Phase3Dashboard({ 
  selectedDomain, 
  allMatchedDomains, 
  answers, 
  signals, 
  onReset,
  onSwitchDomain 
}) {
  const [videoData, setVideoData] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(null);

  const [transparency, setTransparency] = useState('');
  const [isTransparencyLoading, setIsTransparencyLoading] = useState(false);

  const [dynamicRoadmap, setDynamicRoadmap] = useState(null);
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false);
  const [roadmapError, setRoadmapError] = useState(null);

  // Load resources, explanations, and video on domain load/change
  useEffect(() => {
    if (!selectedDomain) return;

    // Reset local state
    setVideoData(null);
    setTransparency('');
    setDynamicRoadmap(null);
    setRoadmapError(null);
    setVideoError(null);

    // 1. Fetch YouTube video details
    fetchVideoDetails();

    // 2. Fetch Transparency Alignment Explanation from Watsonx
    fetchTransparencyExplanation();

    // 3. If dynamic domain, fetch Watsonx generated roadmap
    if (!selectedDomain.isFlagship) {
      fetchDynamicRoadmap();
    }
  }, [selectedDomain]);

  const fetchVideoDetails = async () => {
    setIsVideoLoading(true);
    try {
      const data = await safeFetchYoutube(
        selectedDomain.isFlagship && selectedDomain.videoId
          ? { videoId: selectedDomain.videoId }
          : { q: selectedDomain.name }
      );
      setVideoData(data);
    } catch (err) {
      console.error(err);
      setVideoError("Could not fetch YouTube resource player.");
    } finally {
      setIsVideoLoading(false);
    }
  };

  const fetchTransparencyExplanation = async () => {
    setIsTransparencyLoading(true);
    try {
      const data = await safeFetchWatsonx({
        action: 'generate_transparency',
        domain: selectedDomain.name,
        answers: answers
      });
      setTransparency(data.explanation || getDefaultTransparency());
    } catch (err) {
      console.error(err);
      setTransparency(getDefaultTransparency());
    } finally {
      setIsTransparencyLoading(false);
    }
  };

  const fetchDynamicRoadmap = async () => {
    setIsRoadmapLoading(true);
    try {
      const data = await safeFetchWatsonx({
        action: 'generate_roadmap',
        domain: selectedDomain.name,
        signals: signals
      });
      setDynamicRoadmap(data);
    } catch (err) {
      console.error(err);
      setRoadmapError("Failed to synthesize roadmap milestones. Running fallback layout.");
      setDynamicRoadmap(getDefaultDynamicRoadmapFallback());
    } finally {
      setIsRoadmapLoading(false);
    }
  };

  const getDefaultTransparency = () => {
    // Generate simple client-side evidence mapping
    const highSignals = Object.entries(signals)
      .filter(([_, s]) => s.score >= 6)
      .map(([k, _]) => k);
    
    return `You matched with ${selectedDomain.name} due to your strong performance across the traits of [${highSignals.join(', ')}]. Throughout the interview, you expressed interest in project management, analytical tools, and structured guidelines. These priorities perfectly match the requirements for success in this path.`;
  };

  const getDefaultDynamicRoadmapFallback = () => {
    return {
      roadmap: [
        {
          phase: "Phase 1: Foundation Building",
          milestones: [
            `Study the core systems theory of ${selectedDomain.name}`,
            "Set up basic documentation templates or developer tools",
            "Complete 2 introductory tutorials and define learning resources"
          ]
        },
        {
          phase: "Phase 2: Project Milestones",
          milestones: [
            "Build an intermediate project incorporating tools of trade",
            "Establish feedback loops with active peer reviewers",
            "Create structured workflows for testing or validation steps"
          ]
        },
        {
          phase: "Phase 3: Core Deep Dive",
          milestones: [
            "Specialize in advanced architectures of the domain",
            "Learn industry integration libraries or security models",
            "Optimize speed and reliability across project layouts"
          ]
        },
        {
          phase: "Phase 4: Launch Checklist",
          milestones: [
            "Design a professional portfolio demonstrating 3 case studies",
            "Submit projects on community repositories or review boards",
            "Optimize resume and prepare for industry interviews"
          ]
        }
      ],
      resources: [
        { name: `${selectedDomain.name} Starter Guide`, description: "An introductory review of core concepts." },
        { name: `Official ${selectedDomain.name} Specifications`, description: "Detailed regulatory or architectural standards manual." }
      ]
    };
  };

  const handleDownloadPDF = () => {
    const activeRoadmap = selectedDomain.isFlagship 
      ? selectedDomain.roadmap 
      : (dynamicRoadmap?.roadmap || []);
      
    const activeResources = selectedDomain.isFlagship 
      ? selectedDomain.resources 
      : (dynamicRoadmap?.resources || []);

    const vTitle = videoData ? videoData.title : `${selectedDomain.name} Masterclass`;

    downloadRoadmapPDF(selectedDomain, transparency, activeRoadmap, activeResources, vTitle);
  };

  // Get active roadmap data
  const activeRoadmap = selectedDomain.isFlagship 
    ? selectedDomain.roadmap 
    : (dynamicRoadmap?.roadmap || []);

  const activeResources = selectedDomain.isFlagship 
    ? selectedDomain.resources 
    : (dynamicRoadmap?.resources || []);

  const isStrong = selectedDomain.confidence === "Strong match";

  return (
    <div className="dashboard-layout animate-fade-in" style={{ width: '100%' }}>
      
      {/* 1. Sidebar Navigation (Switcher) */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-nav-card">
          <h3 style={{ fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '16px', paddingLeft: '8px' }}>
            Your Careers
          </h3>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {allMatchedDomains.map(domain => {
              const isActive = domain.id === selectedDomain.id;
              const matchesStrong = domain.confidence === "Strong match";
              return (
                <button
                  key={domain.id}
                  className={`dashboard-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onSwitchDomain(domain)}
                >
                  <span style={{ flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {domain.name}
                  </span>
                  <span 
                    style={{ 
                      fontSize: '11px', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      backgroundColor: isActive 
                        ? 'var(--bg-secondary)' 
                        : (matchesStrong ? 'rgba(52, 199, 89, 0.1)' : 'var(--bg-primary)'),
                      color: matchesStrong && !isActive ? 'var(--success)' : 'inherit'
                    }}
                  >
                    {domain.matchPercentage}%
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Global Reset Discovery Button */}
        <button className="btn btn-outline" onClick={onReset} style={{ width: '100%', gap: '10px' }}>
          <Icons.RotateCcw size={16} />
          Reset Discovery Path 🔄
        </button>
      </aside>

      {/* 2. Main Dashboard Content */}
      <main className="dashboard-content">
        
        {/* Header Title and Actions */}
        <div className="dashboard-header-area">
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Selected Roadmap
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginTop: '4px' }}>
              Your Path: {selectedDomain.name}
            </h1>
            <div className="domain-info-badge-row">
              <span className={`badge ${isStrong ? 'badge-strong' : 'badge-explore'}`}>
                {isStrong ? "Strong match" : "Worth exploring"} ({selectedDomain.matchPercentage}%)
              </span>
              <span className="badge" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                Category: {selectedDomain.category}
              </span>
            </div>
          </div>
          
          <button className="btn btn-primary pulse-button" onClick={handleDownloadPDF}>
            <Icons.Download size={16} />
            Download Roadmap (PDF)
          </button>
        </div>

        {/* Dynamic Label Indicator */}
        {!selectedDomain.isFlagship && (
          <div style={{ padding: '16px 20px', backgroundColor: '#f2f2f7', border: '1px dashed var(--border-dark)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Icons.Info size={20} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: '500' }}>
              <strong>AI-Suggested Domain:</strong> This learning roadmap is synthesized live by watsonx and is <strong>not independently verified</strong>. Videos are queried live.
            </span>
          </div>
        )}

        {/* Alignment Explanation Section */}
        <section className="card" style={{ margin: 0 }}>
          <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Icons.Compass size={20} style={{ color: 'var(--accent)' }} />
            Psychological Alignment & Transparency
          </h3>
          {isTransparencyLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></span>
              <span>Drafting cognitive alignment overview...</span>
            </div>
          ) : (
            <p style={{ color: 'var(--text-primary)', fontSize: '15px', lineHeight: '1.6' }}>
              {transparency}
            </p>
          )}
        </section>

        {/* Roadmap Timeline */}
        <section className="card" style={{ margin: 0 }}>
          <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Icons.Milestone size={20} style={{ color: 'var(--accent)' }} />
            Learning Roadmap Timeline
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '16px' }}>
            Follow these sequential developmental milestones to gain competence in the industry.
          </p>

          {isRoadmapLoading ? (
            <div className="loading-overlay">
              <span className="spinner"></span>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Synthesizing learning roadmap milestones...</span>
            </div>
          ) : (
            <div className="timeline">
              {activeRoadmap.map((step, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-node">{idx + 1}</div>
                  <div className="timeline-content">
                    <h4 className="timeline-title">{step.phase}</h4>
                    <ul className="timeline-milestones">
                      {step.milestones.map((milestone, i) => (
                        <li key={i} className="timeline-milestone">
                          <Icons.CheckCircle2 size={14} style={{ color: 'var(--accent)' }} />
                          <span>{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Launchpad Resources */}
        <section className="card" style={{ margin: 0 }}>
          <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Icons.Rocket size={20} style={{ color: 'var(--accent)' }} />
            Learning Launchpads
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '16px' }}>
            {selectedDomain.isFlagship 
              ? "Official, hand-vetted reference tools and documentation sites."
              : "Suggested resource categories (AI-suggested - not independently verified)."}
          </p>

          {isRoadmapLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></span>
              <span>Reconciling launchpad resource suggestions...</span>
            </div>
          ) : (
            <div className="launchpad-grid">
              {activeResources.map((res, idx) => {
                if (selectedDomain.isFlagship) {
                  return (
                    <a 
                      key={idx} 
                      href={res.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="launchpad-card"
                    >
                      <div>
                        <div className="launchpad-card-title">
                          {res.name}
                          <Icons.ExternalLink size={14} />
                        </div>
                        <p className="launchpad-card-desc">{res.description}</p>
                      </div>
                      <div className="launchpad-card-footer">
                        <Icons.CheckCircle2 size={12} style={{ color: 'var(--success)' }} />
                        Hand-Vetted Link
                      </div>
                    </a>
                  );
                } else {
                  return (
                    <div key={idx} className="launchpad-card unverified">
                      <div>
                        <div className="launchpad-card-title" style={{ color: 'var(--text-primary)' }}>
                          {res.name}
                          <Icons.HelpCircle size={14} style={{ color: 'var(--text-secondary)' }} />
                        </div>
                        <p className="launchpad-card-desc">{res.description}</p>
                      </div>
                      <div className="launchpad-card-footer" style={{ color: 'var(--text-secondary)' }}>
                        <Icons.AlertCircle size={12} />
                        AI-Suggested (Verify Names)
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </section>

        {/* YouTube Masterclass Section */}
        <section className="card" style={{ margin: 0 }}>
          <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Icons.Tv size={20} style={{ color: 'var(--danger)' }} />
            Masterclass Video Resource
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '20px' }}>
            Watch this curated introduction video to visualize standard operations in the industry.
          </p>

          {isVideoLoading ? (
            <div className="loading-overlay" style={{ padding: '30px 0' }}>
              <span className="spinner"></span>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Retrieving video player details from YouTube...</span>
            </div>
          ) : videoError || !videoData ? (
            <div style={{ display: 'flex', gap: '8px', padding: '16px 20px', background: 'rgba(255, 59, 48, 0.05)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '13.5px', alignItems: 'center' }}>
              <Icons.AlertCircle size={18} />
              <span>{videoError || "Curated video data not available."}</span>
            </div>
          ) : (
            <div className="video-section">
              <div className="video-container">
                <iframe
                  src={`https://www.youtube.com/embed/${videoData.videoId}`}
                  title={videoData.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="video-meta">
                <h4 className="video-title">{videoData.title}</h4>
                <div className="video-channel">
                  Channel: <strong>{videoData.channelTitle}</strong>
                </div>
                {videoData.description && (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.4' }}>
                    {videoData.description.length > 200 
                      ? `${videoData.description.substring(0, 200)}...` 
                      : videoData.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
