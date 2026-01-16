import React, { useState } from 'react';
import '../styling/AupOutput.css'; // Reusing AUP styles

const TosOutput = ({ policyData, loading }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Sample data for demonstration
  const sampleData = {
    company_name: "CloudServe Pty Ltd",
    last_updated: "2025-01-16",
    website_url: "https://cloudserve.com.au",
    contact_email: "legal@cloudserve.com.au",
    phone_number: "+61 3 9000 9900",
    service_description: [
      "CloudServe provides a cloud-based project management and collaboration platform designed for Australian businesses.",
      "Our service includes task management, team collaboration, file storage, and reporting tools accessible via web and mobile applications."
    ],
    service_type: [
      "SaaS platform",
      "Cloud-based collaboration tools",
      "Project management software"
    ],
    pricing_model: [
      "Monthly subscription billing",
      "Annual billing available with 10% discount",
      "Per-user pricing model"
    ],
    free_trial_terms: [
      "14-day free trial available for all new accounts",
      "No credit card required to start trial",
      "Full access to Pro features during trial",
      "Automatically converts to paid subscription unless cancelled"
    ],
    payment_terms: [
      "Billed monthly in advance on subscription date",
      "Accepted payment methods displayed at checkout",
      "Auto-renewal applies unless cancelled",
      "All fees in Australian dollars (AUD)"
    ],
    refund_policy: [
      "Pro-rata refunds available for annual subscriptions cancelled within first 30 days",
      "Monthly subscribers may cancel anytime with no refund for current month",
      "Full refund if service is not as described or materially different from our representations",
      "All refunds subject to rights under Australian Consumer Law"
    ],
    cancellation_terms: [
      "Cancel anytime via account settings",
      "No cancellation fees apply",
      "Access continues until end of current billing period",
      "Data exported within 30 days of cancellation",
      "Account deleted 90 days after cancellation"
    ],
    eligibility_requirements: [
      "Must have legal capacity to enter into a binding contract",
      "If representing an organisation, must be authorised to bind that organisation",
      "Must provide accurate and complete registration information",
      "Must maintain security of account credentials"
    ],
    prohibited_activities: [
      "Unauthorised access to other users' accounts or data",
      "Automated scraping or data mining without permission",
      "Distribution of malware, viruses, or malicious code",
      "Harassment, abuse, or threatening behaviour",
      "Violating applicable laws or regulations",
      "Reverse engineering or decompiling the platform",
      "Reselling or sublicensing the service without authorisation",
      "Interfering with platform operations or security measures"
    ],
    user_content_license: [
      "You retain all ownership rights in content you upload",
      "You grant us a non-exclusive, worldwide license to host, store, and display your content as necessary to provide the service",
      "This license includes the right to backup, reproduce, and transmit your content",
      "The license terminates when you delete your content or close your account"
    ],
    user_content_responsibilities: [
      "You must ensure all uploaded content is lawful and does not infringe third-party rights",
      "You are solely responsible for all content you upload, share, or transmit",
      "You must not upload content that violates intellectual property rights",
      "We may remove content that violates these Terms without prior notice"
    ],
    intellectual_property_ownership: [
      "All rights, title, and interest in the CloudServe platform remain with CloudServe Pty Ltd",
      "Users retain ownership of their data and content",
      "CloudServe trademarks and logos are owned by CloudServe Pty Ltd",
      "Nothing in these Terms transfers any intellectual property rights to you except the limited license to use the service"
    ],
    confidentiality_obligations: [
      "You must maintain the confidentiality of any information marked as confidential or that you should reasonably understand to be confidential",
      "You must not disclose confidential information to third parties without our prior written consent",
      "Confidentiality obligations survive termination of these Terms",
      "Exceptions apply for information that is publicly available or independently developed"
    ],
    consumer_guarantees: [
      "Under the Australian Consumer Law, you have certain rights that cannot be excluded, including guarantees relating to acceptable quality, fitness for purpose, and correspondence with description.",
      "Our services come with guarantees that cannot be excluded under the Australian Consumer Law.",
      "For major failures with the service, you are entitled to cancel your contract and receive a refund, or to receive compensation for the decline in value.",
      "You are also entitled to be compensated for any other reasonably foreseeable loss or damage resulting from a failure to comply with consumer guarantees."
    ],
    acl_statement: "Nothing in these Terms excludes, restricts or modifies rights under the Australian Consumer Law.",
    liability_limitations: [
      "To the maximum extent permitted by law, our liability for breach of any implied warranty or condition is limited to resupplying the service or paying the cost of resupplying the service.",
      "For business customers, our total liability for any claims arising from these Terms is limited to the amount paid by you in the 12 months prior to the event giving rise to the claim.",
      "We are not liable for any indirect, incidental, special, or consequential damages, including loss of profits, data, or business opportunities.",
      "These limitations do not apply to the extent prohibited by the Australian Consumer Law or where liability cannot be excluded by law."
    ],
    disclaimers: [
      "The service is provided 'as-is' to the extent permitted by the Australian Consumer Law.",
      "We do not guarantee that the service will be uninterrupted, error-free, or completely secure.",
      "You are responsible for maintaining backups of your data.",
      "We disclaim any warranties to the extent permitted by law, subject to consumer guarantee rights."
    ],
    termination_rights: [
      "Either party may terminate these Terms with 30 days' written notice.",
      "We may suspend or terminate your access immediately if you breach these Terms or engage in prohibited activities.",
      "Upon termination, your access to the service will cease and any outstanding fees become immediately due.",
      "We will delete your data within 90 days of termination unless legally required to retain it.",
      "Sections relating to liability, confidentiality, and dispute resolution survive termination."
    ],
    dispute_resolution_process: [
      "If you have a complaint or dispute, please contact us first at legal@cloudserve.com.au to attempt to resolve the matter.",
      "If we cannot resolve the dispute directly, you may contact the Australian Competition and Consumer Commission (ACCC) or your state or territory Fair Trading office.",
      "Small business disputes may be eligible for the ACCC's small business mediation service.",
      "If informal resolution fails, disputes will be resolved through mediation before commencing legal proceedings."
    ],
    governing_law: "New South Wales, Australia",
    support_terms: [
      "Email support available to all paid subscribers",
      "Response times: 2 business days for standard support, 4 hours for premium support",
      "Support is provided during Australian business hours (AEST)",
      "No SLA applies to free trial users"
    ],
    availability_terms: [
      "We target 99.5% uptime for our service",
      "Scheduled maintenance will be notified at least 48 hours in advance",
      "We do not guarantee uninterrupted or error-free service",
      "Service credits may be available for extended outages as described in our SLA (premium plans only)"
    ],
    international_terms: [
      "Service available in Australia, New Zealand, and Singapore",
      "Currency conversions apply for non-AUD transactions",
      "Users outside Australia must comply with their local laws",
      "Data may be processed in multiple jurisdictions"
    ],
    sections: [
      {
        section_number: 1,
        heading: "Acceptance of Terms",
        content: [
          "These Terms of Service ('Terms') constitute a legally binding agreement between you and CloudServe Pty Ltd ('CloudServe', 'we', 'us', or 'our').",
          "By accessing or using our service, you agree to be bound by these Terms. If you do not agree to these Terms, you must not use our service.",
          "We may update these Terms from time to time. Your continued use of the service after changes constitutes acceptance of the updated Terms."
        ]
      },
      {
        section_number: 2,
        heading: "Description of Services",
        content: [
          "CloudServe provides a cloud-based project management and collaboration platform designed for Australian businesses.",
          "Our service includes task management, team collaboration, file storage, and reporting tools accessible via web and mobile applications.",
          "Features and functionality may vary depending on your subscription plan.",
          "We reserve the right to modify, suspend, or discontinue any aspect of the service with reasonable notice."
        ]
      },
      {
        section_number: 3,
        heading: "Accounts and Eligibility",
        content: [
          "To use our service, you must:",
          "• Have legal capacity to enter into a binding contract",
          "• If representing an organisation, be authorised to bind that organisation to these Terms",
          "• Provide accurate and complete registration information",
          "• Maintain the security of your account credentials",
          "You are responsible for all activity that occurs under your account. Notify us immediately of any unauthorised access."
        ]
      },
      {
        section_number: 4,
        heading: "Subscription, Trials and Billing",
        content: [
          "We offer the following subscription options:",
          "• Monthly subscription billing",
          "• Annual billing available with 10% discount",
          "• Per-user pricing model",
          "Free Trial: We offer a 14-day free trial for new accounts with no credit card required. Full Pro features are available during the trial. Trials automatically convert to paid subscriptions unless cancelled.",
          "Payment Terms: Fees are billed monthly in advance on your subscription date. Accepted payment methods are displayed at checkout. Auto-renewal applies unless you cancel. All fees are in Australian dollars (AUD)."
        ]
      },
      {
        section_number: 5,
        heading: "Refunds and Cancellations",
        content: [
          "Refunds:",
          "• Pro-rata refunds available for annual subscriptions cancelled within first 30 days",
          "• Monthly subscribers may cancel anytime with no refund for current month",
          "• Full refund if service is not as described or materially different from our representations",
          "• All refunds subject to rights under Australian Consumer Law",
          "Cancellations:",
          "• Cancel anytime via account settings with no cancellation fees",
          "• Access continues until end of current billing period",
          "• Data can be exported within 30 days of cancellation",
          "• Accounts are deleted 90 days after cancellation"
        ]
      },
      {
        section_number: 6,
        heading: "Consumer Guarantees",
        content: [
          "Under the Australian Consumer Law, you have certain rights that cannot be excluded, including guarantees relating to acceptable quality, fitness for purpose, and correspondence with description.",
          "Our services come with guarantees that cannot be excluded under the Australian Consumer Law.",
          "For major failures with the service, you are entitled to cancel your contract and receive a refund, or to receive compensation for the decline in value.",
          "You are also entitled to be compensated for any other reasonably foreseeable loss or damage resulting from a failure to comply with consumer guarantees.",
          "Nothing in these Terms excludes, restricts or modifies rights under the Australian Consumer Law."
        ]
      },
      {
        section_number: 7,
        heading: "Acceptable Use and Prohibited Activities",
        content: [
          "You must not engage in the following prohibited activities:",
          "• Unauthorised access to other users' accounts or data",
          "• Automated scraping or data mining without permission",
          "• Distribution of malware, viruses, or malicious code",
          "• Harassment, abuse, or threatening behaviour",
          "• Violating applicable laws or regulations",
          "• Reverse engineering or decompiling the platform",
          "• Reselling or sublicensing the service without authorisation",
          "• Interfering with platform operations or security measures",
          "We reserve the right to suspend or terminate accounts that violate these restrictions."
        ]
      },
      {
        section_number: 8,
        heading: "User Content and Data",
        content: [
          "You retain all ownership rights in content you upload to our platform.",
          "By uploading content, you grant us a non-exclusive, worldwide license to host, store, and display your content as necessary to provide the service. This license includes the right to backup, reproduce, and transmit your content.",
          "The license terminates when you delete your content or close your account.",
          "User Responsibilities:",
          "• You must ensure all uploaded content is lawful and does not infringe third-party rights",
          "• You are solely responsible for all content you upload, share, or transmit",
          "• You must not upload content that violates intellectual property rights",
          "• We may remove content that violates these Terms without prior notice"
        ]
      },
      {
        section_number: 9,
        heading: "Intellectual Property",
        content: [
          "All rights, title, and interest in the CloudServe platform remain with CloudServe Pty Ltd.",
          "Users retain ownership of their data and content.",
          "CloudServe trademarks and logos are owned by CloudServe Pty Ltd.",
          "Nothing in these Terms transfers any intellectual property rights to you except the limited license to use the service as provided."
        ]
      },
      {
        section_number: 10,
        heading: "Confidentiality",
        content: [
          "You must maintain the confidentiality of any information marked as confidential or that you should reasonably understand to be confidential.",
          "You must not disclose confidential information to third parties without our prior written consent.",
          "Confidentiality obligations survive termination of these Terms.",
          "Exceptions apply for information that is publicly available, independently developed, or required to be disclosed by law."
        ]
      },
      {
        section_number: 11,
        heading: "Availability, Support and Maintenance",
        content: [
          "Service Availability:",
          "• We target 99.5% uptime for our service",
          "• Scheduled maintenance will be notified at least 48 hours in advance",
          "• We do not guarantee uninterrupted or error-free service",
          "• Service credits may be available for extended outages (premium plans only)",
          "Support:",
          "• Email support available to all paid subscribers",
          "• Response times: 2 business days for standard support, 4 hours for premium support",
          "• Support provided during Australian business hours (AEST)",
          "• No SLA applies to free trial users"
        ]
      },
      {
        section_number: 12,
        heading: "Disclaimers",
        content: [
          "The service is provided 'as-is' to the extent permitted by the Australian Consumer Law.",
          "We do not guarantee that the service will be uninterrupted, error-free, or completely secure.",
          "You are responsible for maintaining backups of your data.",
          "We disclaim any warranties to the extent permitted by law, subject to consumer guarantee rights under the Australian Consumer Law."
        ]
      },
      {
        section_number: 13,
        heading: "Limitation of Liability",
        content: [
          "To the maximum extent permitted by law, our liability for breach of any implied warranty or condition is limited to resupplying the service or paying the cost of resupplying the service.",
          "For business customers, our total liability for any claims arising from these Terms is limited to the amount paid by you in the 12 months prior to the event giving rise to the claim.",
          "We are not liable for any indirect, incidental, special, or consequential damages, including loss of profits, data, or business opportunities.",
          "These limitations do not apply to the extent prohibited by the Australian Consumer Law or where liability cannot be excluded by law."
        ]
      },
      {
        section_number: 14,
        heading: "Indemnity",
        content: [
          "You agree to indemnify and hold harmless CloudServe Pty Ltd, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable legal fees) arising from:",
          "• Your use of the service",
          "• Your breach of these Terms",
          "• Your violation of any law or third-party rights",
          "• Content you upload or transmit through the service",
          "This indemnity does not apply to the extent the claim arises from our negligence or breach."
        ]
      },
      {
        section_number: 15,
        heading: "Suspension and Termination",
        content: [
          "Either party may terminate these Terms with 30 days' written notice.",
          "We may suspend or terminate your access immediately if you breach these Terms or engage in prohibited activities.",
          "Upon termination:",
          "• Your access to the service will cease",
          "• Any outstanding fees become immediately due",
          "• We will delete your data within 90 days unless legally required to retain it",
          "Sections relating to liability, confidentiality, and dispute resolution survive termination."
        ]
      },
      {
        section_number: 16,
        heading: "Dispute Resolution",
        content: [
          "If you have a complaint or dispute, please contact us first at legal@cloudserve.com.au to attempt to resolve the matter.",
          "If we cannot resolve the dispute directly, you may contact:",
          "• Australian Competition and Consumer Commission (ACCC)",
          "• Your state or territory Fair Trading office",
          "Small business disputes may be eligible for the ACCC's small business mediation service.",
          "If informal resolution fails, disputes will be resolved through mediation before commencing legal proceedings."
        ]
      },
      {
        section_number: 17,
        heading: "International Users",
        content: [
          "Our service is available in Australia, New Zealand, and Singapore.",
          "Currency conversions apply for non-AUD transactions.",
          "Users outside Australia must comply with their local laws in addition to these Terms.",
          "Data may be processed in multiple jurisdictions as described in our Privacy Policy."
        ]
      },
      {
        section_number: 18,
        heading: "Governing Law and Jurisdiction",
        content: [
          "These Terms are governed by the laws of New South Wales, Australia.",
          "Any disputes arising from these Terms will be subject to the exclusive jurisdiction of the courts of New South Wales, Australia.",
          "Nothing in this clause limits your rights under the Australian Consumer Law."
        ]
      },
      {
        section_number: 19,
        heading: "Changes to These Terms",
        content: [
          "We may update these Terms from time to time to reflect changes in our services, legal requirements, or business practices.",
          "We will notify you of material changes by:",
          "• Posting the updated Terms on our website",
          "• Updating the 'Last Updated' date",
          "• Sending an email notification (for significant changes)",
          "Your continued use of the service after changes become effective constitutes acceptance of the updated Terms.",
          "If you do not agree to the updated Terms, you must stop using the service and may cancel your subscription."
        ]
      },
      {
        section_number: 20,
        heading: "Contact Information",
        content: [
          "If you have questions about these Terms of Service, please contact us:",
          "CloudServe Pty Ltd",
          "Email: legal@cloudserve.com.au",
          "Phone: +61 3 9000 9900",
          "Website: https://cloudserve.com.au",
          "We aim to respond to all inquiries within 2 business days."
        ]
      }
    ]
  };

  // Check if policyData has the structured format
  const hasStructuredData = policyData && policyData.sections && Array.isArray(policyData.sections);
  const displayData = hasStructuredData ? policyData : sampleData;

  const handleCopyToClipboard = () => {
    let policyText = `TERMS OF SERVICE\n\n`;
    policyText += `Company: ${displayData.company_name}\n`;
    policyText += `Last Updated: ${formatDate(displayData.last_updated)}\n\n`;
    
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
          <p>Generating your Terms of Service...</p>
        </div>
      </div>
    );
  }

  if (!policyData && !displayData) {
    return (
      <div className="aup-output-empty">
        <p>No terms generated yet. Please fill out the form to generate your Terms of Service.</p>
      </div>
    );
  }

  const isUsingSampleData = !hasStructuredData && policyData;

  return (
    <div className="aup-output-container">
      {isUsingSampleData && (
        <div className="aup-sample-notice">
          <strong>📝 Note:</strong> This is sample output for demonstration. 
          When integrated with the backend API, your actual terms will appear here.
        </div>
      )}
      
      <div className="aup-output-header">
        <h2 className="aup-output-title">Terms of Service</h2>
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
        {displayData.service_description && displayData.service_description.length > 0 && (
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
            {displayData.service_description.map((desc, idx) => (
              <p key={idx} style={{ margin: '8px 0', fontSize: '14px', lineHeight: '1.6', color: '#4a5568' }}>
                {desc}
              </p>
            ))}
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

        {/* Key Terms Summary */}
        <details className="aup-structured-summary">
          <summary className="aup-summary-heading">📋 Key Terms at a Glance</summary>
          
          {displayData.pricing_model && displayData.pricing_model.length > 0 && (
            <div className="aup-summary-section">
              <h4>Pricing</h4>
              <ul>
                {displayData.pricing_model.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.free_trial_terms && displayData.free_trial_terms.length > 0 && (
            <div className="aup-summary-section">
              <h4>Free Trial</h4>
              <ul>
                {displayData.free_trial_terms.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.refund_policy && displayData.refund_policy.length > 0 && (
            <div className="aup-summary-section">
              <h4>Refund Policy</h4>
              <ul>
                {displayData.refund_policy.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.cancellation_terms && displayData.cancellation_terms.length > 0 && (
            <div className="aup-summary-section">
              <h4>Cancellation</h4>
              <ul>
                {displayData.cancellation_terms.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </details>

        {/* Consumer Rights */}
        {displayData.consumer_guarantees && displayData.consumer_guarantees.length > 0 && (
          <details className="aup-structured-summary" open>
            <summary className="aup-summary-heading">🛡️ Your Consumer Rights (ACL)</summary>
            
            <div className="aup-summary-section">
              {displayData.consumer_guarantees.map((guarantee, idx) => (
                <p key={idx} style={{ marginBottom: '12px', fontSize: '14px', lineHeight: '1.6' }}>
                  {guarantee}
                </p>
              ))}
              {displayData.acl_statement && (
                <div style={{
                  backgroundColor: '#ebf8ff',
                  border: '2px solid #3182ce',
                  borderRadius: '6px',
                  padding: '12px',
                  marginTop: '16px'
                }}>
                  <strong style={{ color: '#2c5282' }}>Important:</strong>
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                    {displayData.acl_statement}
                  </p>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Prohibited Activities */}
        {displayData.prohibited_activities && displayData.prohibited_activities.length > 0 && (
          <details className="aup-structured-summary">
            <summary className="aup-summary-heading">🚫 Prohibited Activities</summary>
            
            <div className="aup-summary-section">
              <ul>
                {displayData.prohibited_activities.map((activity, idx) => (
                  <li key={idx}>{activity}</li>
                ))}
              </ul>
            </div>
          </details>
        )}

        {/* Support and Availability */}
        <details className="aup-structured-summary">
          <summary className="aup-summary-heading">💬 Support & Service Availability</summary>
          
          {displayData.support_terms && displayData.support_terms.length > 0 && (
            <div className="aup-summary-section">
              <h4>Support</h4>
              <ul>
                {displayData.support_terms.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.availability_terms && displayData.availability_terms.length > 0 && (
            <div className="aup-summary-section">
              <h4>Service Availability</h4>
              <ul>
                {displayData.availability_terms.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </details>

        {/* Governing Law */}
        {displayData.governing_law && (
          <div style={{
            backgroundColor: '#f7fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '16px',
            marginTop: '30px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#4a5568' }}>
              <strong>Governing Law:</strong> {displayData.governing_law}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TosOutput;