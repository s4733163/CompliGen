import React, { useState } from 'react';
import '../styling/AupOutput.css'; // Reusing AUP styles

const CookiePolicyOutput = ({ policyData, loading }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Sample data for demonstration
  const sampleData = {
    company_name: "TrackWise Pty Ltd",
    last_updated: "2025-01-16",
    website: "https://trackwise.com.au",
    contact_email: "privacy@trackwise.com.au",
    contact_phone: "+61 3 9000 7700",
    introduction: [
      "This Cookie Policy explains how TrackWise Pty Ltd ('we', 'us', or 'our') uses cookies and similar tracking technologies on our website.",
      "By using our website, you consent to the use of cookies in accordance with this policy. You can manage your cookie preferences at any time through your browser settings."
    ],
    cookie_types: [
      "Essential Cookies",
      "Analytics Cookies",
      "Marketing Cookies"
    ],
    sections: [
      {
        section_number: 1,
        heading: "What Are Cookies?",
        content: [
          "Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website.",
          "They help websites remember your preferences, improve your browsing experience, and provide information to website owners about how the site is being used.",
          "Cookies can be 'session cookies' (deleted when you close your browser) or 'persistent cookies' (remain on your device for a set period or until you delete them)."
        ]
      },
      {
        section_number: 2,
        heading: "Types of Cookies We Use",
        content: [
          "Essential Cookies: These cookies are necessary for our website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies as the website would not work properly without them.",
          "Analytics Cookies: We use analytics cookies to understand how visitors interact with our website. This helps us improve our website's performance and user experience. These cookies collect information such as pages visited, time spent on the site, and navigation paths.",
          "Marketing Cookies: These cookies track your browsing activity across different websites to deliver more relevant advertising. They help us measure the effectiveness of our marketing campaigns and show you content that may interest you."
        ]
      },
      {
        section_number: 3,
        heading: "Why We Use Cookies",
        content: [
          "We use cookies for the following purposes:",
          "• To ensure our website functions correctly and securely",
          "• To analyse website traffic and understand how visitors use our site",
          "• To improve user experience and website performance",
          "• To deliver relevant marketing content and measure campaign effectiveness",
          "• To remember your preferences and settings",
          "• To provide customer support and respond to inquiries"
        ]
      },
      {
        section_number: 4,
        heading: "Third-Party Cookies",
        content: [
          "We use services from trusted third-party providers who may also place cookies on your device. These services help us analyse website performance and deliver relevant content.",
          "The third-party services we use are listed below with information about their purpose and how to opt out of their cookies."
        ]
      },
      {
        section_number: 5,
        heading: "Cookie Duration and Expiry",
        content: [
          "Session cookies are deleted when you close your browser.",
          "Analytics cookies persist for 2 years to help us understand long-term usage patterns.",
          "Marketing cookies persist for 90 days to deliver relevant advertising during your browsing sessions.",
          "You can delete cookies at any time through your browser settings."
        ]
      },
      {
        section_number: 6,
        heading: "How to Manage Cookies",
        content: [
          "You have the right to accept or refuse cookies. Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer.",
          "Please note that if you choose to disable essential cookies, some parts of our website may not function properly.",
          "Below are instructions for managing cookies in the most common web browsers."
        ]
      },
      {
        section_number: 7,
        heading: "Changes to This Policy",
        content: [
          "We may update this Cookie Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other operational reasons.",
          "We will notify you of any material changes by updating the 'Last Updated' date at the top of this policy and, where appropriate, by posting a notice on our website or sending you an email notification.",
          "We encourage you to review this policy periodically to stay informed about how we use cookies."
        ]
      },
      {
        section_number: 8,
        heading: "Contact Us",
        content: [
          "If you have questions about this Cookie Policy or how we use cookies, please contact us:",
          "Email: privacy@trackwise.com.au",
          "Phone: +61 3 9000 7700",
          "Website: https://trackwise.com.au"
        ]
      }
    ],
    third_party_services: [
      {
        service_name: "Google Analytics",
        purpose: [
          "Analyse website traffic and user behaviour",
          "Track page views and session duration",
          "Generate reports on website performance"
        ],
        opt_out_link: "https://tools.google.com/dlpage/gaoptout/"
      },
      {
        service_name: "Facebook Pixel",
        purpose: [
          "Measure advertising campaign effectiveness",
          "Deliver targeted advertisements",
          "Track conversions and user interactions"
        ],
        opt_out_link: "https://www.facebook.com/settings?tab=ads"
      },
      {
        service_name: "Google Ads",
        purpose: [
          "Display relevant advertisements",
          "Measure ad performance",
          "Retarget website visitors"
        ],
        opt_out_link: "https://adssettings.google.com/"
      }
    ],
    cookie_duration: [
      "Session cookies are deleted when you close your browser",
      "Analytics cookies persist for 2 years",
      "Marketing cookies persist for 90 days"
    ],
    browser_instructions: [
      {
        browser_name: "Google Chrome",
        instructions: [
          "Click the menu icon (three dots) in the top right corner",
          "Select 'Settings'",
          "Click 'Privacy and security' in the left sidebar",
          "Click 'Cookies and other site data'",
          "Choose your preferred cookie settings"
        ],
        help_link: "https://support.google.com/chrome/answer/95647"
      },
      {
        browser_name: "Mozilla Firefox",
        instructions: [
          "Click the menu icon (three lines) in the top right corner",
          "Select 'Settings'",
          "Click 'Privacy & Security' in the left sidebar",
          "Scroll to 'Cookies and Site Data'",
          "Manage your cookie preferences"
        ],
        help_link: "https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox"
      },
      {
        browser_name: "Apple Safari (macOS)",
        instructions: [
          "Click 'Safari' in the menu bar",
          "Select 'Preferences'",
          "Click the 'Privacy' tab",
          "Manage cookies and website data",
          "You can block all cookies or manage them individually"
        ],
        help_link: "https://support.apple.com/en-au/guide/safari/sfri11471/mac"
      },
      {
        browser_name: "Microsoft Edge",
        instructions: [
          "Click the menu icon (three dots) in the top right corner",
          "Select 'Settings'",
          "Click 'Cookies and site permissions'",
          "Click 'Cookies and data stored'",
          "Manage your cookie settings"
        ],
        help_link: "https://support.microsoft.com/en-au/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
      },
      {
        browser_name: "iPhone/iPad (iOS Safari)",
        instructions: [
          "Open the 'Settings' app",
          "Scroll down and tap 'Safari'",
          "Scroll down to 'Privacy & Security'",
          "Tap 'Block All Cookies' or manage individually",
          "Changes apply to all websites in Safari"
        ],
        help_link: "https://support.apple.com/en-au/HT201265"
      },
      {
        browser_name: "Android (Chrome)",
        instructions: [
          "Open Chrome app",
          "Tap the menu icon (three dots) in the top right",
          "Tap 'Settings'",
          "Tap 'Site settings'",
          "Tap 'Cookies' and manage your preferences"
        ],
        help_link: "https://support.google.com/chrome/answer/95647"
      }
    ]
  };

  // Check if policyData has the structured format
  const hasStructuredData = policyData && policyData.sections && Array.isArray(policyData.sections);
  const displayData = hasStructuredData ? policyData : sampleData;

  const handleCopyToClipboard = () => {
    let policyText = `COOKIE POLICY\n\n`;
    policyText += `Company: ${displayData.company_name}\n`;
    policyText += `Last Updated: ${formatDate(displayData.last_updated)}\n\n`;
    
    if (displayData.introduction) {
      displayData.introduction.forEach(para => {
        policyText += `${para}\n\n`;
      });
    }
    
    displayData.sections && displayData.sections.forEach(section => {
      policyText += `${section.section_number}. ${section.heading}\n\n`;
      section.content && section.content.forEach(paragraph => {
        policyText += `${paragraph}\n\n`;
      });
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
          <p>Generating your Cookie Policy...</p>
        </div>
      </div>
    );
  }

  if (!policyData && !displayData) {
    return (
      <div className="aup-output-empty">
        <p>No policy generated yet. Please fill out the form to generate your Cookie Policy.</p>
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
          <h1 className="aup-policy-company">{displayData.company_name}</h1>
          <p className="aup-policy-date">
            Last Updated: {formatDate(displayData.last_updated)}
          </p>
          <div className="aup-policy-contact">
            <p><strong>Website:</strong> {displayData.website}</p>
            <p><strong>Email:</strong> {displayData.contact_email}</p>
            {displayData.contact_phone && (
              <p><strong>Phone:</strong> {displayData.contact_phone}</p>
            )}
          </div>
        </div>

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

        {/* Cookie Types Overview */}
        {displayData.cookie_types && displayData.cookie_types.length > 0 && (
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
              {displayData.cookie_types.map((type, idx) => (
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
              </div>
            </div>
          ))}
        </div>

        {/* Third-Party Services */}
        {displayData.third_party_services && displayData.third_party_services.length > 0 && (
          <details className="aup-structured-summary" open>
            <summary className="aup-summary-heading">🔗 Third-Party Cookie Services</summary>
            
            {displayData.third_party_services.map((service, idx) => (
              <div key={idx} className="aup-summary-section">
                <h4>{service.service_name}</h4>
                <p style={{ fontSize: '13px', color: '#4a5568', margin: '8px 0' }}>
                  <strong>Purpose:</strong>
                </p>
                <ul style={{ margin: '0 0 12px 0' }}>
                  {service.purpose && service.purpose.map((purpose, pIdx) => (
                    <li key={pIdx}>{purpose}</li>
                  ))}
                </ul>
                {service.opt_out_link && (
                  <p style={{ fontSize: '13px', color: '#2d3748', margin: 0 }}>
                    <strong>Opt-out:</strong> {service.opt_out_link}
                  </p>
                )}
              </div>
            ))}
          </details>
        )}

        {/* Browser Instructions */}
        {displayData.browser_instructions && displayData.browser_instructions.length > 0 && (
          <details className="aup-structured-summary">
            <summary className="aup-summary-heading">🌐 Browser Cookie Management</summary>
            
            {displayData.browser_instructions.map((browser, idx) => (
              <div key={idx} className="aup-summary-section">
                <h4>{browser.browser_name}</h4>
                <ol style={{ margin: '8px 0 12px 20px', paddingLeft: 0 }}>
                  {browser.instructions && browser.instructions.map((instruction, iIdx) => (
                    <li key={iIdx} style={{ fontSize: '14px', marginBottom: '6px' }}>
                      {instruction}
                    </li>
                  ))}
                </ol>
                {browser.help_link && (
                  <p style={{ fontSize: '13px', color: '#2d3748', margin: 0 }}>
                    <strong>Help Link:</strong> {browser.help_link}
                  </p>
                )}
              </div>
            ))}
          </details>
        )}

        {/* Cookie Duration Summary */}
        {displayData.cookie_duration && displayData.cookie_duration.length > 0 && (
          <details className="aup-structured-summary">
            <summary className="aup-summary-heading">⏱️ Cookie Duration</summary>
            
            <div className="aup-summary-section">
              <ul>
                {displayData.cookie_duration.map((duration, idx) => (
                  <li key={idx}>{duration}</li>
                ))}
              </ul>
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default CookiePolicyOutput;