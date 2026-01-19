import React, { useState } from 'react';
import '../styling/AupInput.css'; // Reusing AUP styles

const TosInput = ({ onPolicyGenerated, onLoadingChange }) => {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    // Basic Company Information
    company_name: '',
    business_description: '',
    industry: '',
    company_size: '',
    location: '',
    website: '',
    contact_email: '',
    phone_number: '',
    customer_type: '',
    
    // Service Information
    service_type: '',
    pricing_model: '',
    free_trial: '',
    refund_policy: '',
    prohibited_activities: '',
    subscription_features: '',
    payment_terms: '',
    
    // Boolean Fields
    minor_restrictions: false,
    user_content_uploads: false,
    international_operations: false
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submitData = async (access_token) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/documents/generate/api/tos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`,
        },
        body: JSON.stringify(formData)
      });

      if (response.status === 401) {
        const refresh_token = localStorage.getItem("refresh_token");
        const refreshResponse = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refresh_token }),
        });

        const refreshData = await refreshResponse.json();

        if (refreshData.access) {
          localStorage.setItem("access_token", refreshData.access);
          return submitData(refreshData.access); // Recursive call with new token
        } else {
          throw new Error("Token refresh failed");
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate Terms of Service");
      }

      const data = await response.json();
      onPolicyGenerated(data);
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true);
    if (onLoadingChange) onLoadingChange(true);

    const access_token = localStorage.getItem("access_token");
    submitData(access_token);
  };

  const industryOptions = [
    'Technology',
    'Retail & E-commerce',
    'Manufacturing',
    'Automotive',
    'Education',
    'Hospitality',
    'Government',
    'Energy',
    'Telecommunications',
    'Professional Services',
  ];

  const companySizeOptions = [
    'Startup (1-10 employees)',
    'SME (11-50 employees)',
    'Mid-sized (51-200 employees)',
    'Large (201+ employees)'
  ];

  const stateOptions = [
    'New South Wales',
    'Victoria',
    'Queensland',
    'Western Australia',
    'South Australia',
    'Tasmania',
    'Australian Capital Territory',
    'Northern Territory'
  ];

  const customerTypeOptions = [
    'Individuals (B2C)',
    'Businesses (B2B)',
    'Both'
  ];

  return (
    <div className="aup-container">
      <h2 className="aup-title">Generate Terms of Service</h2>

      {error && (
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '6px',
          padding: '12px 16px',
          marginBottom: '20px',
          color: '#c00'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
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
                placeholder="e.g., CloudServe Pty Ltd"
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
                Company Size <span className="aup-required">*</span>
              </label>
              <select
                name="company_size"
                value={formData.company_size}
                onChange={handleChange}
                required
                className="aup-select"
              >
                <option value="">Select size</option>
                {companySizeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="aup-form-group">
              <label className="aup-label">
                Location (State/Territory) <span className="aup-required">*</span>
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="aup-select"
              >
                <option value="">Select state/territory</option>
                {stateOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
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
                placeholder="legal@example.com.au"
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

            <div className="aup-form-group">
              <label className="aup-label">
                Customer Type <span className="aup-required">*</span>
              </label>
              <select
                name="customer_type"
                value={formData.customer_type}
                onChange={handleChange}
                required
                className="aup-select"
              >
                <option value="">Select customer type</option>
                {customerTypeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Service Information Section */}
        <div className="aup-section">
          <h3 className="aup-section-title">Service Information</h3>
          
          <div className="aup-vertical-group">
            <div className="aup-form-group-full">
              <label className="aup-label">
                Service Type <span className="aup-required">*</span>
              </label>
              <input
                type="text"
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                required
                className="aup-input"
                placeholder="e.g., SaaS platform, Cloud analytics, Project management tool"
              />
              <p className="aup-helper-text">
                What type of service do you provide?
              </p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Pricing Model <span className="aup-required">*</span>
              </label>
              <textarea
                name="pricing_model"
                value={formData.pricing_model}
                onChange={handleChange}
                required
                rows="2"
                className="aup-textarea"
                placeholder="e.g., Monthly subscription, Annual billing, Pay-as-you-go"
              />
              <p className="aup-helper-text">
                How do you charge for your service?
              </p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Free Trial <span className="aup-required">*</span>
              </label>
              <input
                type="text"
                name="free_trial"
                value={formData.free_trial}
                onChange={handleChange}
                required
                className="aup-input"
                placeholder="e.g., 14-day free trial, no credit card required (or 'None' if not offered)"
              />
              <p className="aup-helper-text">
                Do you offer a free trial? If yes, describe the terms
              </p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Refund Policy <span className="aup-required">*</span>
              </label>
              <textarea
                name="refund_policy"
                value={formData.refund_policy}
                onChange={handleChange}
                required
                rows="3"
                className="aup-textarea"
                placeholder="e.g., Pro-rata refunds available within 30 days; Full refund if service not as described; Subject to ACL rights"
              />
              <p className="aup-helper-text">
                What is your refund policy? (must comply with Australian Consumer Law)
              </p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Prohibited Activities <span className="aup-required">*</span>
              </label>
              <textarea
                name="prohibited_activities"
                value={formData.prohibited_activities}
                onChange={handleChange}
                required
                rows="4"
                className="aup-textarea"
                placeholder="e.g., Unauthorised access; Data scraping; Malware distribution; Harassment; Violating laws"
              />
              <p className="aup-helper-text">
                List activities that are not allowed on your platform (5-10 items)
              </p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Subscription Features <span className="aup-optional">(Optional)</span>
              </label>
              <textarea
                name="subscription_features"
                value={formData.subscription_features}
                onChange={handleChange}
                rows="3"
                className="aup-textarea"
                placeholder="e.g., Basic: 10 users, 10GB storage; Pro: 50 users, 100GB storage; Enterprise: Unlimited"
              />
              <p className="aup-helper-text">
                Describe different subscription tiers or features
              </p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Payment Terms <span className="aup-optional">(Optional)</span>
              </label>
              <textarea
                name="payment_terms"
                value={formData.payment_terms}
                onChange={handleChange}
                rows="2"
                className="aup-textarea"
                placeholder="e.g., Billed monthly in advance; Payment methods displayed at checkout; Auto-renewal"
              />
              <p className="aup-helper-text">
                When and how are payments processed?
              </p>
            </div>
          </div>
        </div>

        {/* Service Restrictions Section */}
        <div className="aup-section">
          <h3 className="aup-section-title">Service Restrictions & Features</h3>
          
          <div className="aup-vertical-group">
            <div className="aup-form-group-full">
              <label className="aup-label" style={{ marginBottom: '12px' }}>
                Service Characteristics <span className="aup-required">*</span>
              </label>
              <p className="aup-helper-text" style={{ marginBottom: '12px' }}>
                Select all that apply to your service
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="minor_restrictions"
                    checked={formData.minor_restrictions}
                    onChange={handleChange}
                  />
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    <strong>Age Restrictions (18+)</strong> - Service requires users to be 18 or older
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="user_content_uploads"
                    checked={formData.user_content_uploads}
                    onChange={handleChange}
                  />
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    <strong>User Content Uploads</strong> - Users can upload files, data, or content
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="international_operations"
                    checked={formData.international_operations}
                    onChange={handleChange}
                  />
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    <strong>International Operations</strong> - Service available outside Australia
                  </span>
                </label>
              </div>
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
            <li>Comprehensive Terms of Service (2,000-3,000 words)</li>
            <li>18-20 detailed sections covering all aspects</li>
            <li>Australian Consumer Law (ACL) compliant</li>
            <li>Consumer guarantees that cannot be excluded</li>
            <li>Proper liability limitations within legal bounds</li>
            <li>Dispute resolution and governing law (NSW)</li>
            <li>Professional, legally sound language</li>
          </ul>
        </div>

        <button 
          type="submit" 
          className={`aup-submit-button ${loading ? 'aup-submit-button-disabled' : ''}`}
          disabled={loading}
        >
          {loading ? 'Generating Terms...' : 'Generate Terms of Service'}
        </button>
      </form>
    </div>
  );
};

export default TosInput;