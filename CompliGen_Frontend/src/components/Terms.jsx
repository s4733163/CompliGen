import React from 'react'
import '../styling/Auth.css'
import Navbar from './Navbar'
import Footer from './Footer'
import { useNavigate } from 'react-router-dom'

const Terms = () => {
    const navigate = useNavigate()

    return (
        <>
            <Navbar />
            <div className="legal-page-container">
                <div className="legal-page-wrapper">
                    {/* Header */}
                    <div className="legal-header">
                        <h1 className="legal-title">Terms of Service</h1>
                        <p className="legal-subtitle">Last updated: December 10, 2024</p>
                    </div>

                    {/* Content */}
                    <div className="legal-content">
                        {/* Introduction */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">1. Agreement to Terms</h2>
                            <p className="legal-text">
                                By accessing or using CompliGen ("Service"), you agree to be bound by these Terms of Service
                                ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                            </p>
                        </section>

                        {/* Use of Service */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">2. Use of Service</h2>
                            <h3 className="legal-subsection-title">2.1 Eligibility</h3>
                            <p className="legal-text">
                                You must be at least 18 years old to use this Service. By using the Service, you represent
                                and warrant that you meet this age requirement.
                            </p>

                            <h3 className="legal-subsection-title">2.2 Account Registration</h3>
                            <p className="legal-text">
                                To access certain features, you must register for an account. You agree to:
                            </p>
                            <ul className="legal-list">
                                <li>Provide accurate, current, and complete information</li>
                                <li>Maintain the security of your password</li>
                                <li>Accept responsibility for all activities under your account</li>
                                <li>Notify us immediately of any unauthorized use</li>
                            </ul>

                            <h3 className="legal-subsection-title">2.3 Acceptable Use</h3>
                            <p className="legal-text">You agree not to:</p>
                            <ul className="legal-list">
                                <li>Use the Service for any illegal purpose</li>
                                <li>Upload malicious code or viruses</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Interfere with or disrupt the Service</li>
                                <li>Impersonate another person or entity</li>
                                <li>Use automated systems to access the Service without permission</li>
                            </ul>
                        </section>

                        {/* Intellectual Property */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">3. Intellectual Property Rights</h2>
                            <h3 className="legal-subsection-title">3.1 Our Content</h3>
                            <p className="legal-text">
                                The Service and its original content, features, and functionality are owned by CompliGen
                                and are protected by international copyright, trademark, patent, trade secret, and other
                                intellectual property laws.
                            </p>

                            <h3 className="legal-subsection-title">3.2 Your Content</h3>
                            <p className="legal-text">
                                You retain ownership of any documents you upload. By uploading content, you grant us a
                                limited license to process, analyze, and store your content solely for the purpose of
                                providing the Service to you.
                            </p>
                        </section>

                        {/* Service Features */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">4. Service Features</h2>
                            <h3 className="legal-subsection-title">4.1 Compliance Checking</h3>
                            <p className="legal-text">
                                Our compliance checking service analyzes your documents against industry standards
                                (ISO 27001, SOC 2, NIST). Results are provided as guidance and do not constitute
                                legal advice or certification.
                            </p>

                            <h3 className="legal-subsection-title">4.2 Policy Generation</h3>
                            <p className="legal-text">
                                Generated policies are templates based on common legal requirements. You are responsible
                                for reviewing, customizing, and ensuring the policies meet your specific legal obligations.
                            </p>

                            <div className="legal-notice">
                                <strong>Important:</strong> CompliGen does not provide legal advice. Consult with a
                                qualified attorney to ensure compliance with applicable laws and regulations.
                            </div>
                        </section>

                        {/* Payment Terms */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">5. Payment Terms</h2>
                            <p className="legal-text">
                                If you purchase a paid subscription, you agree to pay all fees according to the pricing
                                and payment terms in effect at the time. All fees are non-refundable unless otherwise
                                specified.
                            </p>
                        </section>

                        {/* Data & Privacy */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">6. Data and Privacy</h2>
                            <p className="legal-text">
                                Your privacy is important to us. Our collection and use of your personal information is
                                governed by our Privacy Policy. By using the Service, you consent to our data practices
                                as described in the Privacy Policy.
                            </p>
                        </section>

                        {/* Disclaimers */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">7. Disclaimers</h2>
                            <p className="legal-text">
                                The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind,
                                either express or implied, including but not limited to:
                            </p>
                            <ul className="legal-list">
                                <li>Warranties of merchantability</li>
                                <li>Fitness for a particular purpose</li>
                                <li>Non-infringement</li>
                                <li>Accuracy or completeness of results</li>
                            </ul>
                            <p className="legal-text">
                                We do not warrant that the Service will be uninterrupted, timely, secure, or error-free.
                            </p>
                        </section>

                        {/* Limitation of Liability */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">8. Limitation of Liability</h2>
                            <p className="legal-text">
                                To the maximum extent permitted by law, CompliGen shall not be liable for any indirect,
                                incidental, special, consequential, or punitive damages, including loss of profits, data,
                                or goodwill, resulting from:
                            </p>
                            <ul className="legal-list">
                                <li>Your use or inability to use the Service</li>
                                <li>Any unauthorized access to your data</li>
                                <li>Any errors or omissions in the Service</li>
                                <li>Any reliance on compliance reports or generated policies</li>
                            </ul>
                        </section>

                        {/* Indemnification */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">9. Indemnification</h2>
                            <p className="legal-text">
                                You agree to indemnify and hold harmless CompliGen, its officers, directors, employees,
                                and agents from any claims, damages, losses, liabilities, and expenses (including legal fees)
                                arising from your use of the Service or violation of these Terms.
                            </p>
                        </section>

                        {/* Termination */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">10. Termination</h2>
                            <p className="legal-text">
                                We may terminate or suspend your account and access to the Service immediately, without
                                prior notice, for any reason, including breach of these Terms. Upon termination, your
                                right to use the Service will cease immediately.
                            </p>
                        </section>

                        {/* Changes to Terms */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">11. Changes to Terms</h2>
                            <p className="legal-text">
                                We reserve the right to modify these Terms at any time. We will notify you of any changes
                                by posting the new Terms on this page and updating the "Last updated" date. Your continued
                                use of the Service after changes constitutes acceptance of the new Terms.
                            </p>
                        </section>

                        {/* Governing Law */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">12. Governing Law</h2>
                            <p className="legal-text">
                                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
                                without regard to its conflict of law provisions.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="legal-section">
                            <h2 className="legal-section-title">13. Contact Us</h2>
                            <p className="legal-text">
                                If you have any questions about these Terms, please contact us at:
                            </p>
                            <div className="legal-contact">
                                <p><strong>Email:</strong> legal@compligen.com</p>
                                <p><strong>Address:</strong> [Your Business Address]</p>
                            </div>
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

export default Terms