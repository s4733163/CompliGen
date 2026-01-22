import React from 'react'
import PolicyListBase from './PolicyListBase'

const DpaPolicies = () => {
  const policyConfig = {
    name: 'Data Processing Agreement',
    icon: '🤝',
    color: '#f59e0b',
    endpoint: 'api/dpa'
  }

  const renderContent = (policy, formatDate) => (
    <div className="policy-content">
      <div className="content-header">
        <h1 className="content-title">Data Processing Agreement</h1>
        <div className="content-meta">
          <p><strong>Company:</strong> {policy.company_name}</p>
          <p><strong>Last Updated:</strong> {formatDate(policy.last_updated)}</p>
          <p><strong>Website:</strong> {policy.website_url}</p>
          <p><strong>Contact:</strong> {policy.contact_email}</p>
          {policy.phone_number && <p><strong>Phone:</strong> {policy.phone_number}</p>}
        </div>
      </div>

      {/* Role Information */}
      {policy.role_controller_or_processor && policy.role_controller_or_processor.length > 0 && (
        <div className="content-section">
          <h3>Role</h3>
          <ul>
            {policy.role_controller_or_processor.map((role, idx) => (
              <li key={`role-${idx}`}>{role}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Data Processing Locations */}
      {policy.data_processing_locations && policy.data_processing_locations.length > 0 && (
        <div className="content-section">
          <h3>Data Processing Locations</h3>
          <ul>
            {policy.data_processing_locations.map((location, idx) => (
              <li key={`location-${idx}`}>{location}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Breach Notification Timeframe */}
      {policy.breach_notification_timeframe && policy.breach_notification_timeframe.length > 0 && (
        <div className="content-section">
          <h3>Breach Notification Timeframe</h3>
          {policy.breach_notification_timeframe.map((item, idx) => (
            <p key={`breach-${idx}`}>{item}</p>
          ))}
        </div>
      )}

      {/* Data Deletion Timelines */}
      {policy.data_deletion_timelines && policy.data_deletion_timelines.length > 0 && (
        <div className="content-section">
          <h3>Data Deletion Timelines</h3>
          {policy.data_deletion_timelines.map((item, idx) => (
            <p key={`deletion-${idx}`}>{item}</p>
          ))}
        </div>
      )}

      {/* Audit Rights */}
      {policy.audit_rights && policy.audit_rights.length > 0 && (
        <div className="content-section">
          <h3>Audit Rights</h3>
          {policy.audit_rights.map((item, idx) => (
            <p key={`audit-${idx}`}>{item}</p>
          ))}
        </div>
      )}

      {/* Definitions */}
      {policy.definitions && policy.definitions.terms && policy.definitions.terms.length > 0 && (
        <div className="content-section">
          <h3>Definitions</h3>
          <ul>
            {policy.definitions.terms.map((term, idx) => (
              <li key={`def-${idx}`}>{term}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Sections */}
      {policy.sections && policy.sections.map((section, sectionIdx) => (
        <div key={`dpa-${policy.id}-${sectionIdx}`} className="content-section">
          <h3>{section.section_number}. {section.heading}</h3>
          {section.content && section.content.map((paragraph, idx) => (
            <p key={`dpa-p-${sectionIdx}-${idx}`}>{paragraph}</p>
          ))}
        </div>
      ))}

      {/* Annex A - Processing Details */}
      {policy.annex_a && (
        <div className="content-section annex-section">
          <h2 className="annex-title">Annex A – Processing Details</h2>
          
          {policy.annex_a.subject_matter_of_processing && policy.annex_a.subject_matter_of_processing.length > 0 && (
            <div className="annex-subsection">
              <h4>Subject Matter of Processing</h4>
              {policy.annex_a.subject_matter_of_processing.map((item, idx) => (
                <p key={`subject-${idx}`}>{item}</p>
              ))}
            </div>
          )}

          {policy.annex_a.duration_of_processing && policy.annex_a.duration_of_processing.length > 0 && (
            <div className="annex-subsection">
              <h4>Duration of Processing</h4>
              <ul>
                {policy.annex_a.duration_of_processing.map((item, idx) => (
                  <li key={`duration-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policy.annex_a.nature_and_purpose_of_processing && policy.annex_a.nature_and_purpose_of_processing.length > 0 && (
            <div className="annex-subsection">
              <h4>Nature and Purpose of Processing</h4>
              <ul>
                {policy.annex_a.nature_and_purpose_of_processing.map((item, idx) => (
                  <li key={`purpose-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policy.annex_a.categories_of_data_subjects && policy.annex_a.categories_of_data_subjects.length > 0 && (
            <div className="annex-subsection">
              <h4>Categories of Data Subjects</h4>
              <ul>
                {policy.annex_a.categories_of_data_subjects.map((item, idx) => (
                  <li key={`subject-cat-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policy.annex_a.types_of_personal_information && policy.annex_a.types_of_personal_information.length > 0 && (
            <div className="annex-subsection">
              <h4>Types of Personal Information</h4>
              <ul>
                {policy.annex_a.types_of_personal_information.map((item, idx) => (
                  <li key={`info-type-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policy.annex_a.data_processing_locations && policy.annex_a.data_processing_locations.length > 0 && (
            <div className="annex-subsection">
              <h4>Data Processing Locations</h4>
              <ul>
                {policy.annex_a.data_processing_locations.map((item, idx) => (
                  <li key={`annex-location-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policy.annex_a.sub_processors && policy.annex_a.sub_processors.length > 0 && (
            <div className="annex-subsection">
              <h4>Sub-processors</h4>
              {policy.annex_a.sub_processors.map((subProc, idx) => (
                <div key={`subproc-${idx}`} className="sub-processor-item">
                  <p><strong>{subProc.category_name}</strong></p>
                  {subProc.provider_names && subProc.provider_names.length > 0 && (
                    <ul>
                      {subProc.provider_names.map((provider, pIdx) => (
                        <li key={`provider-${idx}-${pIdx}`}>{provider}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Annex B - Technical and Organisational Measures */}
      {policy.annex_b && (
        <div className="content-section annex-section">
          <h2 className="annex-title">Annex B – Technical and Organisational Measures (TOMs)</h2>
          
          {policy.annex_b.technical_measures && policy.annex_b.technical_measures.length > 0 && (
            <div className="annex-subsection">
              <h4>Technical Measures</h4>
              <ul>
                {policy.annex_b.technical_measures.map((item, idx) => (
                  <li key={`tech-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policy.annex_b.organisational_measures && policy.annex_b.organisational_measures.length > 0 && (
            <div className="annex-subsection">
              <h4>Organisational Measures</h4>
              <ul>
                {policy.annex_b.organisational_measures.map((item, idx) => (
                  <li key={`org-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policy.annex_b.physical_security_measures && policy.annex_b.physical_security_measures.length > 0 && (
            <div className="annex-subsection">
              <h4>Physical Security Measures</h4>
              <ul>
                {policy.annex_b.physical_security_measures.map((item, idx) => (
                  <li key={`physical-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policy.annex_b.security_certifications && policy.annex_b.security_certifications.length > 0 && (
            <div className="annex-subsection">
              <h4>Security Certifications</h4>
              <ul>
                {policy.annex_b.security_certifications.map((item, idx) => (
                  <li key={`cert-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )

  return <PolicyListBase policyType="dpa" policyConfig={policyConfig} renderContent={renderContent} />
}

export default DpaPolicies