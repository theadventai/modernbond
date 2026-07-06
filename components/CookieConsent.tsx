'use client';

import { useEffect, useState } from 'react';
import { getCookieConsent, setCookieConsent, REOPEN_COOKIE_CONSENT_EVENT } from '@/lib/cookieConsent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = getCookieConsent();
    if (!existing) setVisible(true);
    if (existing) { setAnalytics(existing.analytics); setMarketing(existing.marketing); }
    const onReopen = () => {
      const current = getCookieConsent();
      if (current) { setAnalytics(current.analytics); setMarketing(current.marketing); }
      setManageOpen(true);
      setVisible(true);
    };
    window.addEventListener(REOPEN_COOKIE_CONSENT_EVENT, onReopen);
    return () => window.removeEventListener(REOPEN_COOKIE_CONSENT_EVENT, onReopen);
  }, []);

  function acceptAll() {
    setCookieConsent({ analytics: true, marketing: true });
    setVisible(false);
  }

  function rejectNonEssential() {
    setCookieConsent({ analytics: false, marketing: false });
    setVisible(false);
  }

  function savePreferences() {
    setCookieConsent({ analytics, marketing });
    setVisible(false);
  }

  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 9998,
      display: visible ? 'flex' : 'none', justifyContent: 'center', padding: '16px',
      fontFamily: "'Barlow', sans-serif",
    }}>
      <div style={{
        width: '100%', maxWidth: 720,
        background: 'linear-gradient(160deg, #1a0820 0%, #100818 100%)',
        border: '1px solid rgba(233,30,140,0.3)', borderRadius: 8,
        boxShadow: '0 -8px 40px rgba(0,0,0,0.5), 0 0 32px rgba(233,30,140,0.15)',
        padding: '24px 28px',
      }}>
        {!manageOpen ? (
          <>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
              We use essential cookies to run Modern Bond (account, cart, security). With your permission,
              we&apos;d also like to use analytics and marketing cookies to improve the experience. See our{' '}
              <a href="/privacy" style={{ color: '#f548a8', textDecoration: 'underline' }}>Privacy Policy</a>.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <button onClick={acceptAll} style={pinkBtnStyle}>Accept All</button>
              <button onClick={rejectNonEssential} style={outlineBtnStyle}>Reject Non-Essential</button>
              <button onClick={() => setManageOpen(true)} style={linkBtnStyle}>Manage Preferences</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 18 }}>
              <ConsentRow
                label="Essential"
                desc="Required for login, cart, and security. Cannot be disabled."
                checked disabled
              />
              <ConsentRow
                label="Analytics"
                desc="Helps us understand how visitors use the site."
                checked={analytics}
                onChange={setAnalytics}
              />
              <ConsentRow
                label="Marketing"
                desc="Used to deliver relevant promotions."
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <button onClick={savePreferences} style={pinkBtnStyle}>Save Preferences</button>
              <button onClick={() => setManageOpen(false)} style={linkBtnStyle}>Back</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ConsentRow({
  label, desc, checked, disabled, onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '10px 0', cursor: disabled ? 'default' : 'pointer',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange?.(e.target.checked)}
        style={{ marginTop: 3, width: 18, height: 18, flexShrink: 0, accentColor: '#e91e8c', cursor: disabled ? 'default' : 'pointer' }}
      />
      <span>
        <span style={{ display: 'block', color: '#fff', fontSize: 14, fontWeight: 600 }}>{label}</span>
        <span style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{desc}</span>
      </span>
    </label>
  );
}

const pinkBtnStyle: React.CSSProperties = {
  padding: '12px 28px', background: 'linear-gradient(135deg, #e91e8c, #f548a8)',
  border: 'none', borderRadius: 4, cursor: 'pointer',
  fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700,
  letterSpacing: '.1em', textTransform: 'uppercase', color: '#fff',
};

const outlineBtnStyle: React.CSSProperties = {
  padding: '12px 28px', background: 'transparent',
  border: '1px solid rgba(255,255,255,0.25)', borderRadius: 4, cursor: 'pointer',
  fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700,
  letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
};

const linkBtnStyle: React.CSSProperties = {
  padding: '12px 8px', background: 'transparent', border: 'none', cursor: 'pointer',
  fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700,
  letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(233,30,140,0.8)',
};
