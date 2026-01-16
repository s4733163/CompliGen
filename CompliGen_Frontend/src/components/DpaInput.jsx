import React, { useState } from 'react';
import '../styling/AupInput.css'; // Reusing AUP styles

const DpaInput = ({ onPolicyGenerated, onLoadingChange }) => {
  const [formData, setFormData] = useState({
    // Basic Company Information
    company_name: '',
    business_description: '',
    industry_type: '',
    company_size: '',
    business_location_state_territory: '',
    website_url: '',
    contact_email: '',
    phone_number: '',
    customer_type: '',
    international_customers: '',
    children_under_18_served: '',
    
    // DPA Specific Fields
    role_controller_or_processor: '',
    sub_processors_used: '',
    data_processing_locations: '',
    security_certifications: '',
    breach_notification_timeframe: '',
    data_deletion_timelines: '',
    audit_rights: '',
    processing_summary: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (onLoadingChange) onLoadingChange(true);
    
    // Simulate policy generation - replace with actual API call later
    setTimeout(() => {
      onPolicyGenerated(formData);
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }, 2000);
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

  const roleOptions = [
    'Processor (processing data on behalf of customers)',
    'Controller (determining purposes and means of processing)',
    'Both (depending on the service)'
  ];

  return (
    <div className="aup-container">
      <h2 className="aup-title">Generate Data Processing Agreement</h2>
      
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
                placeholder="e.g., DataVault Pty Ltd"
              />
            </div>

            <div className="aup-form-group">
              <label className="aup-label">
                Industry Type <span className="aup-required">*</span>
              </label>
              <select
                name="industry_type"
                value={formData.industry_type}
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
                Business Location (State/Territory) <span className="aup-required">*</span>
              </label>
              <select
                name="business_location_state_territory"
                value={formData.business_location_state_territory}
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
                name="website_url"
                value={formData.website_url}
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

            <div className="aup-form-group">
              <label className="aup-label">
                International Customers <span className="aup-required">*</span>
              </label>
              <input
                type="text"
                name="international_customers"
                value={formData.international_customers}
                onChange={handleChange}
                required
                className="aup-input"
                placeholder="e.g., Yes - Australia and New Zealand"
              />
            </div>

            <div className="aup-form-group">
              <label className="aup-label">
                Children Under 18 Served <span className="aup-required">*</span>
              </label>
              <select
                name="children_under_18_served"
                value={formData.children_under_18_served}
                onChange={handleChange}
                required
                className="aup-select"
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* DPA Specific Fields Section */}
        <div className="aup-section">
          <h3 className="aup-section-title">Data Processing Agreement Details</h3>
          
          <div className="aup-vertical-group">
            <div className="aup-form-group-full">
              <label className="aup-label">
                Role (Controller or Processor) <span className="aup-required">*</span>
              </label>
              <select
                name="role_controller_or_processor"
                value={formData.role_controller_or_processor}
                onChange={handleChange}
                required
                className="aup-select"
              >
                <option value="">Select role</option>
                {roleOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <p className="aup-helper-text">Define your role in data processing under Australian privacy law</p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Sub-Processors Used <span className="aup-required">*</span>
              </label>
              <textarea
                name="sub_processors_used"
                value={formData.sub_processors_used}
                onChange={handleChange}
                required
                rows="3"
                className="aup-textarea"
                placeholder="e.g., Cloud hosting; Email delivery; Analytics; Payment processing (separate with semicolons)"
              />
              <p className="aup-helper-text">List third-party services that process data on your behalf (separate with semicolons)</p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Data Processing Locations <span className="aup-required">*</span>
              </label>
              <textarea
                name="data_processing_locations"
                value={formData.data_processing_locations}
                onChange={handleChange}
                required
                rows="2"
                className="aup-textarea"
                placeholder="e.g., Australia; Singapore; United States (separate with semicolons)"
              />
              <p className="aup-helper-text">Where is personal information processed or stored? (separate with semicolons)</p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Security Certifications <span className="aup-required">*</span>
              </label>
              <input
                type="text"
                name="security_certifications"
                value={formData.security_certifications}
                onChange={handleChange}
                required
                className="aup-input"
                placeholder="e.g., ISO 27001, SOC 2 Type II, or 'Not specified'"
              />
              <p className="aup-helper-text">List security certifications held by your organization</p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Breach Notification Timeframe <span className="aup-required">*</span>
              </label>
              <input
                type="text"
                name="breach_notification_timeframe"
                value={formData.breach_notification_timeframe}
                onChange={handleChange}
                required
                className="aup-input"
                placeholder="e.g., Within 72 hours of becoming aware of a breach"
              />
              <p className="aup-helper-text">When will customers be notified of data breaches?</p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Data Deletion Timelines <span className="aup-required">*</span>
              </label>
              <input
                type="text"
                name="data_deletion_timelines"
                value={formData.data_deletion_timelines}
                onChange={handleChange}
                required
                className="aup-input"
                placeholder="e.g., Within 30 days of termination or upon request"
              />
              <p className="aup-helper-text">How long after termination will data be deleted?</p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Audit Rights <span className="aup-required">*</span>
              </label>
              <textarea
                name="audit_rights"
                value={formData.audit_rights}
                onChange={handleChange}
                required
                rows="3"
                className="aup-textarea"
                placeholder="e.g., Customers may request audit reports annually; On-site audits available upon reasonable notice"
              />
              <p className="aup-helper-text">What audit rights do customers have?</p>
            </div>

            <div className="aup-form-group-full">
              <label className="aup-label">
                Processing Summary <span className="aup-optional">(Optional)</span>
              </label>
              <textarea
                name="processing_summary"
                value={formData.processing_summary}
                onChange={handleChange}
                rows="3"
                className="aup-textarea"
                placeholder="e.g., Customer uploads datasets. Platform stores, analyses, and generates reports."
              />
              <p className="aup-helper-text">Brief summary of how personal information is processed</p>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className={`aup-submit-button ${loading ? 'aup-submit-button-disabled' : ''}`}
          disabled={loading}
        >
          {loading ? 'Generating Agreement...' : 'Generate Data Processing Agreement'}
        </button>
      </form>
    </div>
  );
};

export default DpaInput;