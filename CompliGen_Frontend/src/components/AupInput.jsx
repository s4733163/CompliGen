import React, { useState } from 'react';
import '../styling/AupInput.css';

const AupInput = ({ onPolicyGenerated, onLoadingChange }) => {
    const [error, setError] = useState(null);
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

        // AUP Specific Fields
        permitted_usage_types: '',
        prohibited_activities: '',
        industry_specific_restrictions: '',
        user_monitoring_practices: '',
        reporting_illegal_activities: ''
    });

    const [loading, setLoading] = useState(false);

    const submitData = async (access_token) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/documents/generate/api/aup`, {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
            <h2 className="aup-title">Generate Acceptable Use Policy</h2>

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
                                placeholder="e.g., LedgerSafe Pty Ltd"
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

                {/* AUP Specific Fields Section */}
                <div className="aup-section">
                    <h3 className="aup-section-title">Acceptable Use Policy Details</h3>

                    <div className="aup-vertical-group">
                        <div className="aup-form-group-full">
                            <label className="aup-label">
                                Permitted Usage Types <span className="aup-required">*</span>
                            </label>
                            <textarea
                                name="permitted_usage_types"
                                value={formData.permitted_usage_types}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="aup-textarea"
                                placeholder="e.g., Commercial accounting, financial reporting, internal audits"
                            />
                            <p className="aup-helper-text">Describe the legitimate ways users can use your platform</p>
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
                                placeholder="e.g., Unauthorised access; credential sharing; scraping; reverse engineering; fraud; impersonation"
                            />
                            <p className="aup-helper-text">List activities that are not allowed on your platform</p>
                        </div>

                        <div className="aup-form-group-full">
                            <label className="aup-label">
                                Industry-Specific Restrictions <span className="aup-required">*</span>
                            </label>
                            <textarea
                                name="industry_specific_restrictions"
                                value={formData.industry_specific_restrictions}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="aup-textarea"
                                placeholder="e.g., No storage of credit card numbers unless PCI-compliant"
                            />
                            <p className="aup-helper-text">Specific restrictions related to your industry (FinTech, HealthTech, etc.)</p>
                        </div>

                        <div className="aup-form-group-full">
                            <label className="aup-label">
                                User Monitoring Practices <span className="aup-required">*</span>
                            </label>
                            <textarea
                                name="user_monitoring_practices"
                                value={formData.user_monitoring_practices}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="aup-textarea"
                                placeholder="e.g., System access logs and audit trails are monitored for compliance"
                            />
                            <p className="aup-helper-text">Describe how you monitor user activity on your platform</p>
                        </div>

                        <div className="aup-form-group-full">
                            <label className="aup-label">
                                Reporting of Illegal Activities <span className="aup-required">*</span>
                            </label>
                            <textarea
                                name="reporting_illegal_activities"
                                value={formData.reporting_illegal_activities}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="aup-textarea"
                                placeholder="e.g., Report suspected fraud via contact email; disclosures may be made to regulators"
                            />
                            <p className="aup-helper-text">How users should report illegal or prohibited activities</p>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className={`aup-submit-button ${loading ? 'aup-submit-button-disabled' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Generating Policy...' : 'Generate Acceptable Use Policy'}
                </button>
            </form>
        </div>
    );
};

export default AupInput;