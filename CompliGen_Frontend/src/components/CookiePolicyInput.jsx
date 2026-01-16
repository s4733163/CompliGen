import React, { useState } from 'react';
import '../styling/AupInput.css'; // Reusing AUP styles

const CookiePolicyInput = ({ onPolicyGenerated, onLoadingChange }) => {
  const [formData, setFormData] = useState({
    // Basic Company Information
    company_name: '',
    business_description: '',
    industry: '',
    website: '',
    contact_email: '',
    phone_number: '',
    
    // Cookie Specific Fields
    essential_cookies: true, // Always true by default
    analytics_cookies: false,
    marketing_cookies: false,
    advertising_cookies: false,
    functional_cookies: false,
    third_party_services: '',
    cookie_duration: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (onLoadingChange) onLoadingChange(true);
    
    // Convert third_party_services string to array
    const submissionData = {
      ...formData,
      third_party_services: formData.third_party_services
        .split(',')
        .map(s => s.trim())
        .filter(s => s)
    };
    
    // Simulate policy generation - replace with actual API call later
    setTimeout(() => {
      onPolicyGenerated(submissionData);
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }, 2000);
  };

  const industryOptions = [
    'FinTech SaaS',
    'HealthTech',
    'EdTech SaaS',
    'E-commerce',
    'Cloud Services',
    'Analytics Platform',
    'Marketing Technology',
    'HR Technology',
    'Other'
  ];

  return (
    <div className="aup-container">
      <h2 className="aup-title">Generate Cookie Policy</h2>
      
      <form onSubmit={handleSubmit} className="aup-form">
        {/* Basic Company Information Section */}
        <div className="aup-section">
          <h3 className="aup-section-title">Basic Company Information</h3>
          
          <div className="aup-grid">
            <div className="aup-form-group">
              <label className="aup-label">
                Company Name <span className="aup-required">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="aup-input"
                placeholder="e.g., TrackWise Pty Ltd"
              />
            </div>

            <div className="aup-form-group">
              <label className="aup-label">
                Industry <span className="aup-required">*</span>
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className="aup-select"
              >
                <option value="">Select industry</option>
                {industryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Business Description <span className="aup-required">*</span>
              </label>
              <textarea
                name="business_description"
                value={formData.business_description}
                onChange={handleChange}
                required
                rows="3"
                className="aup-textarea"
                placeholder="Describe what your business does..."
              />
            </div>

            <div className="aup-form-group">
              <label className="aup-label">
                Website URL <span className="aup-required">*</span>
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                required
                className="aup-input"
                placeholder="https://example.com.au"
              />
            </div>

            <div className="aup-form-group">
              <label className="aup-label">
                Contact Email <span className="aup-required">*</span>
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                required
                className="aup-input"
                placeholder="privacy@example.com.au"
              />
            </div>

            <div className="aup-form-group">
              <label className="aup-label">
                Phone Number <span className="aup-optional">(Optional)</span>
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="aup-input"
                placeholder="+61 3 9000 1122"
              />
            </div>
          </div>
        </div>

        {/* Cookie Policy Specific Fields Section */}
        <div className="aup-section">
          <h3 className="aup-section-title">Cookie Usage Details</h3>
          
          <div className="aup-vertical-group">
            <div className="aup-form-group-full">
              <label className="aup-label" style={{ marginBottom: '12px' }}>
                Types of Cookies Used <span className="aup-required">*</span>
              </label>
              <p className="aup-helper-text" style={{ marginBottom: '12px' }}>
                Select all types of cookies your website uses
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="essential_cookies"
                    checked={formData.essential_cookies}
                    onChange={handleChange}
                    disabled
                    style={{ cursor: 'not-allowed' }}
                  />
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    <strong>Essential Cookies</strong> (Required - cannot be disabled)
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="analytics_cookies"
                    checked={formData.analytics_cookies}
                    onChange={handleChange}
                  />
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    <strong>Analytics Cookies</strong> - Track website usage and performance
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="marketing_cookies"
                    checked={formData.marketing_cookies}
                    onChange={handleChange}
                  />
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    <strong>Marketing Cookies</strong> - Deliver relevant marketing content
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="advertising_cookies"
                    checked={formData.advertising_cookies}
                    onChange={handleChange}
                  />
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    <strong>Advertising Cookies</strong> - Show targeted advertisements
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="functional_cookies"
                    checked={formData.functional_cookies}
                    onChange={handleChange}
                  />
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    <strong>Functional Cookies</strong> - Remember user preferences
                  </span>
                </label>
              </div>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Third-Party Services <span className="aup-required">*</span>
              </label>
              <textarea
                name="third_party_services"
                value={formData.third_party_services}
                onChange={handleChange}
                required
                rows="3"
                className="aup-textarea"
                placeholder="e.g., Google Analytics, Facebook Pixel, Hotjar (separate with commas)"
              />
              <p className="aup-helper-text">
                List all third-party services that place cookies on your website (comma-separated)
              </p>
              <div style={{ 
                marginTop: '8px', 
                padding: '10px', 
                backgroundColor: '#f7fafc', 
                borderRadius: '4px',
                fontSize: '12px',
                color: '#4a5568'
              }}>
                <strong>Common services:</strong> Google Analytics, Google Ads, Facebook Pixel, Meta Pixel, 
                LinkedIn Insight Tag, TikTok Pixel, Hotjar, Microsoft Advertising, Google Tag Manager
              </div>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Cookie Duration <span className="aup-required">*</span>
              </label>
              <textarea
                name="cookie_duration"
                value={formData.cookie_duration}
                onChange={handleChange}
                required
                rows="3"
                className="aup-textarea"
                placeholder="e.g., Session cookies deleted on browser close. Analytics cookies persist for 2 years. Marketing cookies persist for 90 days."
              />
              <p className="aup-helper-text">
                Explain how long different types of cookies remain on users' devices
              </p>
            </div>
          </div>
        </div>

        {/* Information Box */}
        <div style={{
          backgroundColor: '#ebf8ff',
          border: '1px solid #bee3f8',
          borderRadius: '6px',
          padding: '16px',
          marginTop: '10px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#2c5282', fontSize: '14px', fontWeight: '600' }}>
            📋 What will be generated:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#2d3748', lineHeight: '1.6' }}>
            <li>Clear explanation of what cookies are</li>
            <li>Details of cookie types you use</li>
            <li>List of third-party services with opt-out links</li>
            <li>Browser-specific cookie management instructions</li>
            <li>Compliant with Australian Privacy Act requirements</li>
          </ul>
        </div>

        <button 
          type="submit" 
          className={`aup-submit-button ${loading ? 'aup-submit-button-disabled' : ''}`}
          disabled={loading}
        >
          {loading ? 'Generating Policy...' : 'Generate Cookie Policy'}
        </button>
      </form>
    </div>
  );
};

export default CookiePolicyInput;