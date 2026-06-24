'use client';

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="tex"></div>

      <div className="legal-hero">
        <div className="sec-label" style={{ justifyContent: 'center' }}>Legal</div>
        <h1 className="legal-title">Privacy <span>Policy</span></h1>
        <p className="legal-effective">Effective Date: June 24, 2026 · joinmodernbond.com</p>
      </div>

      <div className="legal-body">
        <p className="legal-intro">
          Modern Bond (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit
          joinmodernbond.com and use our services, including our community platform, coaching services, and marketplace.
        </p>
        <p className="legal-intro">
          By accessing or using our Services, you confirm that you are at least 18 years of age and consent to the practices
          described in this Privacy Policy. If you do not agree, please discontinue use immediately.
        </p>

        <div className="legal-section">
          <h2 className="legal-section-title"><span>1.</span> Information We Collect</h2>

          <h3 className="legal-subsection-title">1.1 Information You Provide Directly</h3>
          <ul className="legal-list">
            <li>Account registration: name, email address, username, password</li>
            <li>Profile information: display name, bio, avatar, and any personal details you choose to share</li>
            <li>Community content: posts, comments, votes, and messages you submit to our forum</li>
            <li>Purchase information: billing name, shipping address, and order details (payment card data is processed by our third-party payment processor and is not stored on our servers)</li>
            <li>Communications: messages you send to us via email, contact forms, or support channels</li>
            <li>Coaching sessions: information shared during 1:1, couples, group, or scenario coaching engagements</li>
          </ul>

          <h3 className="legal-subsection-title">1.2 Information Collected Automatically</h3>
          <ul className="legal-list">
            <li>Device and browser information: IP address, browser type and version, operating system, device identifiers</li>
            <li>Usage data: pages visited, features used, time spent on the platform, click paths, and referring URLs</li>
            <li>Cookies and similar technologies: session cookies, persistent cookies, and pixel tags (see Section 6)</li>
            <li>Log data: server logs recording your interactions with our Services</li>
          </ul>

          <h3 className="legal-subsection-title">1.3 Information From Third Parties</h3>
          <ul className="legal-list">
            <li>Payment processors (Snipcart): transaction confirmation and fraud-prevention signals</li>
            <li>Analytics providers: aggregated traffic and behavior data</li>
            <li>Social platforms: if you connect a social account, we may receive basic profile data you authorize</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title"><span>2.</span> How We Use Your Information</h2>
          <p className="legal-p">We use the information we collect for the following purposes:</p>
          <ul className="legal-list">
            <li>To create, maintain, and secure your account</li>
            <li>To process orders, payments, and refunds for marketplace products and memberships</li>
            <li>To deliver coaching services and personalize your experience</li>
            <li>To operate and improve our community forum and platform features</li>
            <li>To send transactional communications (order confirmations, account alerts, password resets)</li>
            <li>To send marketing and promotional emails where you have opted in — you may opt out at any time</li>
            <li>To enforce our Terms &amp; Conditions, including age verification and content moderation</li>
            <li>To comply with legal obligations and respond to lawful requests from authorities</li>
            <li>To detect, investigate, and prevent fraud, abuse, and security incidents</li>
            <li>To conduct analytics and research that help us improve our Services</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title"><span>3.</span> Legal Bases for Processing (GDPR / UK GDPR)</h2>
          <p className="legal-p">If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, we process your personal data under the following legal bases:</p>
          <ul className="legal-list">
            <li><strong>Contract performance:</strong> to deliver services you have requested (account management, purchases, coaching)</li>
            <li><strong>Legitimate interests:</strong> to improve our Services, prevent fraud, and conduct analytics — balanced against your privacy rights</li>
            <li><strong>Legal obligation:</strong> to comply with applicable law</li>
            <li><strong>Consent:</strong> for marketing communications and non-essential cookies — you may withdraw consent at any time</li>
          </ul>
          <p className="legal-p">You may request information about the specific legal basis applied to any processing activity by contacting us at the address in Section 12.</p>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title"><span>4.</span> Sharing of Your Information</h2>
          <p className="legal-p">We do not sell your personal information. We may share it in the following circumstances:</p>
          <ul className="legal-list">
            <li><strong>Service providers:</strong> third-party vendors who assist us in operating the platform (hosting, payments via Snipcart, email delivery, analytics, customer support) — bound by data processing agreements</li>
            <li><strong>Coaching providers:</strong> independent coaches who deliver services through our platform, limited to information needed to provide those services</li>
            <li><strong>Business transfers:</strong> in connection with a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction, subject to this Policy</li>
            <li><strong>Legal requirements:</strong> when required by law, court order, or governmental authority</li>
            <li><strong>Protection of rights:</strong> to protect the safety, rights, or property of Modern Bond, our users, or the public</li>
            <li><strong>With your consent:</strong> for any other purpose you explicitly authorize</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title"><span>5.</span> Data Retention</h2>
          <p className="legal-p">We retain your personal information for as long as your account is active or as necessary to provide our Services. Specifically:</p>
          <ul className="legal-list">
            <li>Account data is retained until you request deletion or your account has been inactive for 3 years</li>
            <li>Purchase and billing records are retained for a minimum of 7 years to comply with tax and financial regulations</li>
            <li>Community content (posts, comments) may be retained in anonymized form after account deletion</li>
            <li>Server logs are retained for up to 90 days</li>
          </ul>
          <p className="legal-p">You may request deletion of your account and personal data at any time (subject to legal retention obligations) by contacting us at <a href="mailto:privacy@joinmodernbond.com" className="legal-link">privacy@joinmodernbond.com</a></p>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title"><span>6.</span> Cookies and Tracking Technologies</h2>
          <p className="legal-p">We use cookies and similar technologies to operate our Services:</p>
          <ul className="legal-list">
            <li><strong>Essential cookies:</strong> required for authentication, security, and core platform functionality — these cannot be disabled</li>
            <li><strong>Analytics cookies:</strong> help us understand how users interact with our Services — you may opt out via your browser settings or our cookie preference tool</li>
            <li><strong>Marketing cookies:</strong> used to deliver relevant promotional content — placed only with your consent</li>
          </ul>
          <p className="legal-p">You can control cookies through your browser settings. Disabling non-essential cookies will not prevent you from using core features. For EU/UK users, we obtain consent for non-essential cookies in accordance with the ePrivacy Directive and GDPR.</p>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title"><span>7.</span> International Data Transfers</h2>
          <p className="legal-p">Modern Bond operates from the United States. If you access our Services from outside the US, your information may be transferred to, stored, and processed in the United States or other countries where our service providers operate.</p>
          <p className="legal-p">For transfers of personal data from the EEA, UK, or Switzerland to countries not recognized as providing adequate protection, we rely on appropriate safeguards such as Standard Contractual Clauses (SCCs) approved by the European Commission or the UK Information Commissioner&apos;s Office.</p>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title"><span>8.</span> Your Privacy Rights</h2>

          <h3 className="legal-subsection-title">8.1 All Users</h3>
          <ul className="legal-list">
            <li><strong>Access:</strong> request a copy of the personal data we hold about you</li>
            <li><strong>Correction:</strong> request correction of inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> request deletion of your personal data (subject to legal retention obligations)</li>
            <li><strong>Opt-out of marketing:</strong> unsubscribe from promotional emails via the link in any email or by contacting us</li>
          </ul>

          <h3 className="legal-subsection-title">8.2 EEA / UK Users (GDPR / UK GDPR)</h3>
          <ul className="legal-list">
            <li>Right to restriction: request that we restrict processing of your data</li>
            <li>Right to portability: receive your data in a structured, machine-readable format</li>
            <li>Right to object: object to processing based on legitimate interests</li>
            <li>Right to withdraw consent: at any time for consent-based processing</li>
            <li>Right to lodge a complaint: with your local data protection authority</li>
          </ul>

          <h3 className="legal-subsection-title">8.3 California Residents (CCPA / CPRA)</h3>
          <ul className="legal-list">
            <li><strong>Know:</strong> request disclosure of categories and specific pieces of personal information collected</li>
            <li><strong>Delete:</strong> request deletion of personal information (subject to exceptions)</li>
            <li><strong>Correct:</strong> request correction of inaccurate personal information</li>
            <li><strong>Opt-out of sale or sharing:</strong> we do not sell or share personal information for cross-context behavioral advertising</li>
            <li><strong>Non-discrimination:</strong> we will not discriminate against you for exercising your CCPA rights</li>
          </ul>
          <p className="legal-p">To submit a CCPA request, contact us at <a href="mailto:privacy@joinmodernbond.com" className="legal-link">privacy@joinmodernbond.com</a>. We will verify your identity before processing requests.</p>

          <h3 className="legal-subsection-title">8.4 Canadian Residents (PIPEDA / Provincial Laws)</h3>
          <ul className="legal-list">
            <li>You may request access to, and correction of, personal information we hold about you</li>
            <li>You may withdraw consent to collection, use, or disclosure at any time, subject to legal and contractual restrictions</li>
            <li>You may contact the Office of the Privacy Commissioner of Canada if you believe your rights have been violated</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title"><span>9.</span> Children&apos;s Privacy</h2>
          <p className="legal-p">Our Services are strictly intended for individuals who are 18 years of age or older. We do not knowingly collect personal information from anyone under 18. If we become aware that we have collected data from a minor, we will delete it promptly. If you believe a minor has provided us with personal information, please contact <a href="mailto:privacy@joinmodernbond.com" className="legal-link">privacy@joinmodernbond.com</a> immediately.</p>
          <p className="legal-p">Additionally, in compliance with the Children&apos;s Online Privacy Protection Act (COPPA), we do not knowingly collect information from children under 13.</p>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title"><span>10.</span> Security</h2>
          <p className="legal-p">We implement reasonable administrative, technical, and physical safeguards to protect your personal information from unauthorized access, disclosure, alteration, and destruction. These measures include SSL/TLS encryption for data in transit, access controls, and regular security assessments.</p>
          <p className="legal-p">However, no method of transmission over the Internet or electronic storage is completely secure. We cannot guarantee absolute security. In the event of a data breach, we will notify affected users and relevant authorities as required by applicable law.</p>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title"><span>11.</span> Third-Party Links and Services</h2>
          <p className="legal-p">Our Services may contain links to third-party websites, products, or services. This Privacy Policy does not apply to those third parties. We encourage you to review the privacy policies of any third-party sites you visit. We are not responsible for the privacy practices of third parties.</p>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title"><span>12.</span> Contact Us</h2>
          <p className="legal-p">If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
          <div className="legal-contact-block">
            <p className="legal-contact-name">Modern Bond — Privacy Inquiries</p>
            <p>Email: <a href="mailto:privacy@joinmodernbond.com" className="legal-link">privacy@joinmodernbond.com</a></p>
            <p>Website: <a href="https://joinmodernbond.com" className="legal-link">joinmodernbond.com</a></p>
            <p className="legal-p" style={{ marginTop: '16px' }}>We will respond to verifiable requests within 30 days (or within the timeframe required by applicable law).</p>
          </div>
        </div>

        <div className="legal-section">
          <h2 className="legal-section-title"><span>13.</span> Changes to This Policy</h2>
          <p className="legal-p">We may update this Privacy Policy from time to time. When we do, we will revise the Effective Date at the top of this document and, for material changes, notify you via email or a prominent notice on our website. Your continued use of our Services after changes are posted constitutes acceptance of the updated Policy.</p>
        </div>

        <div className="legal-footer-note">
          © 2026 Modern Bond. All rights reserved. This document does not constitute legal advice. Consult a qualified attorney for jurisdiction-specific guidance.
        </div>
      </div>
    </main>
  );
}
