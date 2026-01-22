import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthenticatedNavbar from './AuthenticatedNavbar'
import { generatePDF } from './Pdfgenerator'
import '../styling/DisplayPolicies.css'


const PolicyListBase = ({ policyType, policyConfig, renderContent }) => {
  const navigate = useNavigate()
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPolicy, setSelectedPolicy] = useState(null)
  const [viewMode, setViewMode] = useState('list')
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [policyToDelete, setPolicyToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async (access_token = null) => {
    setLoading(true)
    setError(null)
    const token = access_token || localStorage.getItem('access_token')

    if (!token) {
      localStorage.removeItem("isAuthenticated")
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/documents/generate/${policyConfig.endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 401) {
        const refresh_token = localStorage.getItem('refresh_token')
        if (!refresh_token) {
          localStorage.removeItem("isAuthenticated")
          navigate('/login')
          return
        }

        try {
          const refreshResponse = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refresh_token })
          })

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json()
            localStorage.setItem('access_token', refreshData.access)
            return fetchPolicies(refreshData.access)
          } else {
            localStorage.removeItem("isAuthenticated")
            navigate('/login')
            return
          }
        } catch (refreshErr) {
          console.error('Token refresh failed:', refreshErr)
          localStorage.removeItem("isAuthenticated")
          navigate('/login')
          return
        }
      }

      if (response.ok) {
        const data = await response.json()
        setPolicies(data)
      } else {
        setError('Failed to load policies')
      }
    } catch (err) {
      setError('Failed to load policies. Please try again.')
      console.error('Error fetching policies:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePolicy = async (policyId) => {
    setPolicyToDelete(policyId)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!policyToDelete) return

    setDeleting(true)
    const access_token = localStorage.getItem('access_token')

    const attemptDelete = async (token) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/documents/generate/${policyConfig.endpoint}/${policyToDelete}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (response.status === 401) {
          const refresh_token = localStorage.getItem('refresh_token')
          if (!refresh_token) {
            localStorage.removeItem("isAuthenticated")
            setDeleting(false)
            setShowDeleteModal(false)
            navigate('/login')
            return
          }

          try {
            const refreshResponse = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh: refresh_token })
            })

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json()
              localStorage.setItem('access_token', refreshData.access)
              return attemptDelete(refreshData.access)
            } else {
              localStorage.removeItem("isAuthenticated")
              setDeleting(false)
              setShowDeleteModal(false)
              navigate('/login')
              return
            }
          } catch (refreshErr) {
            console.error('Token refresh failed:', refreshErr)
            localStorage.removeItem("isAuthenticated")
            setDeleting(false)
            setShowDeleteModal(false)
            navigate('/login')
            return
          }
        }

        if (response.ok) {
          setPolicies(policies.filter(p => p.id !== policyToDelete))
          if (selectedPolicy?.id === policyToDelete) {
            setSelectedPolicy(null)
            setViewMode('list')
          }
          setDeleting(false)
          setShowDeleteModal(false)
          setPolicyToDelete(null)
        } else {
          setError('Failed to delete policy. Please try again.')
          setDeleting(false)
          setShowDeleteModal(false)
          setPolicyToDelete(null)
        }
      } catch (err) {
        console.error('Error deleting policy:', err)
        setError('An error occurred while deleting the policy.')
        setDeleting(false)
        setShowDeleteModal(false)
        setPolicyToDelete(null)
      }
    }

    await attemptDelete(access_token)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setPolicyToDelete(null)
  }

    const handleDownload = async (policy) => {
    console.log("1. handleDownload called")
    console.log("2. Policy:", policy)
    console.log("3. Config name:", policyConfig.name)
    
    try {
        console.log("4. About to call generatePDF")
        await generatePDF(policy, policyConfig.name, formatDate)
        console.log("5. generatePDF completed")
    } catch (err) {
        console.error('6. Error in generatePDF:', err)
        console.error('Error details:', err.message)
        console.error('Stack:', err.stack)
    }
    }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <>
        <AuthenticatedNavbar />
        <div className="display-policies-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your {policyConfig.name}s...</p>
          </div>
        </div>
      </>
    )
  }

  if (viewMode === 'detail' && selectedPolicy) {
    return (
      <>
        <AuthenticatedNavbar />
        <div className="display-policies-container">
          <div className="policy-detail-view">
            <div className="detail-header">
              <button className="btn-back" onClick={() => setViewMode('list')}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to List
              </button>

              <div className="detail-actions">
                <button 
                  className="btn-action btn-download" 
                  onClick={() => handleDownload(selectedPolicy)}
                  disabled={downloading}
                >
                  {downloading ? (
                    <>
                      <span className="spinner-small"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span>📥</span> Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="detail-content">
              {renderContent(selectedPolicy, formatDate)}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && <DeleteConfirmationModal />}
      </>
    )
  }

  // Delete Confirmation Modal Component
  const DeleteConfirmationModal = () => (
    <div className="modal-overlay" onClick={cancelDelete}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-warning">⚠️</div>
          <h3 className="modal-title">Delete {policyConfig.name}?</h3>
        </div>
        <div className="modal-body">
          <p className="modal-text">
            Are you sure you want to delete this policy? This action cannot be undone and all data will be permanently removed.
          </p>
        </div>
        <div className="modal-footer">
          <button 
            className="modal-btn modal-btn-cancel" 
            onClick={cancelDelete}
            disabled={deleting}
          >
            Cancel
          </button>
          <button 
            className="modal-btn modal-btn-delete" 
            onClick={confirmDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <span className="spinner-small"></span>
                Deleting...
              </>
            ) : (
              <>
                <span>🗑️</span>
                Delete Policy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <AuthenticatedNavbar />
      <div className="display-policies-container">
        <div className="policies-header">
          <div className="header-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
              <button 
                className="btn-back-simple"
                onClick={() => navigate('/display-policies')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center' }}
              >
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                  <path d="M12 4L6 10L12 16" stroke="#0e334d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h1 className="policies-title" style={{ margin: 0 }}>
                <span style={{ color: policyConfig.color, fontSize: '36px', marginRight: '12px' }}>
                  {policyConfig.icon}
                </span>
                {policyConfig.name}
              </h1>
            </div>
            <p className="policies-subtitle">
              Manage all your {policyConfig.name}s
            </p>
          </div>
          <button
            className="btn-generate-new"
            onClick={() => navigate('/policy-generator')}
          >
            <span className="btn-icon">➕</span>
            Generate New
          </button>
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button className="error-close" onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {policies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{policyConfig.icon}</div>
            <h3 className="empty-title">No {policyConfig.name}s Found</h3>
            <p className="empty-description">
              You haven't generated any {policyConfig.name}s yet. Click the button above to create your first one.
            </p>
            <button
              className="btn-empty-action"
              onClick={() => navigate('/policy-generator')}
            >
              Generate Your First {policyConfig.name}
            </button>
          </div>
        ) : (
          <div className="policies-grid">
            {policies.map((policy) => (
              <div key={policy.id} className="policy-card">
                <div className="policy-card-header">
                  <div className="policy-type-badge" style={{ backgroundColor: `${policyConfig.color}15`, color: policyConfig.color }}>
                    <span className="badge-icon">{policyConfig.icon}</span>
                    <span className="badge-text">{policyConfig.name}</span>
                  </div>
                  <div className="policy-menu">
                    <button
                      className="menu-trigger download-icon-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(policy)
                      }}
                      title="Download PDF"
                      disabled={downloading}
                      style={{ marginRight: '8px' }}
                    >
                      📥
                    </button>
                    <button
                      className="menu-trigger delete-icon-btn"
                      onClick={() => handleDeletePolicy(policy.id)}
                      title="Delete policy"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="policy-card-body">
                  <h3 className="policy-company-name">{policy.company_name}</h3>
                  <div className="policy-meta">
                    <span className="meta-item">
                      <span className="meta-icon">📅</span>
                      <span className="meta-text">{formatDate(policy.last_updated)}</span>
                    </span>
                    {policy.sections && (
                      <span className="meta-item">
                        <span className="meta-icon">📝</span>
                        <span className="meta-text">{policy.sections.length} sections</span>
                      </span>
                    )}
                  </div>
                  
                  {policy.contact_email && (
                    <div className="policy-contact">
                      <span className="contact-icon">✉️</span>
                      <span className="contact-text">{policy.contact_email}</span>
                    </div>
                  )}
                </div>

                <div className="policy-card-footer">
                  <button
                    className="btn-view-policy"
                    onClick={() => {
                      setSelectedPolicy(policy)
                      setViewMode('detail')
                    }}
                  >
                    View Details
                    <svg className="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && <DeleteConfirmationModal />}
      </div>
    </>
  )
}

export default PolicyListBase