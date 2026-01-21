import React from 'react'
import PolicyListBase from './PolicyListBase'

const CookiePolicies = () => {
  const policyConfig = {
    name: 'Cookie Policy',
    icon: '🍪',
    color: '#10b981',
    endpoint: 'api/cookie'
  }

  const renderContent = (policy, formatDate) => (
    <div className="policy-content">
      <div className="content-header">
        <h1 className="content-title">Cookie Policy</h1>
        <div className="content-meta">
          <p><strong>Company:</strong> {policy.company_name}</p>
          <p><strong>Last Updated:</strong> {formatDate(policy.last_updated)}</p>
          <p><strong>Website:</strong> {policy.website}</p>
          <p><strong>Contact:</strong> {policy.contact_email}</p>
        </div>
      </div>

      {policy.introduction && policy.introduction.length > 0 && (
        <div className="content-section">
          <h3>Introduction</h3>
          {policy.introduction.map((para, idx) => (
            <p key={`intro-${idx}`}>{para}</p>
          ))}
        </div>
      )}

      {policy.sections && policy.sections.map((section, sectionIdx) => (
        <div key={`cookie-${policy.id}-${sectionIdx}`} className="content-section">
          <h3>{section.section_number}. {section.heading}</h3>
          {section.content && section.content.map((paragraph, idx) => (
            <p key={`cookie-p-${sectionIdx}-${idx}`}>{paragraph}</p>
          ))}
        </div>
      ))}
    </div>
  )

  return <PolicyListBase policyType="cookie" policyConfig={policyConfig} renderContent={renderContent} />
}

export default CookiePolicies