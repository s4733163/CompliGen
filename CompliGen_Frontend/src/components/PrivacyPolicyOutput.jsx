import React, { useState } from 'react';
import '../styling/AupOutput.css'; // Reusing AUP styles

const PrivacyPolicyOutput = ({ policyData, loading }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Sample data for demonstration
  const sampleData = {
    company_name: "SecureData Pty Ltd",
    last_updated: "2025-01-16",
    introduction: [
      "SecureData Pty Ltd ('we', 'us', or 'our') is committed to protecting your privacy and complying with the Australian Privacy Act 1988 and the Australian Privacy Principles (APPs).",
      "This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our cloud-based data analytics services.",
      "By using our services, you consent to the collection and use of your personal information as described in this Privacy Policy."
    ],
    sections: [
      {
        section_number: 1,
        heading: "What Personal Information We Collect",
        content: [
          "We collect personal information that is necessary to provide our services to you. The types of personal information we collect include:"
        ],
        subsections: [
          {
            subsection_number: "1.1",
            heading: "Information You Provide",
            content: [
              "• Name, email address, and phone number",
              "• Business name and contact details",
              "• Account credentials and login information",
              "• Payment information (processed securely by third-party payment processors)",
              "• Communications with our support team"
            ]
          },
          {
            subsection_number: "1.2",
            heading: "Information Collected Automatically",
            content: [
              "• Usage data and analytics (pages visited, features used, session duration)",
              "• Device information (IP address, browser type, operating system)",
              "• Cookies and tracking technologies (see our Cookie Policy for details)"
            ]
          }
        ]
      },
      {
        section_number: 2,
        heading: "How We Collect Personal Information",
        content: [
          "We collect personal information through various methods:",
          "• Directly from you when you register for our services, complete forms, or contact us",
          "• Automatically through cookies and analytics tools when you use our website and services",
          "• From third parties such as payment processors and identity verification services",
          "• Through customer support interactions via email, phone, or chat"
        ],
        subsections: []
      },
      {
        section_number: 3,
        heading: "Why We Collect Personal Information (APP 3 & 6)",
        content: [
          "We collect and use your personal information for the following purposes:",
          "• To provide and maintain our cloud analytics services",
          "• To process payments and manage your account",
          "• To provide customer support and respond to inquiries",
          "• To improve our services and develop new features",
          "• To send important service updates and notifications",
          "• To comply with legal obligations and resolve disputes",
          "We will only use your personal information for the purposes for which it was collected, or for related purposes you would reasonably expect."
        ],
        subsections: []
      },
      {
        section_number: 4,
        heading: "Notification of Collection (APP 5)",
        content: [
          "When we collect your personal information, we will take reasonable steps to notify you of:",
          "• Our identity and contact details",
          "• The purposes for which we are collecting your information",
          "• The consequences if we do not collect your information (such as being unable to provide our services)",
          "• Any third parties we may disclose your information to",
          "• How you can access and correct your information",
          "• How you can make a complaint about a breach of the APPs"
        ],
        subsections: []
      },
      {
        section_number: 5,
        heading: "Use and Disclosure of Personal Information (APP 6)",
        content: [
          "We may use and disclose your personal information for the purposes described in Section 3.",
          "We do not sell your personal information to third parties. We may share your information with:"
        ],
        subsections: [
          {
            subsection_number: "5.1",
            heading: "Service Providers",
            content: [
              "We engage trusted third-party service providers to help us operate our business, including:",
              "• Cloud hosting providers (AWS Sydney region)",
              "• Payment processors (Stripe Australia)",
              "• Analytics services (Google Analytics)",
              "• Customer support tools",
              "These service providers are bound by confidentiality obligations and may only use your information to perform services on our behalf."
            ]
          },
          {
            subsection_number: "5.2",
            heading: "Legal Obligations",
            content: [
              "We may disclose your personal information if required by law, such as to comply with a subpoena, court order, or legal process, or to protect our rights, property, or safety."
            ]
          }
        ]
      },
      {
        section_number: 6,
        heading: "Direct Marketing (APP 7)",
        content: [
          "We do not currently use personal information for direct marketing purposes.",
          "If this changes in the future, we will only send you marketing communications if you have consented to receive them.",
          "You will always have the option to opt out of marketing communications by following the unsubscribe instructions in any marketing email or by contacting us directly."
        ],
        subsections: []
      },
      {
        section_number: 7,
        heading: "Cross-Border Disclosure (APP 8)",
        content: [
          "We store your personal information in Australia using AWS Sydney region data centres.",
          "We do not currently disclose personal information to overseas recipients.",
          "If this changes in the future, we will take reasonable steps to ensure that overseas recipients handle your information in accordance with the APPs or seek your consent where required."
        ],
        subsections: []
      },
      {
        section_number: 8,
        heading: "Data Security (APP 11)",
        content: [
          "We take the security of your personal information seriously and implement appropriate technical and organisational measures to protect it from unauthorised access, disclosure, alteration, or destruction.",
          "Our security measures include:",
          "• Encryption of data in transit and at rest (AES-256)",
          "• Access controls and authentication requirements",
          "• Regular security audits and vulnerability assessments",
          "• Secure data centres with physical access controls",
          "• Staff training on privacy and security obligations",
          "• Incident response procedures",
          "However, no method of transmission or storage is 100% secure. If we become aware of a data breach that is likely to result in serious harm, we will notify you and the Office of the Australian Information Commissioner as required by law."
        ],
        subsections: []
      },
      {
        section_number: 9,
        heading: "Data Retention",
        content: [
          "We retain your personal information for as long as necessary to fulfill the purposes for which it was collected and to comply with our legal obligations.",
          "• Customer account data: Retained for the duration of your account plus 7 years for financial records",
          "• Transaction records: Retained for 7 years as required by Australian tax law",
          "• Support communications: Retained for 2 years",
          "• Usage analytics: Retained for 2 years",
          "When personal information is no longer required, we will take reasonable steps to destroy or de-identify it."
        ],
        subsections: []
      },
      {
        section_number: 10,
        heading: "Access to Your Personal Information (APP 12)",
        content: [
          "You have the right to request access to the personal information we hold about you.",
          "To request access:",
          "1. Contact us using the details in Section 13",
          "2. Verify your identity (we may require proof of identity)",
          "3. Specify the information you wish to access",
          "We will respond to your request within 30 days. In some cases, we may charge a reasonable fee for providing access, which we will notify you of in advance.",
          "We may refuse access in certain circumstances permitted by the Privacy Act, such as where providing access would pose a serious threat to health or safety, or would have an unreasonable impact on the privacy of others."
        ],
        subsections: []
      },
      {
        section_number: 11,
        heading: "Correction of Personal Information (APP 13)",
        content: [
          "You have the right to request correction of personal information we hold about you if it is inaccurate, out-of-date, incomplete, irrelevant, or misleading.",
          "To request a correction:",
          "1. Contact us using the details in Section 13",
          "2. Specify the information you believe is incorrect",
          "3. Provide the correct information",
          "We will respond to your request within 30 days. If we refuse to correct your information, we will provide you with written notice of our reasons and the complaint mechanisms available to you.",
          "You can also update some of your information directly through your account settings."
        ],
        subsections: []
      },
      {
        section_number: 12,
        heading: "Cookies and Tracking Technologies",
        content: [
          "We use cookies and similar tracking technologies to improve your experience on our website and services.",
          "We use the following types of cookies:",
          "• Essential cookies: Necessary for the website to function",
          "• Analytics cookies: Help us understand how visitors use our website",
          "• Functional cookies: Remember your preferences",
          "You can manage your cookie preferences through your browser settings. For more information, please see our Cookie Policy.",
          "We use Google Analytics to analyse website usage. You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on."
        ],
        subsections: []
      },
      {
        section_number: 13,
        heading: "Contact Us",
        content: [
          "If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:",
          "Email: privacy@securedata.com.au",
          "Phone: +61 3 9000 8800",
          "Website: https://securedata.com.au",
          "We will respond to your inquiry within 5 business days."
        ],
        subsections: []
      }
    ],
    complaints_process: [
      "If you believe we have breached the Australian Privacy Principles or this Privacy Policy, you can lodge a complaint with us.",
      "To lodge a complaint:",
      "1. Contact us using the details in Section 13",
      "2. Provide details of your complaint in writing",
      "3. Include any relevant supporting information",
      "We will investigate your complaint and respond within 30 days. If you are not satisfied with our response, we will provide information about further steps you can take."
    ],
    oaic_contact: [
      "If you are not satisfied with our response to your complaint, you can lodge a complaint with the Office of the Australian Information Commissioner (OAIC):",
      "Website: www.oaic.gov.au",
      "Email: enquiries@oaic.gov.au",
      "Phone: 1300 363 992",
      "Mail: GPO Box 5218, Sydney NSW 2001"
    ],
    contact_info: {
      email: "privacy@securedata.com.au",
      phone: "+61 3 9000 8800",
      website: "https://securedata.com.au",
      postal_address: null
    },
    apps_addressed: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13]
  };

  // Check if policyData has the structured format
  const hasStructuredData = policyData && policyData.sections && Array.isArray(policyData.sections);
  const displayData = hasStructuredData ? policyData : sampleData;

  const handleCopyToClipboard = () => {
    let policyText = `PRIVACY POLICY\n\n`;
    policyText += `Company: ${displayData.company_name}\n`;
    policyText += `Last Updated: ${formatDate(displayData.last_updated)}\n\n`;
    
    if (displayData.introduction) {
      policyText += `INTRODUCTION\n\n`;
      displayData.introduction.forEach(para => {
        policyText += `${para}\n\n`;
      });
    }
    
    displayData.sections && displayData.sections.forEach(section => {
      policyText += `${section.section_number}. ${section.heading}\n\n`;
      section.content && section.content.forEach(paragraph => {
        policyText += `${paragraph}\n\n`;
      });
      
      if (section.subsections && section.subsections.length > 0) {
        section.subsections.forEach(subsection => {
          policyText += `${subsection.subsection_number}. ${subsection.heading}\n\n`;
          subsection.content && subsection.content.forEach(para => {
            policyText += `${para}\n\n`;
          });
        });
      }
    });

    navigator.clipboard.writeText(policyText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleDownloadPDF = () => {
    alert('PDF download functionality will be implemented with backend integration');
  };

  const formatDate = (dateString) => {
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

  if (!policyData && !displayData) {
    return (
      <div className="aup-output-empty">
        <p>No policy generated yet. Please fill out the form to generate your Privacy Policy.</p>
      </div>
    );
  }

  const isUsingSampleData = !hasStructuredData && policyData;

  return (
    <div className="aup-output-container">
      {isUsingSampleData && (
        <div className="aup-sample-notice">
          <strong>📝 Note:</strong> This is sample output for demonstration. 
          When integrated with the backend API, your actual policy will appear here.
        </div>
      )}
      
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
          <h1 className="aup-policy-company">{displayData.company_name}</h1>
          <p className="aup-policy-date">
            Last Updated: {formatDate(displayData.last_updated)}
          </p>
          <div className="aup-policy-contact">
            <p><strong>Website:</strong> {displayData.contact_info.website}</p>
            <p><strong>Email:</strong> {displayData.contact_info.email}</p>
            {displayData.contact_info.phone && (
              <p><strong>Phone:</strong> {displayData.contact_info.phone}</p>
            )}
          </div>
        </div>

        {/* APPs Addressed Badge */}
        {displayData.apps_addressed && displayData.apps_addressed.length > 0 && (
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
              {displayData.apps_addressed.map((app) => (
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
        {displayData.introduction && displayData.introduction.length > 0 && (
          <div className="aup-policy-body" style={{ marginBottom: '30px' }}>
            <div className="aup-policy-section">
              <h3 className="aup-section-heading">Introduction</h3>
              <div className="aup-section-content">
                {displayData.introduction.map((paragraph, idx) => (
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
          {displayData.sections && displayData.sections.map((section) => (
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
        {displayData.complaints_process && displayData.complaints_process.length > 0 && (
          <details className="aup-structured-summary" open>
            <summary className="aup-summary-heading">📢 How to Make a Complaint</summary>
            
            <div className="aup-summary-section">
              {displayData.complaints_process.map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '12px', fontSize: '14px', lineHeight: '1.6' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </details>
        )}

        {/* OAIC Contact */}
        {displayData.oaic_contact && displayData.oaic_contact.length > 0 && (
          <details className="aup-structured-summary">
            <summary className="aup-summary-heading">🏛️ Office of the Australian Information Commissioner (OAIC)</summary>
            
            <div className="aup-summary-section">
              {displayData.oaic_contact.map((paragraph, idx) => (
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