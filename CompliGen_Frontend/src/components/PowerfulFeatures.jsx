import React from 'react'

const PowerfulFeatures = () => {
  const mainFeatures = [
    {
      icon: '📝',
      title: 'Comprehensive Policy Suite',
      description: 'Generate all essential legal policies your business needs, fully compliant with Australian law.',
      features: [
        'Privacy Policy (Privacy Act 1988)',
        'Terms of Service (ACL compliant)',
        'Cookie Policy (Privacy Act)',
        'Acceptable Use Policy',
        'Data Processing Agreement'
      ],
      color: '#3b82f6'
    },
    {
      icon: '🇦🇺',
      title: 'Australian Legal Compliance',
      description: 'Every policy is tailored to Australian legislation and regulatory requirements.',
      features: [
        'Australian Privacy Principles (APPs)',
        'Australian Consumer Law (ACL)',
        'OAIC Guidelines compliance',
        'State-specific regulations'
      ],
      color: '#8b5cf6'
    }
  ]

  const additionalFeatures = [
    {
      icon: '⚡',
      title: 'Instant Generation',
      description: 'Create complete, professional policies in 2-5 minutes with our AI engine'
    },
    {
      icon: '✨',
      title: 'Smart Customization',
      description: 'AI adapts policies to your industry, business size, and specific requirements'
    },
    {
      icon: '📊',
      title: 'Structured Documents',
      description: 'Well-organized policies with clear sections, definitions, and contact details'
    },
    {
      icon: '🔒',
      title: 'Privacy-Focused',
      description: 'Your business information is never stored or shared with third parties'
    },
    {
      icon: '💾',
      title: 'Multiple Formats',
      description: 'Download as PDF, copy text, or export formatted documents instantly'
    },
    {
      icon: '🔄',
      title: 'Easy Updates',
      description: 'Regenerate policies anytime as your business evolves or laws change'
    }
  ]

  return (
    <section className="features-section">
      <div className="features-container">
        {/* Section Header */}
        <div className="features-header">
          <span className="features-badge">Powerful Features</span>
          <h2 className="features-main-title">
            Everything You Need for Legal Compliance
          </h2>
          <p className="features-main-description">
            Professional-grade policy generation with Australian legal compliance built-in
          </p>
        </div>

        {/* Main Features - Two Column Cards */}
        <div className="main-features-grid">
          {mainFeatures.map((feature, index) => (
            <div key={index} className="main-feature-card">
              <div className="main-feature-icon-wrapper" style={{ backgroundColor: `${feature.color}15` }}>
                <span className="main-feature-icon">{feature.icon}</span>
              </div>
              <h3 className="main-feature-title">{feature.title}</h3>
              <p className="main-feature-description">{feature.description}</p>
              
              <div className="main-feature-list">
                {feature.features.map((item, idx) => (
                  <div key={idx} className="main-feature-item">
                    <svg className="check-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="10" fill={feature.color} opacity="0.1"/>
                      <path d="M6 10L9 13L14 8" stroke={feature.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="main-feature-item-text">{item}</span>
                  </div>
                ))}
              </div>

              <button 
                className="main-feature-btn" 
                style={{ backgroundColor: feature.color }}
                onClick={() => window.location.href = '/signup'}
              >
                Generate Policy
                <svg className="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Additional Features - Three Column Grid */}
        <div className="additional-features">
          <h3 className="additional-features-title">Plus More Amazing Features</h3>
          
          <div className="additional-features-grid">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="additional-feature-card">
                <div className="additional-feature-icon">{feature.icon}</div>
                <h4 className="additional-feature-title">{feature.title}</h4>
                <p className="additional-feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="features-stats-bar">
          <div className="stat-box">
            <span className="stat-value">5</span>
            <span className="stat-label">Policy Types</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-value">100%</span>
            <span className="stat-label">Australian Compliant</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-value">2-5min</span>
            <span className="stat-label">Generation Time</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-value">15-20</span>
            <span className="stat-label">Sections Per Policy</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PowerfulFeatures