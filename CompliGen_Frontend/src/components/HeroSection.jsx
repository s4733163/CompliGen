import React from 'react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/signup')
  }

  const handleLearnMore = () => {
    // Smooth scroll to features or next section
    const nextSection = document.getElementById('features-section')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="hero-section">
      <div className="hero-container">
        {/* Text Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🛡️</span>
            <span className="badge-text">Automated Compliance Made Simple</span>
          </div>

          <h1 className="hero-title">
            Compliance Checking &
            <span className="hero-title-highlight"> Policy Generation</span>
            <br />
            Powered by AI
          </h1>

          <p className="hero-description">
            Upload your documents, get instant compliance reports against ISO 27001, SOC 2, and NIST standards. 
            Generate professional policies in minutes with our AI-powered platform.
          </p>

          <div className="hero-buttons">
            <button onClick={handleGetStarted} className="btn-primary">
              Get Started Free
              <svg className="btn-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
            <button onClick={handleLearnMore} className="btn-secondary">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">Compliance Standards</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">5+</span>
              <span className="stat-label">Policy Types</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">Instant</span>
              <span className="stat-label">Analysis Reports</span>
            </div>
          </div>
        </div>

        {/* Visual Element */}
        <div className="hero-visual">
          <div className="visual-card">
            <div className="visual-card-header">
              <div className="visual-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <span className="visual-title">Compliance Report</span>
            </div>
            
            <div className="visual-card-content">
              <div className="score-circle">
                <svg className="score-svg" viewBox="0 0 120 120">
                  <circle className="score-bg" cx="60" cy="60" r="54" />
                  <circle className="score-progress" cx="60" cy="60" r="54" />
                </svg>
                <div className="score-text">
                  <span className="score-number">85</span>
                  <span className="score-percent">%</span>
                </div>
              </div>

              <div className="compliance-items">
                <div className="compliance-item compliant">
                  <span className="compliance-icon">✓</span>
                  <span className="compliance-text">Access Control Policy</span>
                  <span className="compliance-badge success">Compliant</span>
                </div>
                <div className="compliance-item partial">
                  <span className="compliance-icon">⚠</span>
                  <span className="compliance-text">Incident Response Plan</span>
                  <span className="compliance-badge warning">Partial</span>
                </div>
                <div className="compliance-item missing">
                  <span className="compliance-icon">✕</span>
                  <span className="compliance-text">Encryption Policy</span>
                  <span className="compliance-badge danger">Missing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="floating-element element-1">
            <span className="float-icon">📄</span>
            <span className="float-text">ISO 27001</span>
          </div>
          <div className="floating-element element-2">
            <span className="float-icon">🔒</span>
            <span className="float-text">SOC 2</span>
          </div>
          <div className="floating-element element-3">
            <span className="float-icon">⚡</span>
            <span className="float-text">NIST</span>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="hero-bg-decoration decoration-1"></div>
      <div className="hero-bg-decoration decoration-2"></div>
    </div>
  )
}

export default HeroSection