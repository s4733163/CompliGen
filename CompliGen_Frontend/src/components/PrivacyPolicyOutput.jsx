import React, { useState } from 'react';
import '../styling/AupOutput.css'; // Reusing AUP styles

const PrivacyPolicyOutput = ({ policyData, loading }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyToClipboard = () => {
    if (!policyData) return;

    let policyText = `PRIVACY POLICY\n\n`;
    policyText += `Company: ${policyData.company_name}\n`;
    policyText += `Last Updated: ${formatDate(policyData.last_updated)}\n\n`;
    
    if (policyData.introduction && policyData.introduction.length > 0) {
      policyText += `INTRODUCTION\n\n`;
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
        
        if (section.subsections && section.subsections.length > 0) {
          section.subsections.forEach(subsection => {
            policyText += `${subsection.subsection_number}. ${subsection.heading}\n\n`;
            if (subsection.content && subsection.content.length > 0) {
              subsection.content.forEach(para => {
                policyText += `${para}\n\n`;
              });
            }
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
          <p>Generating your Privacy Policy...</p>
        </div>
      </div>
    );
  }

  if (!policyData) {
    return (
      <div className="aup-output-empty">
        <p>No policy generated yet. Please fill out the form to generate your Privacy Policy.</p>
      </div>
    );
  }

  // Check if we have valid structured data
  const hasStructuredData = policyData.sections && Array.isArray(policyData.sections);
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
        <h2 className="aup-output-title">Privacy Policy</h2>
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
            <p><strong>Website:</strong> {policyData.contact_info?.website || 'N/A'}</p>
            <p><strong>Email:</strong> {policyData.contact_info?.email || 'N/A'}</p>
            {policyData.contact_info?.phone && (
              <p><strong>Phone:</strong> {policyData.contact_info.phone}</p>
            )}
          </div>
        </div>

        {/* APPs Addressed Badge */}
        {policyData.apps_addressed && policyData.apps_addressed.length > 0 && (
          <div style={{
            backgroundColor: '#f7fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#2d3748', fontSize: '16px', fontWeight: '600' }}>
              ✓ Australian Privacy Principles (APPs) Addressed:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {policyData.apps_addressed.map((app) => (
                <span
                  key={app}
                  style={{
                    backgroundColor: '#48bb78',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  APP {app}
                </span>
              ))}
            </div>
          </div>
        )}

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
                
                {/* Subsections */}
                {section.subsections && section.subsections.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    {section.subsections.map((subsection) => (
                      <div key={subsection.subsection_number} style={{ marginBottom: '20px' }}>
                        <h4 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#4a5568',
                          marginBottom: '10px'
                        }}>
                          {subsection.subsection_number}. {subsection.heading}
                        </h4>
                        {subsection.content && subsection.content.map((para, pIdx) => (
                          <p key={pIdx} className="aup-section-paragraph">
                            {para}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Complaints Process */}
        {policyData.complaints_process && policyData.complaints_process.length > 0 && (
          <details className="aup-structured-summary" open>
            <summary className="aup-summary-heading">📢 How to Make a Complaint</summary>
            
            <div className="aup-summary-section">
              {policyData.complaints_process.map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '12px', fontSize: '14px', lineHeight: '1.6' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </details>
        )}

        {/* OAIC Contact */}
        {policyData.oaic_contact && policyData.oaic_contact.length > 0 && (
          <details className="aup-structured-summary">
            <summary className="aup-summary-heading">🏛️ Office of the Australian Information Commissioner (OAIC)</summary>
            
            <div className="aup-summary-section">
              {policyData.oaic_contact.map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '12px', fontSize: '14px', lineHeight: '1.6' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicyOutput;