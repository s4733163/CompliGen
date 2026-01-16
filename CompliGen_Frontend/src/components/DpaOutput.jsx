import React, { useState } from 'react';
import '../styling/AupOutput.css'; // Reusing AUP styles

const DpaOutput = ({ policyData, loading }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Sample data for demonstration
  const sampleData = {
    company_name: "DataVault Pty Ltd",
    last_updated: "2025-01-16",
    website_url: "https://datavault.com.au",
    contact_email: "legal@datavault.com.au",
    phone_number: "+61 3 9000 5500",
    role_controller_or_processor: [
      "Processor - DataVault processes personal information on behalf of customers who act as Controllers"
    ],
    breach_notification_timeframe: [
      "Within 72 hours of becoming aware of an eligible data breach"
    ],
    data_deletion_timelines: [
      "Within 30 days of termination or upon customer request"
    ],
    audit_rights: [
      "Customers may request audit reports annually",
      "On-site audits available upon reasonable notice and at customer's expense"
    ],
    data_processing_locations: [
      "Australia (Sydney, Melbourne)",
      "Singapore"
    ],
    definitions: {
      terms: [
        "Agreement: The main service agreement between the parties to which this DPA is appended.",
        "Controller: The entity that determines the purposes and means of processing Personal Information.",
        "Customer: The entity that has entered into the Agreement with the Processor.",
        "Data Protection Laws: All applicable laws relating to Personal Information, including the Privacy Act 1988 (Cth) and the APPs.",
        "Personal Data: Information relating to an identified or identifiable natural person (equivalent to Personal Information, used in international contracts).",
        "Personal Information: Information or an opinion about an identified individual, or an individual who is reasonably identifiable, as defined in the Privacy Act 1988 (Cth).",
        "Processor: The entity that processes Personal Information on behalf of the Controller.",
        "Processing: Any operation performed on Personal Information, such as collection, recording, organisation, storage, use, disclosure, or destruction.",
        "Sub-processor: Any third party engaged by the Processor to process Personal Information on behalf of the Customer.",
        "Eligible Data Breach: A breach likely to result in serious harm to individuals, as defined under the NDB scheme of the Privacy Act 1988 (Cth)."
      ]
    },
    annex_a: {
      subject_matter_of_processing: [
        "Provision of cloud-based data analytics and storage services"
      ],
      duration_of_processing: [
        "For the term of the Agreement"
      ],
      nature_and_purpose_of_processing: [
        "To provide the DataVault platform",
        "To store, analyse, and generate reports based on customer data",
        "To provide customer support and maintain the service"
      ],
      categories_of_data_subjects: [
        "Business customers' employees",
        "End customers",
        "Sales contacts",
        "Support inquiries"
      ],
      types_of_personal_information: [
        "Names",
        "Email addresses",
        "Phone numbers",
        "Business contact details",
        "Transaction data",
        "Customer identifiers",
        "Usage data"
      ],
      data_processing_locations: [
        "Australia (Sydney, Melbourne)",
        "Singapore"
      ],
      sub_processors: [
        {
          category_name: "Cloud hosting",
          provider_names: []
        },
        {
          category_name: "Email delivery",
          provider_names: []
        },
        {
          category_name: "Analytics",
          provider_names: []
        }
      ]
    },
    annex_b: {
      technical_measures: [
        "Encryption of Personal Information at rest and in transit (AES-256 or equivalent)",
        "Multi-factor authentication for access to systems containing Personal Information",
        "Network security controls including firewalls and intrusion detection",
        "Regular security monitoring and logging",
        "Secure software development practices",
        "Regular vulnerability assessments and patching"
      ],
      organisational_measures: [
        "Access controls based on role and need-to-know principle",
        "Background checks for personnel with access to Personal Information",
        "Confidentiality agreements for all personnel",
        "Regular security awareness training",
        "Incident response and business continuity procedures",
        "Documented policies for data handling and security",
        "Regular review and testing of security measures"
      ],
      physical_security_measures: [
        "Secure data centre facilities with access controls",
        "Environmental controls and redundancy",
        "Secure disposal of media containing Personal Information"
      ],
      security_certifications: [
        "ISO 27001",
        "SOC 2 Type II"
      ]
    },
    sections: [
      {
        section_number: 1,
        heading: "Last Updated",
        content: ["This Data Processing Agreement was last updated on 16 January 2025."]
      },
      {
        section_number: 2,
        heading: "Parties and Purpose",
        content: [
          "This Data Processing Agreement (\"DPA\") is entered into between DataVault Pty Ltd (\"Processor\") and the customer (\"Controller\" or \"Customer\").",
          "This DPA governs the processing of Personal Information by the Processor on behalf of the Controller in connection with the services provided under the main Agreement.",
          "This DPA is incorporated into and forms part of the Agreement between the parties."
        ]
      },
      {
        section_number: 3,
        heading: "Definitions",
        content: [
          "In this DPA, the following terms have the meanings set out below:",
          "• Agreement: The main service agreement between the parties to which this DPA is appended.",
          "• Controller: The entity that determines the purposes and means of processing Personal Information.",
          "• Customer: The entity that has entered into the Agreement with the Processor.",
          "• Data Protection Laws: All applicable laws relating to Personal Information, including the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).",
          "• Personal Data: Information relating to an identified or identifiable natural person (equivalent to Personal Information, used in international contracts).",
          "• Personal Information: Information or an opinion about an identified individual, or an individual who is reasonably identifiable, as defined in the Privacy Act 1988 (Cth).",
          "• Processor: The entity that processes Personal Information on behalf of the Controller.",
          "• Processing: Any operation performed on Personal Information, such as collection, recording, organisation, storage, use, disclosure, or destruction.",
          "• Sub-processor: Any third party engaged by the Processor to process Personal Information on behalf of the Customer.",
          "• Eligible Data Breach: A breach likely to result in serious harm to individuals, as defined under the Notifiable Data Breaches (NDB) scheme of the Privacy Act 1988 (Cth)."
        ]
      },
      {
        section_number: 4,
        heading: "Roles and Scope",
        content: [
          "The Customer acts as the Controller and determines the purposes and means of processing Personal Information.",
          "DataVault acts as the Processor and processes Personal Information only on behalf of and in accordance with the documented instructions of the Customer.",
          "The scope of processing is described in Annex A to this DPA."
        ]
      },
      {
        section_number: 5,
        heading: "Details of Processing",
        content: [
          "The nature, purpose, duration, and other details of the processing activities carried out by the Processor are set out in Annex A (Processing Details).",
          "The Processor shall process Personal Information only for the purposes described in Annex A and in accordance with the Customer's documented instructions."
        ]
      },
      {
        section_number: 6,
        heading: "Processor Obligations",
        content: [
          "The Processor must:",
          "• Process Personal Information only on documented instructions from the Controller, including regarding transfers of Personal Information outside Australia",
          "• Ensure that persons authorised to process Personal Information are subject to confidentiality obligations",
          "• Implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, as described in Annex B",
          "• Assist the Controller in meeting its obligations regarding security, breach notification, and responding to requests from data subjects",
          "• At the Controller's choice, delete or return all Personal Information after the end of provision of services, and delete existing copies (unless retention is required by law)",
          "• Make available to the Controller all information necessary to demonstrate compliance with this DPA",
          "• Notify the Controller without undue delay upon becoming aware of an Eligible Data Breach"
        ]
      },
      {
        section_number: 7,
        heading: "Controller Obligations",
        content: [
          "The Controller must:",
          "• Ensure that it has all necessary rights and consents to provide Personal Information to the Processor for processing",
          "• Provide clear and lawful instructions to the Processor regarding the processing of Personal Information",
          "• Comply with all applicable Data Protection Laws in relation to its use of the services",
          "• Be responsible for the accuracy, quality, and legality of Personal Information provided to the Processor"
        ]
      },
      {
        section_number: 8,
        heading: "Confidentiality",
        content: [
          "The Processor shall ensure that all personnel who have access to Personal Information are subject to appropriate confidentiality obligations.",
          "The Processor shall maintain the confidentiality of all Personal Information and shall not disclose it to any third party except as permitted under this DPA or as required by law."
        ]
      },
      {
        section_number: 9,
        heading: "Security Measures",
        content: [
          "The Processor shall implement and maintain appropriate technical and organisational measures to protect Personal Information against unauthorised or unlawful processing and against accidental loss, destruction, damage, alteration, or disclosure.",
          "These measures are described in Annex B (Technical and Organisational Measures) and shall be reviewed and updated regularly to ensure they remain effective and appropriate."
        ]
      },
      {
        section_number: 10,
        heading: "Sub-processors",
        content: [
          "The Processor may engage Sub-processors to carry out specific processing activities on behalf of the Controller.",
          "The Processor shall:",
          "• Maintain a list of approved Sub-processors (as set out in Annex A)",
          "• Notify the Controller of any intended changes concerning the addition or replacement of Sub-processors, giving the Controller the opportunity to object",
          "• Ensure that Sub-processors are bound by data protection obligations equivalent to those in this DPA",
          "• Remain fully liable to the Controller for the performance of any Sub-processor's obligations"
        ]
      },
      {
        section_number: 11,
        heading: "Overseas Disclosures (APP 8)",
        content: [
          "The Processor may transfer Personal Information to overseas recipients as described in Annex A.",
          "Where Personal Information is disclosed overseas, the Processor shall:",
          "• Ensure that overseas recipients handle Personal Information in accordance with the Australian Privacy Principles or an equivalent standard",
          "• Take reasonable steps to ensure that overseas recipients do not breach the APPs in relation to that information",
          "• Remain accountable for any overseas disclosures under APP 8 of the Privacy Act 1988 (Cth)"
        ]
      },
      {
        section_number: 12,
        heading: "Assistance with Individual Rights",
        content: [
          "The Processor shall, to the extent possible, assist the Controller in responding to requests from individuals to exercise their rights under Data Protection Laws.",
          "This includes requests for access, correction, erasure, or objection to processing of Personal Information.",
          "Any requests received directly by the Processor shall be promptly forwarded to the Controller."
        ]
      },
      {
        section_number: 13,
        heading: "Eligible Data Breaches (NDB scheme)",
        content: [
          "The Processor shall notify the Controller within 72 hours of becoming aware of an Eligible Data Breach affecting Personal Information processed under this DPA.",
          "The notification shall include:",
          "• A description of the nature of the breach",
          "• The categories and approximate number of individuals and records concerned",
          "• The likely consequences of the breach",
          "• Measures taken or proposed to address the breach and mitigate harm",
          "The Processor shall provide reasonable assistance to the Controller in meeting its notification obligations under the NDB scheme."
        ]
      },
      {
        section_number: 14,
        heading: "Deletion or Return of Data",
        content: [
          "Upon termination of the Agreement or upon the Controller's request, the Processor shall:",
          "• Within 30 days of termination or upon customer request, delete or return all Personal Information to the Controller",
          "• Delete all existing copies of Personal Information unless retention is required by Australian law",
          "• Provide written certification of deletion or return upon request"
        ]
      },
      {
        section_number: 15,
        heading: "Audits and Compliance",
        content: [
          "The Controller has the following audit rights:",
          "• Customers may request audit reports annually",
          "• On-site audits available upon reasonable notice and at customer's expense",
          "The Processor shall make available to the Controller all information necessary to demonstrate compliance with this DPA and allow for and contribute to audits."
        ]
      },
      {
        section_number: 16,
        heading: "Liability",
        content: [
          "Each party shall be liable for its own breaches of this DPA and Data Protection Laws.",
          "The Processor shall be liable for any breach of this DPA caused by the acts or omissions of its Sub-processors.",
          "Nothing in this DPA shall limit or exclude either party's liability for fraud, wilful misconduct, or matters that cannot be limited by law."
        ]
      },
      {
        section_number: 17,
        heading: "Term and Termination",
        content: [
          "This DPA shall commence on the date of the Agreement and shall continue for the duration of the Agreement.",
          "Upon termination of the Agreement, the provisions of this DPA relating to deletion or return of Personal Information and confidentiality shall survive."
        ]
      },
      {
        section_number: 18,
        heading: "Changes to This DPA",
        content: [
          "DataVault may update this DPA from time to time to reflect changes in Data Protection Laws or business practices.",
          "Material changes will be notified to the Customer via email or through the service interface.",
          "Continued use of the service after changes become effective constitutes acceptance of the updated DPA."
        ]
      },
      {
        section_number: 19,
        heading: "Contact Information",
        content: [
          "For questions about this Data Processing Agreement, please contact:",
          "Email: legal@datavault.com.au",
          "Phone: +61 3 9000 5500",
          "Website: https://datavault.com.au"
        ]
      },
      {
        section_number: 20,
        heading: "Annex A – Processing Details",
        content: [
          "See detailed processing information below in the expandable section."
        ]
      },
      {
        section_number: 21,
        heading: "Annex B – Technical and Organisational Measures",
        content: [
          "See detailed security measures below in the expandable section."
        ]
      }
    ]
  };

  // Check if policyData has the structured format
  const hasStructuredData = policyData && policyData.sections && Array.isArray(policyData.sections);
  const displayData = hasStructuredData ? policyData : sampleData;

  const handleCopyToClipboard = () => {
    let policyText = `DATA PROCESSING AGREEMENT\n\n`;
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
          <p>Generating your Data Processing Agreement...</p>
        </div>
      </div>
    );
  }

  if (!policyData && !displayData) {
    return (
      <div className="aup-output-empty">
        <p>No agreement generated yet. Please fill out the form to generate your Data Processing Agreement.</p>
      </div>
    );
  }

  const isUsingSampleData = !hasStructuredData && policyData;

  return (
    <div className="aup-output-container">
      {isUsingSampleData && (
        <div className="aup-sample-notice">
          <strong>📝 Note:</strong> This is sample output for demonstration. 
          When integrated with the backend API, your actual agreement will appear here.
        </div>
      )}
      
      <div className="aup-output-header">
        <h2 className="aup-output-title">Data Processing Agreement</h2>
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

        {/* Main Policy Sections */}
        <div className="aup-policy-body">
          {displayData.sections && displayData.sections.filter(s => s.section_number < 20).map((section) => (
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
        <details className="aup-structured-summary">
          <summary className="aup-summary-heading">📋 Annex A – Processing Details</summary>
          
          {displayData.annex_a.subject_matter_of_processing && displayData.annex_a.subject_matter_of_processing.length > 0 && (
            <div className="aup-summary-section">
              <h4>Subject Matter of Processing</h4>
              <ul>
                {displayData.annex_a.subject_matter_of_processing.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.annex_a.duration_of_processing && displayData.annex_a.duration_of_processing.length > 0 && (
            <div className="aup-summary-section">
              <h4>Duration of Processing</h4>
              <ul>
                {displayData.annex_a.duration_of_processing.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.annex_a.nature_and_purpose_of_processing && displayData.annex_a.nature_and_purpose_of_processing.length > 0 && (
            <div className="aup-summary-section">
              <h4>Nature and Purpose of Processing</h4>
              <ul>
                {displayData.annex_a.nature_and_purpose_of_processing.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.annex_a.categories_of_data_subjects && displayData.annex_a.categories_of_data_subjects.length > 0 && (
            <div className="aup-summary-section">
              <h4>Categories of Data Subjects</h4>
              <ul>
                {displayData.annex_a.categories_of_data_subjects.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.annex_a.types_of_personal_information && displayData.annex_a.types_of_personal_information.length > 0 && (
            <div className="aup-summary-section">
              <h4>Types of Personal Information</h4>
              <ul>
                {displayData.annex_a.types_of_personal_information.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.annex_a.data_processing_locations && displayData.annex_a.data_processing_locations.length > 0 && (
            <div className="aup-summary-section">
              <h4>Data Processing Locations</h4>
              <ul>
                {displayData.annex_a.data_processing_locations.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.annex_a.sub_processors && displayData.annex_a.sub_processors.length > 0 && (
            <div className="aup-summary-section">
              <h4>Sub-processors</h4>
              <ul>
                {displayData.annex_a.sub_processors.map((item, idx) => (
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

        {/* Annex B - Technical and Organisational Measures */}
        <details className="aup-structured-summary">
          <summary className="aup-summary-heading">🔒 Annex B – Technical and Organisational Measures</summary>
          
          {displayData.annex_b.technical_measures && displayData.annex_b.technical_measures.length > 0 && (
            <div className="aup-summary-section">
              <h4>Technical Security Measures</h4>
              <ul>
                {displayData.annex_b.technical_measures.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.annex_b.organisational_measures && displayData.annex_b.organisational_measures.length > 0 && (
            <div className="aup-summary-section">
              <h4>Organisational Security Measures</h4>
              <ul>
                {displayData.annex_b.organisational_measures.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.annex_b.physical_security_measures && displayData.annex_b.physical_security_measures.length > 0 && (
            <div className="aup-summary-section">
              <h4>Physical Security Measures</h4>
              <ul>
                {displayData.annex_b.physical_security_measures.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.annex_b.security_certifications && displayData.annex_b.security_certifications.length > 0 && (
            <div className="aup-summary-section">
              <h4>Security Certifications</h4>
              <ul>
                {displayData.annex_b.security_certifications.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </details>

        {/* Key Information Summary */}
        <details className="aup-structured-summary">
          <summary className="aup-summary-heading">ℹ️ Key Agreement Terms</summary>
          
          {displayData.role_controller_or_processor && displayData.role_controller_or_processor.length > 0 && (
            <div className="aup-summary-section">
              <h4>Processing Role</h4>
              <ul>
                {displayData.role_controller_or_processor.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.breach_notification_timeframe && displayData.breach_notification_timeframe.length > 0 && (
            <div className="aup-summary-section">
              <h4>Breach Notification</h4>
              <ul>
                {displayData.breach_notification_timeframe.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.data_deletion_timelines && displayData.data_deletion_timelines.length > 0 && (
            <div className="aup-summary-section">
              <h4>Data Deletion</h4>
              <ul>
                {displayData.data_deletion_timelines.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {displayData.audit_rights && displayData.audit_rights.length > 0 && (
            <div className="aup-summary-section">
              <h4>Audit Rights</h4>
              <ul>
                {displayData.audit_rights.map((item, idx) => (
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