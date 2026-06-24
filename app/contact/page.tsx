'use client';

import { useState } from 'react';

type FormState = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactPage() {
  const [state, setState] = useState<FormState>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setState(res.ok ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  }

  return (
    <main className="contact-page">
      <div className="tex"></div>

      <div className="contact-hero">
        <div className="sec-label" style={{ justifyContent: 'center' }}>Get In Touch</div>
        <h1 className="contact-title">Let&apos;s <span>Connect</span></h1>
        <p className="contact-subtitle">Questions, coaching inquiries, partnerships, or just want to say hi — we&apos;re here for it.</p>
      </div>

      <div className="contact-body">
        <div className="contact-grid">

          {/* Left: info */}
          <div className="contact-info">
            <div className="contact-info-block">
              <div className="contact-info-icon">✉</div>
              <div>
                <div className="contact-info-label">General Inquiries</div>
                <a href="mailto:support@joinmodernbond.com" className="contact-info-val">support@joinmodernbond.com</a>
              </div>
            </div>
            <div className="contact-info-block">
              <div className="contact-info-icon">⚡</div>
              <div>
                <div className="contact-info-label">Coaching &amp; Partnerships</div>
                <a href="mailto:hello@joinmodernbond.com" className="contact-info-val">hello@joinmodernbond.com</a>
              </div>
            </div>
            <div className="contact-info-block">
              <div className="contact-info-icon">🔒</div>
              <div>
                <div className="contact-info-label">Privacy &amp; Legal</div>
                <a href="mailto:privacy@joinmodernbond.com" className="contact-info-val">privacy@joinmodernbond.com</a>
              </div>
            </div>
            <div className="contact-tagline">
              We respond to all messages within <strong>1–2 business days</strong>.
            </div>
          </div>

          {/* Right: form */}
          <div className="contact-form-wrap">
            {state === 'sent' ? (
              <div className="contact-success">
                <div className="contact-success-icon">⚡</div>
                <h2 className="contact-success-title">Message Sent</h2>
                <p>Thanks for reaching out. We&apos;ll be in touch within 1–2 business days.</p>
                <button className="btn-pink" style={{ marginTop: '24px' }} onClick={() => { setState('idle'); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label className="contact-label">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      className="contact-input"
                      placeholder="First &amp; last name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="contact-field">
                    <label className="contact-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="contact-input"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="contact-field">
                  <label className="contact-label">Subject</label>
                  <select
                    name="subject"
                    className="contact-input contact-select"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a topic…</option>
                    <option value="coaching">Coaching Inquiry</option>
                    <option value="membership">Membership &amp; Billing</option>
                    <option value="marketplace">Marketplace &amp; Orders</option>
                    <option value="community">Community &amp; Account</option>
                    <option value="partnership">Partnership &amp; Press</option>
                    <option value="privacy">Privacy &amp; Legal</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="contact-field">
                  <label className="contact-label">Message</label>
                  <textarea
                    name="message"
                    className="contact-input contact-textarea"
                    placeholder="Tell us what&apos;s on your mind…"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                </div>

                {state === 'error' && (
                  <p className="contact-error">Something went wrong. Please try emailing us directly at <a href="mailto:support@joinmodernbond.com">support@joinmodernbond.com</a>.</p>
                )}

                <button
                  type="submit"
                  className="btn-pink contact-submit"
                  disabled={state === 'sending'}
                >
                  {state === 'sending' ? 'Sending…' : 'Send Message ⚡'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
