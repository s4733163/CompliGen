import React, { useState } from 'react';
import '../styling/AupOutput.css'; // Reusing AUP styles
import { useNavigate } from 'react-router-dom';


const TosOutput = ({ policyData, loading }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  const handleCopyToClipboard = () => {
    if (!policyData) return;
    
    // Create text version of the policy
    let policyText = `TERMS OF SERVICE\n\n`;
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
          <p>Generating your Terms of Service...</p>
        </div>
      </div>
    );
  }

  if (!policyData) {
    return (
      <div className="aup-output-empty">
        <p>No terms generated yet. Please fill out the form to generate your Terms of Service.</p>
      </div>
    );
  }

  // Check if we have valid structured data
  const hasStructuredData = policyData.sections && Array.isArray(policyData.sections);
  if (!hasStructuredData) {
    return (
      <div className="aup-output-container">
        <div className="aup-sample-notice" style={{ backgroundColor: '#fee', borderColor: '#fcc' }}>
          <strong>⚠️ Error:</strong> Terms data is in an unexpected format. Please try generating the policy again.
        </div>
      </div>
    );
  }

  return (
    <div className="aup-output-container">
      <div className="aup-output-header">
        <h2 className="aup-output-title">Terms of Service</h2>
        <div className="aup-output-actions">
          <button 
            className="aup-output-btn aup-output-btn-download"
            onClick={() => navigate('/tos')}
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

        {/* ACL Compliance Badge */}
        <div style={{
          backgroundColor: '#48bb78',
          color: '#ffffff',
          padding: '16px 20px',
          borderRadius: '8px',
          marginBottom: '30px',
          textAlign: 'center',
          fontWeight: '600',
          fontSize: '15px'
        }}>
          ✓ Australian Consumer Law (ACL) Compliant
        </div>

        {/* Service Description */}
        {policyData.service_description && policyData.service_description.length > 0 && (
          <div style={{
            backgroundColor: '#f7fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#2d3748', fontSize: '16px', fontWeight: '600' }}>
              About Our Service:
            </h4>
            {policyData.service_description.map((desc, idx) => (
              <p key={idx} style={{ margin: '8px 0', fontSize: '14px', lineHeight: '1.6', color: '#4a5568' }}>
                {desc}
              </p>
            ))}
          </div>
        )}

        {/* Main Policy Sections */}
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

        {/* Key Terms Summary */}
        <details className="aup-structured-summary">
          <summary className="aup-summary-heading">📋 Key Terms at a Glance</summary>
          
          {policyData.pricing_model && policyData.pricing_model.length > 0 && (
            <div className="aup-summary-section">
              <h4>Pricing</h4>
              <ul>
                {policyData.pricing_model.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policyData.free_trial_terms && policyData.free_trial_terms.length > 0 && (
            <div className="aup-summary-section">
              <h4>Free Trial</h4>
              <ul>
                {policyData.free_trial_terms.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policyData.refund_policy && policyData.refund_policy.length > 0 && (
            <div className="aup-summary-section">
              <h4>Refund Policy</h4>
              <ul>
                {policyData.refund_policy.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policyData.cancellation_terms && policyData.cancellation_terms.length > 0 && (
            <div className="aup-summary-section">
              <h4>Cancellation</h4>
              <ul>
                {policyData.cancellation_terms.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </details>

        {/* Consumer Rights */}
        {policyData.consumer_guarantees && policyData.consumer_guarantees.length > 0 && (
          <details className="aup-structured-summary" open>
            <summary className="aup-summary-heading">🛡️ Your Consumer Rights (ACL)</summary>
            
            <div className="aup-summary-section">
              {policyData.consumer_guarantees.map((guarantee, idx) => (
                <p key={idx} style={{ marginBottom: '12px', fontSize: '14px', lineHeight: '1.6' }}>
                  {guarantee}
                </p>
              ))}
              {policyData.acl_statement && (
                <div style={{
                  backgroundColor: '#ebf8ff',
                  border: '2px solid #3182ce',
                  borderRadius: '6px',
                  padding: '12px',
                  marginTop: '16px'
                }}>
                  <strong style={{ color: '#2c5282' }}>Important:</strong>
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                    {policyData.acl_statement}
                  </p>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Prohibited Activities */}
        {policyData.prohibited_activities && policyData.prohibited_activities.length > 0 && (
          <details className="aup-structured-summary">
            <summary className="aup-summary-heading">🚫 Prohibited Activities</summary>
            
            <div className="aup-summary-section">
              <ul>
                {policyData.prohibited_activities.map((activity, idx) => (
                  <li key={idx}>{activity}</li>
                ))}
              </ul>
            </div>
          </details>
        )}

        {/* Support and Availability */}
        <details className="aup-structured-summary">
          <summary className="aup-summary-heading">💬 Support & Service Availability</summary>
          
          {policyData.support_terms && policyData.support_terms.length > 0 && (
            <div className="aup-summary-section">
              <h4>Support</h4>
              <ul>
                {policyData.support_terms.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policyData.availability_terms && policyData.availability_terms.length > 0 && (
            <div className="aup-summary-section">
              <h4>Service Availability</h4>
              <ul>
                {policyData.availability_terms.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </details>

        {/* Governing Law */}
        {policyData.governing_law && (
          <div style={{
            backgroundColor: '#f7fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '16px',
            marginTop: '30px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#4a5568' }}>
              <strong>Governing Law:</strong> {policyData.governing_law}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TosOutput;