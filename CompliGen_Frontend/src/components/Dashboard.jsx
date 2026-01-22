import React, { useState, useEffect } from 'react'
import AuthenticatedNavbar from './AuthenticatedNavbar'
import { useNavigate } from 'react-router-dom'
import '../styling/Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPolicies: 0,
    aupPolicies: 0,
    privacyPolicies: 0,
    tosPolicies: 0,
    cookiePolicies: 0,
    dpaPolicies: 0
  });
  const [recentPolicies, setRecentPolicies] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (access_token = null) => {
    setLoading(true);
    setError(null);
    const token = access_token || localStorage.getItem('access_token');

    if (!token) {
      localStorage.removeItem("isAuthenticated");
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/documents/generate/api/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Handle token refresh
      if (response.status === 401) {
        const refresh_token = localStorage.getItem('refresh_token');
        if (!refresh_token) {
          localStorage.removeItem("isAuthenticated");
          navigate('/login');
          return;
        }

        try {
          const refreshResponse = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refresh_token })
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            localStorage.setItem('access_token', refreshData.access);
            return fetchDashboardData(refreshData.access);
          } else {
            localStorage.removeItem("isAuthenticated");
            navigate('/login');
            return;
          }
        } catch (refreshErr) {
          console.error('Token refresh failed:', refreshErr);
          localStorage.removeItem("isAuthenticated");
          navigate('/login');
          return;
        }
      }

      if (response.ok) {
        const data = await response.json();
        
        // Update stats
        setStats({
          totalPolicies: data.total_policies || 0,
          aupPolicies: data.counts?.acceptable_use_policy || 0,
          privacyPolicies: data.counts?.privacy_policy || 0,
          tosPolicies: data.counts?.terms_of_service || 0,
          cookiePolicies: data.counts?.cookie_policy || 0,
          dpaPolicies: data.counts?.data_processing_agreement || 0
        });

        // Build recent policies array from latest data
        const recent = [];
        
        if (data.latest?.privacy_policy) {
          recent.push({
            id: data.latest.privacy_policy.id,
            type: 'privacypolicy',
            typeName: 'Privacy Policy',
            typeIcon: '🔒',
            companyName: data.latest.privacy_policy.company_name,
            lastUpdated: data.latest.privacy_policy.last_updated,
            color: '#8b5cf6'
          });
        }

        if (data.latest?.terms_of_service) {
          recent.push({
            id: data.latest.terms_of_service.id,
            type: 'tos',
            typeName: 'Terms of Service',
            typeIcon: '📄',
            companyName: data.latest.terms_of_service.company_name,
            lastUpdated: data.latest.terms_of_service.last_updated,
            color: '#ec4899'
          });
        }

        if (data.latest?.cookie_policy) {
          recent.push({
            id: data.latest.cookie_policy.id,
            type: 'cookie',
            typeName: 'Cookie Policy',
            typeIcon: '🍪',
            companyName: data.latest.cookie_policy.company_name,
            lastUpdated: data.latest.cookie_policy.last_updated,
            color: '#10b981'
          });
        }

        if (data.latest?.acceptable_use_policy) {
          recent.push({
            id: data.latest.acceptable_use_policy.id,
            type: 'aup',
            typeName: 'Acceptable Use Policy',
            typeIcon: '📋',
            companyName: data.latest.acceptable_use_policy.company_name,
            lastUpdated: data.latest.acceptable_use_policy.last_updated,
            color: '#3b82f6'
          });
        }

        if (data.latest?.data_processing_agreement) {
          recent.push({
            id: data.latest.data_processing_agreement.id,
            type: 'dpa',
            typeName: 'Data Processing Agreement',
            typeIcon: '🤝',
            companyName: data.latest.data_processing_agreement.company_name,
            lastUpdated: data.latest.data_processing_agreement.last_updated,
            color: '#f59e0b'
          });
        }

        // Sort by date (most recent first)
        recent.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        
        setRecentPolicies(recent);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const policyTypes = [
    { 
      id: 'aup',
      icon: '📋', 
      name: 'Acceptable Use Policy',
      count: stats.aupPolicies,
      description: 'Define platform usage rules',
      color: '#3b82f6',
      path: '/aup'
    },
    { 
      id: 'privacy',
      icon: '🔒', 
      name: 'Privacy Policy',
      count: stats.privacyPolicies,
      description: 'Data collection & usage',
      color: '#8b5cf6',
      path: '/privacypolicy'
    },
    { 
      id: 'tos',
      icon: '📄', 
      name: 'Terms of Service',
      count: stats.tosPolicies,
      description: 'Service terms & conditions',
      color: '#ec4899',
      path: '/tos'
    },
    { 
      id: 'cookie',
      icon: '🍪', 
      name: 'Cookie Policy',
      count: stats.cookiePolicies,
      description: 'Cookie usage disclosure',
      color: '#10b981',
      path: '/cookie'
    },
    { 
      id: 'dpa',
      icon: '🤝', 
      name: 'Data Processing Agreement',
      count: stats.dpaPolicies,
      description: 'Data processing terms',
      color: '#f59e0b',
      path: '/dpa'
    }
  ];

  const quickActions = [
    { 
      icon: '➕', 
      title: 'Generate New Policy', 
      description: 'Create a new legal policy',
      action: () => navigate('/policy-generator'),
      color: '#0e334d'
    },
    { 
      icon: '📚', 
      title: 'View All Policies', 
      description: 'Browse your policy library',
      action: () => navigate('/display-policies'),
      color: '#3b82f6'
    },
    { 
      icon: '📊', 
      title: 'Policy Overview', 
      description: 'View all policy types',
      action: () => navigate('/display-policies'),
      color: '#8b5cf6'
    },
  ];

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <>
        <AuthenticatedNavbar/>
        <div className="dashboard-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthenticatedNavbar/>
      <div className="dashboard-container">
        {/* Hero Section */}
        <div className="dashboard-hero">
          <div className="hero-content">
            <h1 className="hero-titles">Welcome back, {username}</h1>
            <p className="hero-subtitle">Manage your legal policies and generate new documents</p>
          </div>
          <div className="hero-date">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button className="error-close" onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <p className="stat-label">Total Policies</p>
              <h3 className="stat-value">{stats.totalPolicies}</h3>
              <p className="stat-sublabel">Across all types</p>
            </div>
          </div>
          
          <div className="stat-card stat-info">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <p className="stat-label">AUP Policies</p>
              <h3 className="stat-value">{stats.aupPolicies}</h3>
              <p className="stat-sublabel">Acceptable Use</p>
            </div>
          </div>
          
          <div className="stat-card stat-success">
            <div className="stat-icon">🔒</div>
            <div className="stat-content">
              <p className="stat-label">Privacy Policies</p>
              <h3 className="stat-value">{stats.privacyPolicies}</h3>
              <p className="stat-sublabel">Data Protection</p>
            </div>
          </div>
          
          <div className="stat-card stat-warning">
            <div className="stat-icon">📄</div>
            <div className="stat-content">
              <p className="stat-label">Terms of Service</p>
              <h3 className="stat-value">{stats.tosPolicies}</h3>
              <p className="stat-sublabel">Service Terms</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div 
                key={index} 
                className="action-card"
                onClick={action.action}
                style={{ '--action-color': action.color }}
              >
                <div className="action-icon">{action.icon}</div>
                <h3 className="action-title">{action.title}</h3>
                <p className="action-description">{action.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Types Overview */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Policy Types</h2>
            <button 
              className="view-all-btn-header"
              onClick={() => navigate('/display-policies')}
            >
              View All →
            </button>
          </div>
          <div className="policy-types-grid">
            {policyTypes.map((policyType) => (
              <div 
                key={policyType.id}
                className="policy-type-card-dash"
                onClick={() => navigate(policyType.path)}
                style={{ '--type-color': policyType.color }}
              >
                <div className="policy-type-header">
                  <div className="policy-type-icon-wrapper" style={{ backgroundColor: `${policyType.color}15` }}>
                    <span className="policy-type-icon-dash" style={{ color: policyType.color }}>
                      {policyType.icon}
                    </span>
                  </div>
                  <div className="policy-type-count">{policyType.count}</div>
                </div>
                <h3 className="policy-type-name-dash">{policyType.name}</h3>
                <p className="policy-type-description-dash">{policyType.description}</p>
                <button className="policy-type-btn-dash" style={{ color: policyType.color }}>
                  View Policies →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Policies */}
        {recentPolicies.length > 0 && (
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">Recently Generated</h2>
              <button 
                className="view-all-btn-header"
                onClick={() => navigate('/display-policies')}
              >
                View All →
              </button>
            </div>
            <div className="content-card activity-card">
              <div className="activity-list">
                {recentPolicies.map((policy) => (
                  <div key={policy.id} className="activity-item">
                    <div 
                      className="activity-icon-large" 
                      style={{ backgroundColor: `${policy.color}15`, color: policy.color }}
                    >
                      {policy.typeIcon}
                    </div>
                    <div className="activity-content">
                      <h4 className="activity-title">{policy.companyName}</h4>
                      <p className="activity-meta">
                        <span className="activity-type">{policy.typeName}</span>
                        <span className="activity-dot">•</span>
                        <span className="activity-time">{getTimeAgo(policy.lastUpdated)}</span>
                      </p>
                    </div>
                    <button 
                      className="activity-view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/${policy.type}`);
                      }}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="info-cards-grid">
          <div className="info-card-dash info-card-primary">
            <div className="info-card-icon-dash">🇦🇺</div>
            <div className="info-card-content-dash">
              <h3 className="info-card-title-dash">Australian Compliant</h3>
              <p className="info-card-text-dash">
                All generated policies comply with Australian Privacy Act, ACL, and OAIC guidelines.
              </p>
            </div>
          </div>

          <div className="info-card-dash info-card-success">
            <div className="info-card-icon-dash">⚡</div>
            <div className="info-card-content-dash">
              <h3 className="info-card-title-dash">Fast Generation</h3>
              <p className="info-card-text-dash">
                Generate professional legal policies in 2-5 minutes with AI-powered automation.
              </p>
            </div>
          </div>

          <div className="info-card-dash info-card-info">
            <div className="info-card-icon-dash">📝</div>
            <div className="info-card-content-dash">
              <h3 className="info-card-title-dash">Professional Quality</h3>
              <p className="info-card-text-dash">
                Every policy includes 15-20 detailed sections with comprehensive legal coverage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard

  