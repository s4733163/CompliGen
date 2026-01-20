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
            <span className="badge-icon">✨</span>
            <span className="badge-text">AI-Powered Legal Documents</span>
          </div>

          <h1 className="hero-title">
            Generate Professional
            <span className="hero-title-highlight"> Legal Policies</span>
            <br />
            in Minutes, Not Days
          </h1>

          <p className="hero-description">
            Create Australian-compliant legal policies instantly with AI. From Privacy Policies to Terms of Service, 
            get professional, customized documents tailored to your business—no lawyers required.
          </p>

          <div className="hero-buttons">
            <button onClick={handleGetStarted} className="btn-primary">
              Generate Your First Policy
              <svg className="btn-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
            <button onClick={handleLearnMore} className="btn-secondary">
              See How It Works
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">Policy Types</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Australian Compliant</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">2 Min</span>
              <span className="stat-label">Average Generation</span>
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
              <span className="visual-title">Policy Generator</span>
            </div>
            
            <div className="visual-card-content">
              <div className="policy-preview">
                <div className="policy-header">
                  <div className="policy-icon">📄</div>
                  <div className="policy-info">
                    <div className="policy-name">Privacy Policy</div>
                    <div className="policy-status">
                      <span className="status-dot"></span>
                      <span className="status-text">Ready to Download</span>
                    </div>
                  </div>
                  <div className="policy-check">✓</div>
                </div>

                <div className="policy-stats-grid">
                  <div className="policy-stat">
                    <span className="stat-icon">📝</span>
                    <div className="stat-details">
                      <span className="stat-value">2,847</span>
                      <span className="stat-name">Words</span>
                    </div>
                  </div>
                  <div className="policy-stat">
                    <span className="stat-icon">🛡️</span>
                    <div className="stat-details">
                      <span className="stat-value">15</span>
                      <span className="stat-name">Sections</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="compliance-items">
                <div className="compliance-item compliant">
                  <span className="compliance-icon">✓</span>
                  <span className="compliance-text">Australian Privacy Act</span>
                  <span className="compliance-badge success">Compliant</span>
                </div>
                <div className="compliance-item compliant">
                  <span className="compliance-icon">✓</span>
                  <span className="compliance-text">APP Principles (1-13)</span>
                  <span className="compliance-badge success">Included</span>
                </div>
                <div className="compliance-item compliant">
                  <span className="compliance-icon">✓</span>
                  <span className="compliance-text">OAIC Guidelines</span>
                  <span className="compliance-badge success">Aligned</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements - Policy Types */}
          <div className="floating-element element-1">
            <span className="float-icon">📋</span>
            <span className="float-text">AUP</span>
          </div>
          <div className="floating-element element-2">
            <span className="float-icon">🔒</span>
            <span className="float-text">Privacy</span>
          </div>
          <div className="floating-element element-3">
            <span className="float-icon">📄</span>
            <span className="float-text">Terms</span>
          </div>
          <div className="floating-element element-4">
            <span className="float-icon">🍪</span>
            <span className="float-text">Cookie</span>
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