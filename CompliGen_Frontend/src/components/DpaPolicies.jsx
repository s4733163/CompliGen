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
        </div>
      </div>

      {policy.sections && policy.sections.map((section, sectionIdx) => (
        <div key={`dpa-${policy.id}-${sectionIdx}`} className="content-section">
          <h3>{section.section_number}. {section.heading}</h3>
          {section.content && section.content.map((paragraph, idx) => (
            <p key={`dpa-p-${sectionIdx}-${idx}`}>{paragraph}</p>
          ))}
        </div>
      ))}
    </div>
  )

  return <PolicyListBase policyType="dpa" policyConfig={policyConfig} renderContent={renderContent} />
}

export default DpaPolicies