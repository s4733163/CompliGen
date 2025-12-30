import React from 'react'

const Working = () => {
  const steps = [
    {
      number: '01',
      icon: '📤',
      title: 'Upload Your Documents',
      description: 'Upload your existing security policies, procedures, or internal documents in PDF format.',
      color: '#3b82f6'
    },
    {
      number: '02',
      icon: '🔍',
      title: 'AI Analysis',
      description: 'Our AI-powered system analyzes your documents against ISO 27001, SOC 2, and NIST standards.',
      color: '#8b5cf6'
    },
    {
      number: '03',
      icon: '📊',
      title: 'Get Compliance Report',
      description: 'Receive detailed gap analysis with recommendations and compliance scores for each control.',
      color: '#ec4899'
    },
    {
      number: '04',
      icon: '📝',
      title: 'Generate Policies',
      description: 'Create professional policies like Privacy Policy, Terms of Service, and more in minutes.',
      color: '#10b981'
    }
  ]

  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Get compliance reports in minutes, not weeks'
    },
    {
      icon: '🎯',
      title: 'Highly Accurate',
      description: 'AI-powered analysis with industry standards'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your documents are encrypted and protected'
    },
    {
      icon: '💰',
      title: 'Cost Effective',
      description: 'Save thousands on compliance consultants'
    }
  ]

  return (
    <section className="working-section" id="features-section">
      <div className="working-container">
        {/* Section Header */}
        <div className="working-header">
          <span className="working-badge">How It Works</span>
          <h2 className="working-title">
            Simple Process, Powerful Results
          </h2>
          <p className="working-description">
            Get compliant in four easy steps. Our platform handles the complexity while you focus on your business.
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
            <h3 className="cta-title">Ready to Get Started?</h3>
            <p className="cta-description">
              Join companies achieving compliance faster and easier with CompliGen
            </p>
          </div>
          <button className="cta-button" onClick={() => window.location.href = '/signup'}>
            Start Free Trial
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