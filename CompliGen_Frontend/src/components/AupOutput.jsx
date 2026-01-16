import React, { useState } from 'react';
import '../styling/AupOutput.css';

const AupOutput = ({ policyData, loading }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Sample data for demonstration
  const sampleData = {
    company_name: "LedgerSafe Pty Ltd",
    last_updated: "2025-01-16",
    website_url: "https://ledgersafe.com.au",
    contact_email: "legal@ledgersafe.com.au",
    phone_number: "+61 3 9000 1122",
    permitted_usage_types: [
      "Commercial accounting and financial reporting",
      "Internal financial audits and compliance monitoring",
      "Business analytics and forecasting",
      "Multi-user collaboration on financial data"
    ],
    prohibited_activities: [
      "Unauthorised access to other users' accounts or data",
      "Sharing login credentials with third parties",
      "Automated scraping or data extraction",
      "Reverse engineering of the platform",
      "Uploading unlawful or fraudulent financial data",
      "Impersonation of another user or entity",
      "Distribution of malware or malicious code",
      "Using the service for money laundering activities"
    ],
    industry_specific_restrictions: [
      "Credit card numbers must not be stored unless the user maintains PCI-DSS compliance",
      "The platform must not be used to make personal consumer banking decisions without appropriate licensing",
      "Users must comply with Australian Accounting Standards when generating reports"
    ],
    user_monitoring_practices: [
      "System access logs are monitored continuously for compliance purposes",
      "Audit trails track all financial data modifications",
      "Automated alerts flag suspicious activity patterns",
      "Regular security reviews are conducted on user accounts"
    ],
    reporting_illegal_activities: [
      "Suspected fraud or illegal financial activity should be reported via email to legal@ledgersafe.com.au",
      "LedgerSafe will cooperate with law enforcement investigations",
      "Disclosures may be made to ASIC, AUSTRAC, or other regulators where legally required",
      "Users have protection under whistleblower provisions when reporting in good faith"
    ],
    sections: [
      {
        section_number: 1,
        heading: "Last Updated",
        content: ["This Acceptable Use Policy was last updated on 16 January 2025."]
      },
      {
        section_number: 2,
        heading: "Purpose of This Policy",
        content: [
          "This Acceptable Use Policy (\"Policy\") sets out the rules and expectations for using the LedgerSafe platform (\"Service\"). Our goal is to maintain a secure, compliant, and professional environment for all users.",
          "By accessing or using our Service, you agree to comply with this Policy. Violation of these terms may result in suspension or termination of your account."
        ]
      },
      {
        section_number: 3,
        heading: "Who This Policy Applies To",
        content: [
          "This Policy applies to:",
          "• All registered users of the LedgerSafe platform",
          "• Business administrators and account holders",
          "• Any third parties accessing the Service on behalf of a registered user",
          "• All usage of the Service, whether via web interface, mobile app, or API"
        ]
      },
      {
        section_number: 4,
        heading: "Permitted Use",
        content: [
          "You may use the LedgerSafe platform for the following purposes:",
          "• Commercial accounting and financial reporting",
          "• Internal financial audits and compliance monitoring",
          "• Business analytics and forecasting",
          "• Multi-user collaboration on financial data",
          "All use must be in accordance with applicable Australian laws and regulations, including but not limited to the Corporations Act 2001 and relevant accounting standards."
        ]
      },
      {
        section_number: 5,
        heading: "Prohibited Activities",
        content: [
          "The following activities are strictly prohibited when using our Service:",
          "• Unauthorised access to other users' accounts or data",
          "• Sharing login credentials with third parties",
          "• Automated scraping or data extraction",
          "• Reverse engineering of the platform",
          "• Uploading unlawful or fraudulent financial data",
          "• Impersonation of another user or entity",
          "• Distribution of malware or malicious code",
          "• Using the service for money laundering activities",
          "This list is not exhaustive. Any activity that compromises the security, integrity, or availability of the Service is prohibited."
        ]
      },
      {
        section_number: 6,
        heading: "Industry-Specific Restrictions",
        content: [
          "Due to the nature of financial services, the following industry-specific restrictions apply:",
          "• Credit card numbers must not be stored unless the user maintains PCI-DSS compliance",
          "• The platform must not be used to make personal consumer banking decisions without appropriate licensing",
          "• Users must comply with Australian Accounting Standards when generating reports",
          "Users are responsible for ensuring their use of the Service complies with all applicable financial services regulations and professional standards."
        ]
      },
      {
        section_number: 7,
        heading: "User Content and User Responsibilities",
        content: [
          "You are solely responsible for all data, information, and content you upload to or generate through the Service (\"User Content\").",
          "You warrant that your User Content:",
          "• Does not violate any applicable laws or regulations",
          "• Does not infringe on any third party's intellectual property or privacy rights",
          "• Is accurate and not fraudulent or misleading",
          "• Does not contain malicious code or viruses",
          "LedgerSafe reserves the right to remove or restrict access to User Content that violates this Policy."
        ]
      },
      {
        section_number: 8,
        heading: "Security and Account Protection Expectations",
        content: [
          "You must take reasonable steps to protect your account security, including:",
          "• Using strong, unique passwords",
          "• Enabling multi-factor authentication where available",
          "• Not sharing your login credentials",
          "• Logging out of shared or public devices",
          "• Promptly notifying us of any suspected unauthorised access",
          "You are responsible for all activity that occurs under your account. We recommend regular security reviews and password updates."
        ]
      },
      {
        section_number: 9,
        heading: "Monitoring, Logging, and Enforcement",
        content: [
          "To maintain security and compliance, LedgerSafe implements the following monitoring practices:",
          "• System access logs are monitored continuously for compliance purposes",
          "• Audit trails track all financial data modifications",
          "• Automated alerts flag suspicious activity patterns",
          "• Regular security reviews are conducted on user accounts",
          "We may investigate suspected violations of this Policy. Monitoring is conducted in accordance with our Privacy Policy and applicable privacy laws."
        ]
      },
      {
        section_number: 10,
        heading: "Reporting Illegal or Prohibited Activity",
        content: [
          "If you become aware of any activity that violates this Policy or applicable laws, please report it immediately:",
          "• Suspected fraud or illegal financial activity should be reported via email to legal@ledgersafe.com.au",
          "• LedgerSafe will cooperate with law enforcement investigations",
          "• Disclosures may be made to ASIC, AUSTRAC, or other regulators where legally required",
          "• Users have protection under whistleblower provisions when reporting in good faith",
          "We take all reports seriously and will investigate promptly while maintaining appropriate confidentiality."
        ]
      },
      {
        section_number: 11,
        heading: "Consequences of Breach",
        content: [
          "Violation of this Policy may result in one or more of the following actions:",
          "• Warning and requirement to cease the prohibited activity",
          "• Temporary suspension of your account",
          "• Permanent termination of your account and access to the Service",
          "• Legal action, including claims for damages",
          "• Reporting to law enforcement or regulatory authorities",
          "The specific action taken will depend on the nature and severity of the violation. We reserve the right to take immediate action to protect the Service and other users."
        ]
      },
      {
        section_number: 12,
        heading: "Changes to This Policy",
        content: [
          "LedgerSafe may update this Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other operational reasons.",
          "We will notify you of material changes by:",
          "• Posting the updated Policy on our website",
          "• Updating the \"Last Updated\" date at the top of this document",
          "• Sending an email notification to your registered email address (for significant changes)",
          "Your continued use of the Service after changes become effective constitutes acceptance of the updated Policy."
        ]
      },
      {
        section_number: 13,
        heading: "Contact Information",
        content: [
          "If you have questions about this Acceptable Use Policy or wish to report a violation, please contact us:",
          "Email: legal@ledgersafe.com.au",
          "Phone: +61 3 9000 1122",
          "Website: https://ledgersafe.com.au",
          "We aim to respond to all inquiries within 2 business days."
        ]
      }
    ]
  };

  // Check if policyData has the structured format (with sections array)
  // If not, use sample data for demonstration
  const hasStructuredData = policyData && policyData.sections && Array.isArray(policyData.sections);
  const displayData = hasStructuredData ? policyData : sampleData;

  const handleCopyToClipboard = () => {
    // Create text version of the policy
    let policyText = `ACCEPTABLE USE POLICY\n\n`;
    policyText += `Company: ${displayData.company_name}\n`;
    policyText += `Last Updated: ${formatDate(displayData.last_updated)}\n\n`;
    
    displayData.sections.forEach(section => {
      policyText += `${section.section_number}. ${section.heading}\n\n`;
      section.content.forEach(paragraph => {
        policyText += `${paragraph}\n\n`;
      });
    });

    navigator.clipboard.writeText(policyText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleDownloadPDF = () => {
    // Placeholder for PDF download functionality
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
          <p>Generating your Acceptable Use Policy...</p>
        </div>
      </div>
    );
  }

  if (!policyData && !displayData) {
    return (
      <div className="aup-output-empty">
        <p>No policy generated yet. Please fill out the form to generate your Acceptable Use Policy.</p>
      </div>
    );
  }

  // Show sample data message if we're using sample data instead of real policy
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
        <h2 className="aup-output-title">Acceptable Use Policy</h2>
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
            <p><strong>Website:</strong> {displayData.website_url}</p>
            <p><strong>Email:</strong> {displayData.contact_email}</p>
            {displayData.phone_number && (
              <p><strong>Phone:</strong> {displayData.phone_number}</p>
            )}
          </div>
        </div>

        {/* Policy Sections */}
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

        {/* Structured Data Summary (Collapsible) */}
        <details className="aup-structured-summary">
          <summary className="aup-summary-heading">📊 Policy Summary & Key Points</summary>
          
          {displayData.permitted_usage_types && displayData.permitted_usage_types.length > 0 && (
            <div className="aup-summary-section">
              <h4>Permitted Usage Types</h4>
              <ul>
                {displayData.permitted_usage_types.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.prohibited_activities && displayData.prohibited_activities.length > 0 && (
            <div className="aup-summary-section">
              <h4>Prohibited Activities</h4>
              <ul>
                {displayData.prohibited_activities.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.industry_specific_restrictions && displayData.industry_specific_restrictions.length > 0 && (
            <div className="aup-summary-section">
              <h4>Industry-Specific Restrictions</h4>
              <ul>
                {displayData.industry_specific_restrictions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.user_monitoring_practices && displayData.user_monitoring_practices.length > 0 && (
            <div className="aup-summary-section">
              <h4>User Monitoring Practices</h4>
              <ul>
                {displayData.user_monitoring_practices.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.reporting_illegal_activities && displayData.reporting_illegal_activities.length > 0 && (
            <div className="aup-summary-section">
              <h4>Reporting Illegal Activities</h4>
              <ul>
                {displayData.reporting_illegal_activities.map((item, idx) => (
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