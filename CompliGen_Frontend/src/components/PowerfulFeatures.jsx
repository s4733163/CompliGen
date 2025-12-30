import React from 'react'

const PowerfulFeatures = () => {
  const mainFeatures = [
    {
      icon: '🔍',
      title: 'Compliance Checker',
      description: 'Upload your security policies and get instant compliance analysis against industry standards.',
      features: [
        'ISO 27001 compliance checking',
        'SOC 2 Trust Services Criteria',
        'NIST Cybersecurity Framework',
        'Detailed gap analysis reports'
      ],
      color: '#3b82f6'
    },
    {
      icon: '📝',
      title: 'Policy Generator',
      description: 'Create professional, legally compliant policies in minutes with our AI-powered templates.',
      features: [
        'Privacy Policy (GDPR, CCPA)',
        'Terms of Service',
        'Cookie Policy',
        'Acceptable Use Policy'
      ],
      color: '#8b5cf6'
    }
  ]

  const additionalFeatures = [
    {
      icon: '⚡',
      title: 'Real-time Analysis',
      description: 'Get instant feedback on your documents with our AI-powered analysis engine'
    },
    {
      icon: '📊',
      title: 'Comprehensive Reports',
      description: 'Detailed compliance scores, missing controls, and actionable recommendations'
    },
    {
      icon: '🎯',
      title: 'Gap Identification',
      description: 'Pinpoint exactly what\'s missing and get specific guidance on improvements'
    },
    {
      icon: '🔒',
      title: 'Secure Processing',
      description: 'Bank-level encryption ensures your sensitive documents stay protected'
    },
    {
      icon: '💾',
      title: 'Export Options',
      description: 'Download reports and policies as PDF or DOCX for easy sharing'
    },
    {
      icon: '🔄',
      title: 'Version Control',
      description: 'Track changes and maintain history of all your compliance documents'
    }
  ]

  return (
    <section className="features-section">
      <div className="features-container">
        {/* Section Header */}
        <div className="features-header">
          <span className="features-badge">Powerful Features</span>
          <h2 className="features-main-title">
            Everything You Need for Compliance
          </h2>
          <p className="features-main-description">
            Comprehensive tools to check compliance and generate policies with enterprise-grade accuracy
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
                Try It Free
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
            <span className="stat-value">100+</span>
            <span className="stat-label">Compliance Controls</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-value">5+</span>
            <span className="stat-label">Policy Templates</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-value">3</span>
            <span className="stat-label">Standards Supported</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-value">99.9%</span>
            <span className="stat-label">Accuracy Rate</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PowerfulFeatures