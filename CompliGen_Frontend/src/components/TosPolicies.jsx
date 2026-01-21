import React from 'react'
import PolicyListBase from './PolicyListBase'

const TosPolicies = () => {
  const policyConfig = {
    name: 'Terms of Service',
    icon: '📄',
    color: '#ec4899',
    endpoint: 'api/tos'
  }

  const renderContent = (policy, formatDate) => (
    <div className="policy-content">
      <div className="content-header">
        <h1 className="content-title">Terms of Service</h1>
        <div className="content-meta">
          <p><strong>Company:</strong> {policy.company_name}</p>
          <p><strong>Last Updated:</strong> {formatDate(policy.last_updated)}</p>
          <p><strong>Website:</strong> {policy.website_url}</p>
          <p><strong>Contact:</strong> {policy.contact_email}</p>
        </div>
      </div>

      {policy.sections && policy.sections.map((section, sectionIdx) => (
        <div key={`tos-${policy.id}-${sectionIdx}`} className="content-section">
          <h3>{section.section_number}. {section.heading}</h3>
          {section.content && section.content.map((paragraph, idx) => (
            <p key={`tos-p-${sectionIdx}-${idx}`}>{paragraph}</p>
          ))}
        </div>
      ))}
    </div>
  )

  return <PolicyListBase policyType="tos" policyConfig={policyConfig} renderContent={renderContent} />
}

export default TosPolicies