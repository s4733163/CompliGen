import React from 'react'

const Working = () => {
  const steps = [
    {
      number: '01',
      icon: '📋',
      title: 'Choose Policy Type',
      description: 'Select from Privacy Policy, Terms of Service, Cookie Policy, AUP, or DPA based on your needs.',
      color: '#3b82f6'
    },
    {
      number: '02',
      icon: '✍️',
      title: 'Fill Simple Form',
      description: 'Answer straightforward questions about your business, services, and operations in minutes.',
      color: '#8b5cf6'
    },
    {
      number: '03',
      icon: '🤖',
      title: 'AI Generation',
      description: 'Our AI creates a comprehensive, Australian-compliant legal policy tailored to your business.',
      color: '#ec4899'
    },
    {
      number: '04',
      icon: '📥',
      title: 'Download & Deploy',
      description: 'Get your professional policy instantly. Download as PDF or copy to your website immediately.',
      color: '#10b981'
    }
  ]

  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Generate complete policies in 2-5 minutes'
    },
    {
      icon: '🇦🇺',
      title: 'Australian Compliant',
      description: 'Aligned with Privacy Act, ACL, and OAIC guidelines'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your business data is encrypted and protected'
    },
    {
      icon: '💰',
      title: 'Cost Effective',
      description: 'Save thousands on legal fees and consultants'
    }
  ]

  return (
    <section className="working-section" id="features-section">
      <div className="working-container">
        {/* Section Header */}
        <div className="working-header">
          <span className="working-badge">How It Works</span>
          <h2 className="working-title">
            Create Legal Policies in Minutes
          </h2>
          <p className="working-description">
            Generate professional, compliant legal documents in four simple steps. No legal expertise required.
          </p>
        </div>

        {/* Steps */}
        <div className="working-steps">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number" style={{ backgroundColor: `${step.color}15`, color: step.color }}>
                {step.number}
              </div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="step-connector">
                  <svg width="100%" height="2" className="connector-line">
                    <line x1="0" y1="1" x2="100%" y2="1" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="working-features">
          <h3 className="features-title">Why Choose CompliGen?</h3>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="working-cta">
          <div className="cta-content">
            <h3 className="cta-title">Ready to Generate Your First Policy?</h3>
            <p className="cta-description">
              Join Australian businesses creating professional legal documents in minutes
            </p>
          </div>
          <button className="cta-button" onClick={() => window.location.href = '/signup'}>
            Start Generating Now
            <svg className="cta-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Working