import React, { useState } from 'react';
import '../styling/AupOutput.css';
import { useNavigate } from 'react-router-dom';

const AupOutput = ({ policyData, loading }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  // Check if policyData has the structured format (with sections array)
  const hasStructuredData = policyData && policyData.sections && Array.isArray(policyData.sections);

  const handleCopyToClipboard = () => {
    if (!policyData) return;
    
    // Create text version of the policy
    let policyText = `ACCEPTABLE USE POLICY\n\n`;
    policyText += `Company: ${policyData.company_name}\n`;
    policyText += `Last Updated: ${formatDate(policyData.last_updated)}\n\n`;
    
    if (policyData.sections && policyData.sections.length > 0) {
      policyData.sections.forEach(section => {
        policyText += `${section.section_number}. ${section.heading}\n\n`;
        if (section.content && section.content.length > 0) {
          section.content.forEach(paragraph => {
            policyText += `${paragraph}\n\n`;
          });
        }
      });
    }

    navigator.clipboard.writeText(policyText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const handleDownloadPDF = () => {
    // Placeholder for PDF download functionality
    alert('PDF download functionality will be implemented with backend integration');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="aup-output-container">
        <div className="aup-output-loading">
          <div className="aup-loading-spinner"></div>
          <p>Generating your Acceptable Use Policy...</p>
        </div>
      </div>
    );
  }

  if (!policyData) {
    return (
      <div className="aup-output-empty">
        <p>No policy generated yet. Please fill out the form to generate your Acceptable Use Policy.</p>
      </div>
    );
  }

  // Check if we have valid structured data
  if (!hasStructuredData) {
    return (
      <div className="aup-output-container">
        <div className="aup-sample-notice" style={{ backgroundColor: '#fee', borderColor: '#fcc' }}>
          <strong>⚠️ Error:</strong> Policy data is in an unexpected format. Please try generating the policy again.
        </div>
      </div>
    );
  }

  return (
    <div className="aup-output-container">
      <div className="aup-output-header">
        <h2 className="aup-output-title">Acceptable Use Policy</h2>
        <div className="aup-output-actions">
          <button 
            className="aup-output-btn aup-output-btn-download"
            onClick={() => navigate('/aup')}
          >
            📄 Download PDF
          </button>
          <button 
            className="aup-output-btn aup-output-btn-copy"
            onClick={handleCopyToClipboard}
          >
            {copySuccess ? '✓ Copied!' : '📋 Copy to Clipboard'}
          </button>
        </div>
      </div>

      <div className="aup-output-content">
        {/* Policy Header */}
        <div className="aup-policy-header">
          <h1 className="aup-policy-company">{policyData.company_name || 'Company Name'}</h1>
          <p className="aup-policy-date">
            Last Updated: {formatDate(policyData.last_updated)}
          </p>
          <div className="aup-policy-contact">
            <p><strong>Website:</strong> {policyData.website_url || 'N/A'}</p>
            <p><strong>Email:</strong> {policyData.contact_email || 'N/A'}</p>
            {policyData.phone_number && (
              <p><strong>Phone:</strong> {policyData.phone_number}</p>
            )}
          </div>
        </div>

        {/* Policy Sections */}
        <div className="aup-policy-body">
          {policyData.sections && policyData.sections.map((section) => (
            <div key={section.section_number} className="aup-policy-section">
              <h3 className="aup-section-heading">
                {section.section_number}. {section.heading}
              </h3>
              <div className="aup-section-content">
                {section.content && section.content.map((paragraph, idx) => (
                  <p key={idx} className="aup-section-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Structured Data Summary (Collapsible) */}
        <details className="aup-structured-summary">
          <summary className="aup-summary-heading">📊 Policy Summary & Key Points</summary>
          
          {policyData.permitted_usage_types && policyData.permitted_usage_types.length > 0 && (
            <div className="aup-summary-section">
              <h4>Permitted Usage Types</h4>
              <ul>
                {policyData.permitted_usage_types.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policyData.prohibited_activities && policyData.prohibited_activities.length > 0 && (
            <div className="aup-summary-section">
              <h4>Prohibited Activities</h4>
              <ul>
                {policyData.prohibited_activities.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policyData.industry_specific_restrictions && policyData.industry_specific_restrictions.length > 0 && (
            <div className="aup-summary-section">
              <h4>Industry-Specific Restrictions</h4>
              <ul>
                {policyData.industry_specific_restrictions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policyData.user_monitoring_practices && policyData.user_monitoring_practices.length > 0 && (
            <div className="aup-summary-section">
              <h4>User Monitoring Practices</h4>
              <ul>
                {policyData.user_monitoring_practices.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policyData.reporting_illegal_activities && policyData.reporting_illegal_activities.length > 0 && (
            <div className="aup-summary-section">
              <h4>Reporting Illegal Activities</h4>
              <ul>
                {policyData.reporting_illegal_activities.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </details>
      </div>
    </div>
  );
};

export default AupOutput;