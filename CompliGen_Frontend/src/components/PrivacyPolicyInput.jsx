import React, { useState } from 'react';
import '../styling/AupInput.css'; // Reusing AUP styles

const PrivacyPolicyInput = ({ onPolicyGenerated, onLoadingChange }) => {
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

    // Privacy-Specific Boolean Fields
    international_operations: false,
    serves_children: false,
    payment_data_collected: false,
    cookies_used: false,
    marketing_purpose: false,

    // Data Collection Information
    data_types: '',
    collection_methods: '',
    collection_purposes: '',
    third_parties: '',
    storage_location: '',
    security_measures: '',
    retention_period: ''
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
      const response = await fetch(`http://127.0.0.1:8000/documents/generate/api/privacypolicy`, {
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
        throw new Error(errorData.error || "Failed to generate policy");
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
      <h2 className="aup-title">Generate Privacy Policy</h2>

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
                placeholder="e.g., SecureData Pty Ltd"
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

        {/* Privacy Practices Section */}
        <div className="aup-section">
          <h3 className="aup-section-title">Privacy Practices</h3>

          <div className="aup-vertical-group">
            <div className="aup-form-group-full">
              <label className="aup-label" style={{ marginBottom: '12px' }}>
                Business Practices <span className="aup-required">*</span>
              </label>
              <p className="aup-helper-text" style={{ marginBottom: '12px' }}>
                Select all that apply to your business
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="international_operations"
                    checked={formData.international_operations}
                    onChange={handleChange}
                  />
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    <strong>International Operations</strong> - Disclose personal information overseas
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="serves_children"
                    checked={formData.serves_children}
                    onChange={handleChange}
                  />
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    <strong>Serves Children Under 18</strong> - Service is used by minors
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="payment_data_collected"
                    checked={formData.payment_data_collected}
                    onChange={handleChange}
                  />
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    <strong>Payment Data Collected</strong> - Collect credit card or payment information
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="cookies_used"
                    checked={formData.cookies_used}
                    onChange={handleChange}
                  />
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    <strong>Cookies Used</strong> - Use cookies or tracking technologies
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="marketing_purpose"
                    checked={formData.marketing_purpose}
                    onChange={handleChange}
                  />
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    <strong>Direct Marketing</strong> - Use personal information for marketing purposes
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Data Collection Information Section */}
        <div className="aup-section">
          <h3 className="aup-section-title">Data Collection Information</h3>

          <div className="aup-vertical-group">
            <div className="aup-form-group-full">
              <label className="aup-label">
                Types of Personal Information Collected <span className="aup-required">*</span>
              </label>
              <textarea
                name="data_types"
                value={formData.data_types}
                onChange={handleChange}
                required
                rows="3"
                className="aup-textarea"
                placeholder="e.g., Name, email, phone number, address, payment details, usage data"
              />
              <p className="aup-helper-text">
                List all types of personal information your business collects
              </p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Collection Methods <span className="aup-required">*</span>
              </label>
              <textarea
                name="collection_methods"
                value={formData.collection_methods}
                onChange={handleChange}
                required
                rows="3"
                className="aup-textarea"
                placeholder="e.g., Website forms, email, phone, customer support, cookies, third-party integrations"
              />
              <p className="aup-helper-text">
                How do you collect personal information?
              </p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Purposes of Collection <span className="aup-required">*</span>
              </label>
              <textarea
                name="collection_purposes"
                value={formData.collection_purposes}
                onChange={handleChange}
                required
                rows="4"
                className="aup-textarea"
                placeholder="e.g., Provide services, process payments, customer support, improve products, marketing, comply with legal obligations"
              />
              <p className="aup-helper-text">
                Why do you collect personal information?
              </p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Third-Party Sharing <span className="aup-required">*</span>
              </label>
              <textarea
                name="third_parties"
                value={formData.third_parties}
                onChange={handleChange}
                required
                rows="3"
                className="aup-textarea"
                placeholder="e.g., Payment processors, cloud hosting providers, analytics services, or 'None' if not applicable"
              />
              <p className="aup-helper-text">
                List third parties you share personal information with, or write "None"
              </p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Data Storage Location <span className="aup-required">*</span>
              </label>
              <input
                type="text"
                name="storage_location"
                value={formData.storage_location}
                onChange={handleChange}
                required
                className="aup-input"
                placeholder="e.g., Australia, AWS Sydney region"
              />
              <p className="aup-helper-text">
                Where is personal information stored?
              </p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Security Measures <span className="aup-required">*</span>
              </label>
              <textarea
                name="security_measures"
                value={formData.security_measures}
                onChange={handleChange}
                required
                rows="3"
                className="aup-textarea"
                placeholder="e.g., Encryption, access controls, firewalls, regular security audits, staff training"
              />
              <p className="aup-helper-text">
                What security measures protect personal information?
              </p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Data Retention Period <span className="aup-required">*</span>
              </label>
              <input
                type="text"
                name="retention_period"
                value={formData.retention_period}
                onChange={handleChange}
                required
                className="aup-input"
                placeholder="e.g., 7 years for financial records, 2 years for customer data"
              />
              <p className="aup-helper-text">
                How long do you retain personal information?
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
            <li>Comprehensive Privacy Policy (2,000-3,000 words)</li>
            <li>All 13 Australian Privacy Principles (APPs) addressed</li>
            <li>Clear sections on collection, use, disclosure, and security</li>
            <li>Access and correction procedures</li>
            <li>Complaints process and OAIC contact information</li>
            <li>Compliant with Privacy Act 1988</li>
          </ul>
        </div>

        <button
          type="submit"
          className={`aup-submit-button ${loading ? 'aup-submit-button-disabled' : ''}`}
          disabled={loading}
        >
          {loading ? 'Generating Policy...' : 'Generate Privacy Policy'}
        </button>
      </form>
    </div>
  );
};

export default PrivacyPolicyInput;