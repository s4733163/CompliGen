import React from 'react'
import { useNavigate } from 'react-router-dom'
import AuthenticatedNavbar from './AuthenticatedNavbar'
import '../styling/DisplayPolicies.css'

const DisplayPolicies = () => {
  const navigate = useNavigate()

  const policyTypes = [
    {
      id: 'aup',
      name: 'Acceptable Use Policy',
      icon: '📋',
      color: '#3b82f6',
      path: '/aup',
      description: 'View and manage your Acceptable Use Policies'
    },
    {
      id: 'privacypolicy',
      name: 'Privacy Policy',
      icon: '🔒',
      color: '#8b5cf6',
      path: '/privacypolicy',
      description: 'View and manage your Privacy Policies'
    },
    {
      id: 'tos',
      name: 'Terms of Service',
      icon: '📄',
      color: '#ec4899',
      path: '/tos',
      description: 'View and manage your Terms of Service'
    },
    {
      id: 'cookie',
      name: 'Cookie Policy',
      icon: '🍪',
      color: '#10b981',
      path: '/cookie',
      description: 'View and manage your Cookie Policies'
    },
    {
      id: 'dpa',
      name: 'Data Processing Agreement',
      icon: '🤝',
      color: '#f59e0b',
      path: '/dpa',
      description: 'View and manage your Data Processing Agreements'
    }
  ]

  return (
    <>
      <AuthenticatedNavbar />
      <div className="display-policies-container">
        {/* Header */}
        <div className="policies-header">
          <div className="header-content">
            <h1 className="policies-title">My Policies</h1>
            <p className="policies-subtitle">
              Select a policy type to view and manage your documents
            </p>
          </div>
          <button
            className="btn-generate-new"
            onClick={() => navigate('/policy-generator')}
          >
            <span className="btn-icon">➕</span>
            Generate New Policy
          </button>
        </div>

        {/* Policy Type Cards */}
        <div className="policy-types-grid">
          {policyTypes.map((policyType) => (
            <div
              key={policyType.id}
              className="policy-type-card"
              onClick={() => navigate(policyType.path)}
            >
              <div className="policy-type-icon" style={{ backgroundColor: `${policyType.color}15` }}>
                <span style={{ color: policyType.color, fontSize: '48px' }}>
                  {policyType.icon}
                </span>
              </div>
              <h3 className="policy-type-name">{policyType.name}</h3>
              <p className="policy-type-description">{policyType.description}</p>
              <button 
                className="policy-type-btn"
                style={{ backgroundColor: policyType.color }}
              >
                View Policies
                <svg className="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="info-section">
          <div className="info-card">
            <div className="info-icon">💡</div>
            <div className="info-content">
              <h4 className="info-title">Quick Access</h4>
              <p className="info-text">
                Click on any policy type above to view all your generated documents of that type. 
                You can view and manage each policy individually.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DisplayPolicies