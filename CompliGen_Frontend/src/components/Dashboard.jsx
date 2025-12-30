import React, { useState } from 'react'
import AuthenticatedNavbar from './AuthenticatedNavbar'
import { useNavigate } from 'react-router-dom'
import '../styling/Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - will be replaced with API calls
  const stats = {
    totalPolicies: 24,
    pendingReviews: 7,
    complianceScore: 87,
    lastCheck: "2 hours ago"
  };

  const recentActivity = [
    { id: 1, type: 'policy', title: 'Data Privacy Policy', action: 'Updated', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'check', title: 'GDPR Compliance Check', action: 'Completed', time: '5 hours ago', status: 'passed' },
    { id: 3, type: 'policy', title: 'Employee Handbook', action: 'Generated', time: '1 day ago', status: 'completed' },
    { id: 4, type: 'check', title: 'ISO 27001 Assessment', action: 'In Progress', time: '2 days ago', status: 'pending' },
  ];

  const upcomingDeadlines = [
    { id: 1, title: 'Annual GDPR Review', date: '2025-01-15', priority: 'high' },
    { id: 2, title: 'Security Policy Update', date: '2025-01-22', priority: 'medium' },
    { id: 3, title: 'Vendor Assessment', date: '2025-02-05', priority: 'low' },
  ];

  const quickActions = [
    { 
      icon: '📋', 
      title: 'Generate Policy', 
      description: 'Create a new compliance policy',
      action: () => navigate('/policy-generator'),
      color: '#3b82f6'
    },
    { 
      icon: '✓', 
      title: 'Run Compliance Check', 
      description: 'Verify regulatory compliance',
      action: () => navigate('/compliance-checker'),
      color: '#10b981'
    },
    { 
      icon: '📊', 
      title: 'View Reports', 
      description: 'Access compliance reports',
      action: () => alert('Reports feature coming soon!'),
      color: '#8b5cf6'
    },
    { 
      icon: '⚙️', 
      title: 'Settings', 
      description: 'Manage your preferences',
      action: () => alert('Settings feature coming soon!'),
      color: '#6b7280'
    },
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return '✓';
      case 'passed': return '✓';
      case 'pending': return '⏳';
      default: return '•';
    }
  };

  return (
    <>
      <AuthenticatedNavbar/>
      <div className="dashboard-container">
        {/* Hero Section */}
        <div className="dashboard-hero">
          <div className="hero-content">
            <h1 className="hero-title">Welcome back, {username}</h1>
            <p className="hero-subtitle">Here's your compliance overview for today</p>
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

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <p className="stat-label">Total Policies</p>
              <h3 className="stat-value">{stats.totalPolicies}</h3>
            </div>
          </div>
          
          <div className="stat-card stat-warning">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <p className="stat-label">Pending Reviews</p>
              <h3 className="stat-value">{stats.pendingReviews}</h3>
            </div>
          </div>
          
          <div className="stat-card stat-success">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <p className="stat-label">Compliance Score</p>
              <h3 className="stat-value">{stats.complianceScore}%</h3>
            </div>
          </div>
          
          <div className="stat-card stat-info">
            <div className="stat-icon">🕐</div>
            <div className="stat-content">
              <p className="stat-label">Last Check</p>
              <h3 className="stat-value">{stats.lastCheck}</h3>
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

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Recent Activity */}
          <div className="content-card activity-card">
            <div className="card-header">
              <h2 className="card-title">Recent Activity</h2>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon" data-status={activity.status}>
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="activity-content">
                    <h4 className="activity-title">{activity.title}</h4>
                    <p className="activity-meta">
                      <span className="activity-action">{activity.action}</span>
                      <span className="activity-time">{activity.time}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="content-card deadlines-card">
            <div className="card-header">
              <h2 className="card-title">Upcoming Deadlines</h2>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="deadlines-list">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="deadline-item">
                  <div 
                    className="deadline-priority" 
                    style={{ backgroundColor: getPriorityColor(deadline.priority) }}
                  />
                  <div className="deadline-content">
                    <h4 className="deadline-title">{deadline.title}</h4>
                    <p className="deadline-date">
                      {new Date(deadline.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Progress */}
        <div className="section">
          <h2 className="section-title">Compliance Progress</h2>
          <div className="progress-card">
            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">GDPR Compliance</span>
                <span className="progress-percentage">92%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '92%', backgroundColor: '#10b981' }}></div>
              </div>
            </div>
            
            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">ISO 27001</span>
                <span className="progress-percentage">78%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '78%', backgroundColor: '#3b82f6' }}></div>
              </div>
            </div>
            
            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">SOC 2</span>
                <span className="progress-percentage">65%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '65%', backgroundColor: '#f59e0b' }}></div>
              </div>
            </div>
            
            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">HIPAA</span>
                <span className="progress-percentage">88%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '88%', backgroundColor: '#8b5cf6' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard