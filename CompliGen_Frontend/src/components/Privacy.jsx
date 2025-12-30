import React from 'react'
import '../styling/Auth.css'
import Navbar from './Navbar'
import Footer from './Footer'
import { useNavigate } from 'react-router-dom'

const Privacy = () => {
    const navigate = useNavigate()

    return (
        <>
            <Navbar />
            <div className="legal-page-container">
                <div className="legal-page-wrapper">
                    {/* Header */}
                    <div className="legal-header">
                        <h1 className="legal-title">Privacy Policy</h1>
                        <p className="legal-subtitle">Last updated: December 10, 2024</p>
                    </div>

                    {/* Content */}
                    <div className="legal-content">
                        {/* Introduction */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">1. Introduction</h2>
                            <p className="legal-text">
                                CompliGen ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy
                                explains how we collect, use, disclose, and safeguard your information when you use our
                                compliance automation platform and services ("Service").
                            </p>
                            <p className="legal-text">
                                Please read this Privacy Policy carefully. By using our Service, you consent to the data
                                practices described in this policy.
                            </p>
                        </section>

                        {/* Information We Collect */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">2. Information We Collect</h2>

                            <h3 className="legal-subsection-title">2.1 Information You Provide</h3>
                            <p className="legal-text">We collect information that you voluntarily provide when you:</p>
                            <ul className="legal-list">
                                <li><strong>Register for an account:</strong> Name, email address, username, password</li>
                                <li><strong>Upload documents:</strong> Security policies, compliance documents, and related files</li>
                                <li><strong>Use our policy generator:</strong> Company information, industry data, business details</li>
                                <li><strong>Contact us:</strong> Support inquiries, feedback, and correspondence</li>
                                <li><strong>Make payments:</strong> Billing information (processed securely through third-party payment processors)</li>
                            </ul>

                            <h3 className="legal-subsection-title">2.2 Information Collected Automatically</h3>
                            <p className="legal-text">When you access our Service, we automatically collect:</p>
                            <ul className="legal-list">
                                <li><strong>Device information:</strong> IP address, browser type, operating system</li>
                                <li><strong>Usage data:</strong> Pages visited, features used, time spent on pages</li>
                                <li><strong>Cookies and tracking technologies:</strong> Session data, preferences, analytics</li>
                                <li><strong>Log data:</strong> Access times, error logs, performance data</li>
                            </ul>

                            <h3 className="legal-subsection-title">2.3 Information from Third Parties</h3>
                            <p className="legal-text">
                                We may receive information from third-party services such as authentication providers
                                (Google, GitHub) if you choose to log in using those services.
                            </p>
                        </section>

                        {/* How We Use Your Information */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">3. How We Use Your Information</h2>
                            <p className="legal-text">We use the collected information for the following purposes:</p>
                            <ul className="legal-list">
                                <li><strong>Service delivery:</strong> Process documents, generate compliance reports, create policies</li>
                                <li><strong>Account management:</strong> Create and maintain your account, authenticate users</li>
                                <li><strong>Communication:</strong> Send updates, notifications, technical notices, and support responses</li>
                                <li><strong>Improvement:</strong> Analyze usage patterns to enhance Service features and performance</li>
                                <li><strong>Security:</strong> Detect and prevent fraud, abuse, and security incidents</li>
                                <li><strong>Legal compliance:</strong> Comply with applicable laws and regulations</li>
                                <li><strong>Marketing:</strong> Send promotional content (you can opt-out anytime)</li>
                            </ul>
                        </section>

                        {/* AI Processing */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">4. AI Processing and Document Analysis</h2>
                            <p className="legal-text">
                                Our Service uses artificial intelligence and machine learning to analyze your documents
                                and generate compliance reports. Here's what you should know:
                            </p>
                            <ul className="legal-list">
                                <li>Uploaded documents are processed using third-party AI services (OpenAI, Google Gemini)</li>
                                <li>Document content is analyzed to compare against compliance standards</li>
                                <li>We do not use your documents to train AI models</li>
                                <li>Documents are encrypted during transmission and storage</li>
                                <li>You can request deletion of your documents at any time</li>
                            </ul>

                            <div className="legal-notice">
                                <strong>Important:</strong> While we take extensive measures to protect your data,
                                you should not upload highly sensitive or classified information unless you have
                                appropriate authorization and accept the associated risks.
                            </div>
                        </section>

                        {/* Data Sharing */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">5. How We Share Your Information</h2>
                            <p className="legal-text">We may share your information in the following circumstances:</p>

                            <h3 className="legal-subsection-title">5.1 Service Providers</h3>
                            <p className="legal-text">We share data with third-party vendors who help us provide the Service:</p>
                            <ul className="legal-list">
                                <li><strong>Cloud hosting:</strong> AWS, Google Cloud, or similar providers</li>
                                <li><strong>AI services:</strong> OpenAI, Google Gemini for document processing</li>
                                <li><strong>Payment processing:</strong> Stripe or similar payment gateways</li>
                                <li><strong>Analytics:</strong> Google Analytics, usage tracking tools</li>
                                <li><strong>Email services:</strong> For transactional and marketing emails</li>
                            </ul>

                            <h3 className="legal-subsection-title">5.2 Legal Requirements</h3>
                            <p className="legal-text">We may disclose your information if required by law or in response to:</p>
                            <ul className="legal-list">
                                <li>Valid legal processes (subpoenas, court orders)</li>
                                <li>Government or regulatory requests</li>
                                <li>Protection of our rights, privacy, safety, or property</li>
                                <li>Enforcement of our Terms of Service</li>
                            </ul>

                            <h3 className="legal-subsection-title">5.3 Business Transfers</h3>
                            <p className="legal-text">
                                If CompliGen is involved in a merger, acquisition, or sale of assets, your information
                                may be transferred to the acquiring entity.
                            </p>

                            <h3 className="legal-subsection-title">5.4 With Your Consent</h3>
                            <p className="legal-text">
                                We may share your information for any other purpose with your explicit consent.
                            </p>
                        </section>

                        {/* Data Security */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">6. Data Security</h2>
                            <p className="legal-text">
                                We implement industry-standard security measures to protect your information:
                            </p>
                            <ul className="legal-list">
                                <li><strong>Encryption:</strong> Data encrypted in transit (TLS/SSL) and at rest (AES-256)</li>
                                <li><strong>Access controls:</strong> Role-based access, multi-factor authentication</li>
                                <li><strong>Regular audits:</strong> Security assessments and vulnerability testing</li>
                                <li><strong>Employee training:</strong> Staff trained on data protection practices</li>
                                <li><strong>Incident response:</strong> Procedures for detecting and responding to breaches</li>
                            </ul>
                            <p className="legal-text">
                                However, no method of transmission over the Internet or electronic storage is 100% secure.
                                We cannot guarantee absolute security of your data.
                            </p>
                        </section>

                        {/* Data Retention */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">7. Data Retention</h2>
                            <p className="legal-text">
                                We retain your information for as long as necessary to provide the Service and fulfill
                                the purposes outlined in this Privacy Policy:
                            </p>
                            <ul className="legal-list">
                                <li><strong>Account data:</strong> Retained while your account is active</li>
                                <li><strong>Uploaded documents:</strong> Stored until you delete them or close your account</li>
                                <li><strong>Generated reports:</strong> Retained for your access and historical reference</li>
                                <li><strong>Usage data:</strong> Typically retained for 12-24 months</li>
                                <li><strong>Legal records:</strong> Retained as required by applicable laws</li>
                            </ul>
                            <p className="legal-text">
                                You can request deletion of your data at any time by contacting us or using account settings.
                            </p>
                        </section>

                        {/* Your Rights */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">8. Your Rights and Choices</h2>

                            <h3 className="legal-subsection-title">8.1 General Rights</h3>
                            <p className="legal-text">You have the right to:</p>
                            <ul className="legal-list">
                                <li><strong>Access:</strong> Request a copy of your personal data</li>
                                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                                <li><strong>Object:</strong> Object to certain data processing activities</li>
                            </ul>

                            <h3 className="legal-subsection-title">8.2 GDPR Rights (EU Users)</h3>
                            <p className="legal-text">If you are in the European Union, you have additional rights under GDPR:</p>
                            <ul className="legal-list">
                                <li>Right to restriction of processing</li>
                                <li>Right to data portability</li>
                                <li>Right to object to automated decision-making</li>
                                <li>Right to lodge a complaint with a supervisory authority</li>
                            </ul>

                            <h3 className="legal-subsection-title">8.3 CCPA Rights (California Residents)</h3>
                            <p className="legal-text">California residents have the right to:</p>
                            <ul className="legal-list">
                                <li>Know what personal information is collected</li>
                                <li>Know if personal information is sold or shared</li>
                                <li>Opt-out of the sale of personal information</li>
                                <li>Request deletion of personal information</li>
                                <li>Non-discrimination for exercising CCPA rights</li>
                            </ul>

                            <div className="legal-notice">
                                <strong>Note:</strong> We do not sell your personal information to third parties.
                            </div>

                            <h3 className="legal-subsection-title">8.4 How to Exercise Your Rights</h3>
                            <p className="legal-text">
                                To exercise any of these rights, please contact us at privacy@compligen.com or use
                                the settings in your account dashboard.
                            </p>
                        </section>

                        {/* Cookies */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">9. Cookies and Tracking Technologies</h2>
                            <p className="legal-text">We use cookies and similar technologies to:</p>
                            <ul className="legal-list">
                                <li><strong>Essential cookies:</strong> Required for Service functionality</li>
                                <li><strong>Analytics cookies:</strong> Understand how users interact with the Service</li>
                                <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
                                <li><strong>Marketing cookies:</strong> Deliver relevant advertisements (with consent)</li>
                            </ul>
                            <p className="legal-text">
                                You can control cookies through your browser settings. Note that disabling certain
                                cookies may limit Service functionality.
                            </p>
                        </section>

                        {/* International Transfers */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">10. International Data Transfers</h2>
                            <p className="legal-text">
                                Your information may be transferred to and processed in countries other than your country
                                of residence. We ensure appropriate safeguards are in place, including:
                            </p>
                            <ul className="legal-list">
                                <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                                <li>Adequacy decisions by relevant data protection authorities</li>
                                <li>Your explicit consent for specific transfers</li>
                            </ul>
                        </section>

                        {/* Children's Privacy */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">11. Children's Privacy</h2>
                            <p className="legal-text">
                                Our Service is not intended for individuals under 18 years of age. We do not knowingly
                                collect personal information from children. If you become aware that a child has provided
                                us with personal data, please contact us immediately.
                            </p>
                        </section>

                        {/* Changes to Policy */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">12. Changes to This Privacy Policy</h2>
                            <p className="legal-text">
                                We may update this Privacy Policy from time to time. We will notify you of any material
                                changes by:
                            </p>
                            <ul className="legal-list">
                                <li>Posting the new Privacy Policy on this page</li>
                                <li>Updating the "Last updated" date</li>
                                <li>Sending an email notification (for significant changes)</li>
                            </ul>
                            <p className="legal-text">
                                Your continued use of the Service after changes constitutes acceptance of the updated policy.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">13. Contact Us</h2>
                            <p className="legal-text">
                                If you have questions, concerns, or requests regarding this Privacy Policy or our data
                                practices, please contact us:
                            </p>
                            <div className="legal-contact">
                                <p><strong>Email:</strong> privacy@compligen.com</p>
                                <p><strong>Data Protection Officer:</strong> dpo@compligen.com</p>
                                <p><strong>Address:</strong> [Your Business Address]</p>
                                <p><strong>Phone:</strong> [Your Phone Number]</p>
                            </div>
                            <p className="legal-text" style={{ marginTop: '1rem' }}>
                                For EU residents, you may also contact our EU representative at: [EU Representative Contact]
                            </p>
                        </section>
                    </div>

                    {/* Back Button */}
                    <div className="legal-footer-actions">
                        <button
                            onClick={() => navigate('/signup')}
                            className="legal-back-button"
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Privacy