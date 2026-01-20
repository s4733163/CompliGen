import React, { useState } from 'react';
import '../styling/AupOutput.css'; // Reusing AUP styles

const CookiePolicyOutput = ({ policyData, loading }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyToClipboard = () => {
    if (!policyData) return;
    
    // Create text version of the policy
    let policyText = `COOKIE POLICY\n\n`;
    policyText += `Company: ${policyData.company_name}\n`;
    policyText += `Last Updated: ${formatDate(policyData.last_updated)}\n\n`;
    
    if (policyData.introduction && policyData.introduction.length > 0) {
      policyData.introduction.forEach(para => {
        policyText += `${para}\n\n`;
      });
    }
    
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
          <p>Generating your Cookie Policy...</p>
        </div>
      </div>
    );
  }

  if (!policyData) {
    return (
      <div className="aup-output-empty">
        <p>No policy generated yet. Please fill out the form to generate your Cookie Policy.</p>
      </div>
    );
  }

  // Check if we have valid structured data
  const hasStructuredData = policyData.sections && Array.isArray(policyData.sections);
  if (!hasStructuredData) {
    return (
      <div className="aup-output-container">
        <div className="aup-sample-notice" style={{ backgroundColor: '#fee', borderColor: '#fcc' }}>
          <strong>⚠️ Error:</strong> Cookie Policy data is in an unexpected format. Please try generating the policy again.
        </div>
      </div>
    );
  }

  return (
    <div className="aup-output-container">
      <div className="aup-output-header">
        <h2 className="aup-output-title">Cookie Policy</h2>
        <div className="aup-output-actions">
          <button 
            className="aup-output-btn aup-output-btn-download"
            onClick={handleDownloadPDF}
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
            <p><strong>Website:</strong> {policyData.website || 'N/A'}</p>
            <p><strong>Email:</strong> {policyData.contact_email || 'N/A'}</p>
            {policyData.phone_number && (
              <p><strong>Phone:</strong> {policyData.phone_number}</p>
            )}
          </div>
        </div>

        {/* Introduction */}
        {policyData.introduction && policyData.introduction.length > 0 && (
          <div className="aup-policy-body" style={{ marginBottom: '30px' }}>
            <div className="aup-policy-section">
              <h3 className="aup-section-heading">Introduction</h3>
              <div className="aup-section-content">
                {policyData.introduction.map((paragraph, idx) => (
                  <p key={idx} className="aup-section-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cookie Types Overview */}
        {policyData.cookie_types && policyData.cookie_types.length > 0 && (
          <div style={{
            backgroundColor: '#f7fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#2d3748', fontSize: '16px', fontWeight: '600' }}>
              🍪 Cookie Types We Use:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {policyData.cookie_types.map((type, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#3182ce',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  {type}
                </span>
              ))}
            </div>
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

        {/* Third-Party Services */}
        {policyData.third_party_services && policyData.third_party_services.length > 0 && (
          <details className="aup-structured-summary" open>
            <summary className="aup-summary-heading">🔗 Third-Party Cookie Services</summary>
            
            {policyData.third_party_services.map((service, idx) => (
              <div key={idx} className="aup-summary-section">
                <h4>{service.service_name}</h4>
                {service.purpose && service.purpose.length > 0 && (
                  <>
                    <p style={{ fontSize: '13px', color: '#4a5568', margin: '8px 0' }}>
                      <strong>Purpose:</strong>
                    </p>
                    <ul style={{ margin: '0 0 12px 0' }}>
                      {service.purpose.map((purpose, pIdx) => (
                        <li key={pIdx}>{purpose}</li>
                      ))}
                    </ul>
                  </>
                )}
                {service.opt_out_link && (
                  <p style={{ fontSize: '13px', color: '#2d3748', margin: 0 }}>
                    <strong>Opt-out:</strong>{' '}
                    <a 
                      href={service.opt_out_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#3182ce', textDecoration: 'underline' }}
                    >
                      {service.opt_out_link}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </details>
        )}

        {/* Browser Instructions */}
        {policyData.browser_instructions && policyData.browser_instructions.length > 0 && (
          <details className="aup-structured-summary">
            <summary className="aup-summary-heading">🌐 Browser Cookie Management</summary>
            
            {policyData.browser_instructions.map((browser, idx) => (
              <div key={idx} className="aup-summary-section">
                <h4>{browser.browser_name}</h4>
                {browser.instructions && browser.instructions.length > 0 && (
                  <ol style={{ margin: '8px 0 12px 20px', paddingLeft: 0 }}>
                    {browser.instructions.map((instruction, iIdx) => (
                      <li key={iIdx} style={{ fontSize: '14px', marginBottom: '6px' }}>
                        {instruction}
                      </li>
                    ))}
                  </ol>
                )}
                {browser.help_link && (
                  <p style={{ fontSize: '13px', color: '#2d3748', margin: 0 }}>
                    <strong>Help Link:</strong>{' '}
                    <a 
                      href={browser.help_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#3182ce', textDecoration: 'underline' }}
                    >
                      {browser.help_link}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </details>
        )}

        {/* Cookie Duration Summary */}
        {policyData.cookie_duration && policyData.cookie_duration.length > 0 && (
          <details className="aup-structured-summary">
            <summary className="aup-summary-heading">⏱️ Cookie Duration</summary>
            
            <div className="aup-summary-section">
              <ul>
                {policyData.cookie_duration.map((duration, idx) => (
                  <li key={idx}>{duration}</li>
                ))}
              </ul>
            </div>
          </details>
        )}

        {/* Privacy Rights Notice */}
        {policyData.privacy_rights && policyData.privacy_rights.length > 0 && (
          <details className="aup-structured-summary">
            <summary className="aup-summary-heading">🔒 Your Privacy Rights</summary>
            
            <div className="aup-summary-section">
              {policyData.privacy_rights.map((right, idx) => (
                <p key={idx} style={{ marginBottom: '12px', fontSize: '14px', lineHeight: '1.6' }}>
                  {right}
                </p>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default CookiePolicyOutput;