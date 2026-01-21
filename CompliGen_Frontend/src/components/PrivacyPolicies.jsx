import React from 'react'
import PolicyListBase from './PolicyListBase'


const PrivacyPolicies = () => {
  const policyConfig = {
    name: 'Privacy Policy',
    icon: '🔒',
    color: '#8b5cf6',
    endpoint: 'api/privacypolicy'
  }

  const renderContent = (policy, formatDate) => (
    <div className="policy-content">
      <div className="content-header">
        <h1 className="content-title">Privacy Policy</h1>
        <div className="content-meta">
          <p><strong>Company:</strong> {policy.company_name}</p>
          <p><strong>Last Updated:</strong> {formatDate(policy.last_updated)}</p>
          <p><strong>Contact:</strong> {policy.contact_info?.email || policy.contact_email}</p>
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
        <div key={`privacy-${policy.id}-${sectionIdx}`} className="content-section">
          <h3>{section.section_number}. {section.heading}</h3>
          {section.content && section.content.map((paragraph, idx) => (
            <p key={`privacy-p-${sectionIdx}-${idx}`}>{paragraph}</p>
          ))}
        </div>
      ))}
    </div>
  )

  return <PolicyListBase policyType="privacypolicy" policyConfig={policyConfig} renderContent={renderContent} />
}

export default PrivacyPolicies