import React from 'react'
import PolicyListBase from './PolicyListBase'

const AupPolicies = () => {
  const policyConfig = {
    name: 'Acceptable Use Policy',
    icon: '📋',
    color: '#3b82f6',
    endpoint: 'api/aup'
  }

  const renderContent = (policy, formatDate) => (
    <div className="policy-content">
      <div className="content-header">
        <h1 className="content-title">Acceptable Use Policy</h1>
        <div className="content-meta">
          <p><strong>Company:</strong> {policy.company_name}</p>
          <p><strong>Last Updated:</strong> {formatDate(policy.last_updated)}</p>
          <p><strong>Website:</strong> {policy.website_url}</p>
          <p><strong>Contact:</strong> {policy.contact_email}</p>
        </div>
      </div>

      {policy.permitted_usage_types && policy.permitted_usage_types.length > 0 && (
        <div className="content-section">
          <h3>Permitted Usage</h3>
          <ul>
            {policy.permitted_usage_types.map((item, idx) => (
              <li key={`permitted-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {policy.prohibited_activities && policy.prohibited_activities.length > 0 && (
        <div className="content-section">
          <h3>Prohibited Activities</h3>
          <ul>
            {policy.prohibited_activities.map((item, idx) => (
              <li key={`prohibited-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {policy.sections && policy.sections.map((section, sectionIdx) => (
        <div key={`aup-${policy.id}-${sectionIdx}`} className="content-section">
          <h3>{section.section_number}. {section.heading}</h3>
          {section.content && section.content.map((paragraph, idx) => (
            <p key={`aup-p-${sectionIdx}-${idx}`}>{paragraph}</p>
          ))}
        </div>
      ))}
    </div>
  )

  return <PolicyListBase policyType="aup" policyConfig={policyConfig} renderContent={renderContent} />
}

export default AupPolicies