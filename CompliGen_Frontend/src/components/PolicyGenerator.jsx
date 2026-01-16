import React, { useState } from 'react';
import AuthenticatedNavbar from './AuthenticatedNavbar';
import PrivacyPolicyInput from './PrivacyPolicyInput';
import PrivacyPolicyOutput from './PrivacyPolicyOutput';
import TosInput from './TosInput';
import TosOutput from './TosOutput';
import DpaInput from './DpaInput';
import DpaOutput from './DpaOutput';
import AupInput from './AupInput';
import AupOutput from './AupOutput';
import CookiePolicyInput from './CookiePolicyInput';
import CookiePolicyOutput from './CookiePolicyOutput';
import '../styling/PolicyGenerator.css';

const PolicyGenerator = () => {
  const [selectedPolicy, setSelectedPolicy] = useState('aup');
  const [generatedPolicy, setGeneratedPolicy] = useState(null);
  const [loading, setLoading] = useState(false);

  const policyTypes = [
    { id: 'aup', name: 'Acceptable Use Policy', description: 'Define permitted and prohibited platform usage' },
    { id: 'privacy', name: 'Privacy Policy', description: 'Explain how you collect and use customer data' },
    { id: 'tos', name: 'Terms of Service', description: 'Set terms and conditions for using your service' },
    { id: 'cookie', name: 'Cookie Policy', description: 'Disclose cookie usage and tracking practices' },
    { id: 'dpa', name: 'Data Processing Agreement', description: 'Define data processing responsibilities' }
  ];

  const handlePolicyGenerated = (data) => {
    setGeneratedPolicy(data);
  };

  const handlePolicyTypeChange = (policyId) => {
    setSelectedPolicy(policyId);
    setGeneratedPolicy(null); // Reset generated policy when switching types
    setLoading(false);
  };

  const handleLoadingChange = (isLoading) => {
    setLoading(isLoading);
  };

  const renderInputComponent = () => {
    switch (selectedPolicy) {
      case 'aup':
        return <AupInput onPolicyGenerated={handlePolicyGenerated} onLoadingChange={handleLoadingChange} />;
      case 'privacy':
        return <PrivacyPolicyInput onPolicyGenerated={handlePolicyGenerated} onLoadingChange={handleLoadingChange} />;
      case 'tos':
        return <TosInput onPolicyGenerated={handlePolicyGenerated} onLoadingChange={handleLoadingChange} />;
      case 'cookie':
        return <CookiePolicyInput onPolicyGenerated={handlePolicyGenerated} onLoadingChange={handleLoadingChange} />;
      case 'dpa':
        return <DpaInput onPolicyGenerated={handlePolicyGenerated} onLoadingChange={handleLoadingChange} />;
      default:
        return <AupInput onPolicyGenerated={handlePolicyGenerated} onLoadingChange={handleLoadingChange} />;
    }
  };

  const renderOutputComponent = () => {
    switch (selectedPolicy) {
      case 'aup':
        return <AupOutput policyData={generatedPolicy} loading={loading} />;
      case 'privacy':
        return <PrivacyPolicyOutput policyData={generatedPolicy} loading={loading} />;
      case 'tos':
        return <TosOutput policyData={generatedPolicy} loading={loading} />;
      case 'cookie':
        return <CookiePolicyOutput policyData={generatedPolicy} loading={loading} />;
      case 'dpa':
        return <DpaOutput policyData={generatedPolicy} loading={loading} />;
      default:
        return <AupOutput policyData={generatedPolicy} loading={loading} />;
    }
  };

  return (
    <>
      <AuthenticatedNavbar />
      
      <div className="policy-generator-container">
        <div className="policy-generator-header">
          <h1 className="policy-generator-title">Policy Generator</h1>
          <p className="policy-generator-subtitle">
            Generate compliant legal policies for your Australian business
          </p>
        </div>

        {/* Policy Type Selector */}
        <div className="policy-type-selector">
          <h2 className="policy-selector-title">Select Policy Type</h2>
          <div className="policy-cards">
            {policyTypes.map((policy) => (
              <div
                key={policy.id}
                className={`policy-card ${selectedPolicy === policy.id ? 'policy-card-active' : ''}`}
                onClick={() => handlePolicyTypeChange(policy.id)}
              >
                <div className="policy-card-header">
                  <h3 className="policy-card-title">{policy.name}</h3>
                  {selectedPolicy === policy.id && (
                    <span className="policy-card-badge">Selected</span>
                  )}
                </div>
                <p className="policy-card-description">{policy.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Input/Output Section */}
        <div className="policy-content-section">
          <div className="policy-input-section">
            {renderInputComponent()}
          </div>

          {(generatedPolicy || loading) && (
            <div className="policy-output-section">
              {renderOutputComponent()}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PolicyGenerator;