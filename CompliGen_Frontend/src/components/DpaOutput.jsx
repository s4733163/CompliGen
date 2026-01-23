import React, { useState } from 'react';
import '../styling/AupOutput.css'; // Reusing AUP styles
import { useNavigate } from 'react-router-dom';

const DpaOutput = ({ policyData, loading }) => {
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyToClipboard = () => {
    if (!policyData) return;
    
    let policyText = `DATA PROCESSING AGREEMENT\n\n`;
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
          <p>Generating your Data Processing Agreement...</p>
        </div>
      </div>
    );
  }

  if (!policyData) {
    return (
      <div className="aup-output-empty">
        <p>No agreement generated yet. Please fill out the form to generate your Data Processing Agreement.</p>
      </div>
    );
  }

  // Check if we have valid structured data
  const hasStructuredData = policyData.sections && Array.isArray(policyData.sections);
  if (!hasStructuredData) {
    return (
      <div className="aup-output-container">
        <div className="aup-sample-notice" style={{ backgroundColor: '#fee', borderColor: '#fcc' }}>
          <strong>⚠️ Error:</strong> Agreement data is in an unexpected format. Please try generating the agreement again.
        </div>
      </div>
    );
  }

  return (
    <div className="aup-output-container">
      <div className="aup-output-header">
        <h2 className="aup-output-title">Data Processing Agreement</h2>
        <div className="aup-output-actions">
          <button 
            className="aup-output-btn aup-output-btn-download"
            onClick={() => navigate('/dpa')}
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

        {/* Main Policy Sections */}
        <div className="aup-policy-body">
          {policyData.sections && policyData.sections.filter(s => s.section_number < 20).map((section) => (
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

        {/* Annex A - Processing Details */}
        {policyData.annex_a && (
          <details className="aup-structured-summary">
            <summary className="aup-summary-heading">📋 Annex A – Processing Details</summary>
            
            {policyData.annex_a.subject_matter_of_processing && policyData.annex_a.subject_matter_of_processing.length > 0 && (
              <div className="aup-summary-section">
                <h4>Subject Matter of Processing</h4>
                <ul>
                  {policyData.annex_a.subject_matter_of_processing.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {policyData.annex_a.duration_of_processing && policyData.annex_a.duration_of_processing.length > 0 && (
              <div className="aup-summary-section">
                <h4>Duration of Processing</h4>
                <ul>
                  {policyData.annex_a.duration_of_processing.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {policyData.annex_a.nature_and_purpose_of_processing && policyData.annex_a.nature_and_purpose_of_processing.length > 0 && (
              <div className="aup-summary-section">
                <h4>Nature and Purpose of Processing</h4>
                <ul>
                  {policyData.annex_a.nature_and_purpose_of_processing.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {policyData.annex_a.categories_of_data_subjects && policyData.annex_a.categories_of_data_subjects.length > 0 && (
              <div className="aup-summary-section">
                <h4>Categories of Data Subjects</h4>
                <ul>
                  {policyData.annex_a.categories_of_data_subjects.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {policyData.annex_a.types_of_personal_information && policyData.annex_a.types_of_personal_information.length > 0 && (
              <div className="aup-summary-section">
                <h4>Types of Personal Information</h4>
                <ul>
                  {policyData.annex_a.types_of_personal_information.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {policyData.annex_a.data_processing_locations && policyData.annex_a.data_processing_locations.length > 0 && (
              <div className="aup-summary-section">
                <h4>Data Processing Locations</h4>
                <ul>
                  {policyData.annex_a.data_processing_locations.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {policyData.annex_a.sub_processors && policyData.annex_a.sub_processors.length > 0 && (
              <div className="aup-summary-section">
                <h4>Sub-processors</h4>
                <ul>
                  {policyData.annex_a.sub_processors.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.category_name}</strong>
                      {item.provider_names && item.provider_names.length > 0 && (
                        <span>: {item.provider_names.join(', ')}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </details>
        )}

        {/* Annex B - Technical and Organisational Measures */}
        {policyData.annex_b && (
          <details className="aup-structured-summary">
            <summary className="aup-summary-heading">🔒 Annex B – Technical and Organisational Measures</summary>
            
            {policyData.annex_b.technical_measures && policyData.annex_b.technical_measures.length > 0 && (
              <div className="aup-summary-section">
                <h4>Technical Security Measures</h4>
                <ul>
                  {policyData.annex_b.technical_measures.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {policyData.annex_b.organisational_measures && policyData.annex_b.organisational_measures.length > 0 && (
              <div className="aup-summary-section">
                <h4>Organisational Security Measures</h4>
                <ul>
                  {policyData.annex_b.organisational_measures.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {policyData.annex_b.physical_security_measures && policyData.annex_b.physical_security_measures.length > 0 && (
              <div className="aup-summary-section">
                <h4>Physical Security Measures</h4>
                <ul>
                  {policyData.annex_b.physical_security_measures.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {policyData.annex_b.security_certifications && policyData.annex_b.security_certifications.length > 0 && (
              <div className="aup-summary-section">
                <h4>Security Certifications</h4>
                <ul>
                  {policyData.annex_b.security_certifications.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </details>
        )}

        {/* Key Information Summary */}
        <details className="aup-structured-summary">
          <summary className="aup-summary-heading">ℹ️ Key Agreement Terms</summary>
          
          {policyData.role_controller_or_processor && policyData.role_controller_or_processor.length > 0 && (
            <div className="aup-summary-section">
              <h4>Processing Role</h4>
              <ul>
                {policyData.role_controller_or_processor.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policyData.breach_notification_timeframe && policyData.breach_notification_timeframe.length > 0 && (
            <div className="aup-summary-section">
              <h4>Breach Notification</h4>
              <ul>
                {policyData.breach_notification_timeframe.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policyData.data_deletion_timelines && policyData.data_deletion_timelines.length > 0 && (
            <div className="aup-summary-section">
              <h4>Data Deletion</h4>
              <ul>
                {policyData.data_deletion_timelines.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policyData.audit_rights && policyData.audit_rights.length > 0 && (
            <div className="aup-summary-section">
              <h4>Audit Rights</h4>
              <ul>
                {policyData.audit_rights.map((item, idx) => (
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

export default DpaOutput;