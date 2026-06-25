'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const STORAGE_KEY = 'mb_age_verified';

export default function AgeGate() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [day, setDay]     = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear]   = useState('');
  const [error, setError] = useState('');
  const [denied, setDenied] = useState(false);

  // On mount, check if already verified in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setVerified(stored === 'true');
    } catch {
      setVerified(false);
    }
  }, []);

  // Still checking localStorage — render nothing to avoid flash
  if (verified === null) return null;
  // Already verified — render nothing (site shows normally)
  if (verified === true) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const d = parseInt(day,   10);
    const m = parseInt(month, 10);
    const y = parseInt(year,  10);

    if (!d || !m || !y || y < 1900 || y > new Date().getFullYear()) {
      setError('Please enter a valid date of birth.');
      return;
    }

    const dob  = new Date(y, m - 1, d);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      setDenied(true);
      return;
    }

    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch { /* private mode */ }
    setVerified(true);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(160deg, #0c0612 0%, #1a0820 50%, #0c0612 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Barlow', sans-serif",
    }}>
      {/* Texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 8px)',
      }} />

      {/* Pink glow orb */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(233,30,140,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '48px 32px', maxWidth: 480, width: '100%',
      }}>

        {/* Logo */}
        <Image
          src="/images/MB_Logo_pink-pink2.png"
          alt="Modern Bond"
          width={180}
          height={60}
          style={{ objectFit: 'contain', mixBlendMode: 'screen', marginBottom: 32 }}
          priority
        />

        {denied ? (
          /* Under-18 denial screen */
          <>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 48,
              color: '#fff', letterSpacing: 2, marginBottom: 16,
            }}>
              Access Restricted
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
              You must be 18 or older to access Modern Bond. This platform contains
              mature content intended for adults only.
            </p>
            <a
              href="https://www.google.com"
              style={{
                display: 'inline-block', padding: '14px 40px',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4,
                color: 'rgba(255,255,255,0.6)', fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 14, letterSpacing: 2, textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Leave Site
            </a>
          </>
        ) : (
          /* Age gate form */
          <>
            <div style={{
              display: 'inline-block', padding: '4px 16px', marginBottom: 24,
              border: '1px solid rgba(233,30,140,0.4)', borderRadius: 2,
              color: '#e91e8c', fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12, letterSpacing: 3, textTransform: 'uppercase',
            }}>
              18+ Only — Mature Content
            </div>

            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 52,
              color: '#fff', letterSpacing: 2, lineHeight: 1, marginBottom: 12,
            }}>
              Verify Your Age
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>
              Modern Bond contains mature content intended for adults only.
              Enter your date of birth to continue.
            </p>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 8, justifyContent: 'center' }}>
                {/* Day */}
                <div style={{ flex: '0 0 70px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.4)',
                  }}>Day</label>
                  <input
                    type="number" min="1" max="31" placeholder="DD"
                    value={day} onChange={e => setDay(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Month */}
                <div style={{ flex: '0 0 70px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.4)',
                  }}>Month</label>
                  <input
                    type="number" min="1" max="12" placeholder="MM"
                    value={month} onChange={e => setMonth(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Year */}
                <div style={{ flex: '0 0 100px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.4)',
                  }}>Year</label>
                  <input
                    type="number" min="1900" max={new Date().getFullYear()} placeholder="YYYY"
                    value={year} onChange={e => setYear(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              {error && (
                <p style={{ color: '#e91e8c', fontSize: 13, marginBottom: 16 }}>{error}</p>
              )}

              <button
                type="submit"
                style={{
                  width: '100%', padding: '16px', marginTop: 20,
                  background: 'linear-gradient(135deg, #e91e8c, #f548a8)',
                  border: 'none', borderRadius: 4, cursor: 'pointer',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 15, fontWeight: 700, letterSpacing: 3,
                  textTransform: 'uppercase', color: '#fff',
                  boxShadow: '0 0 32px rgba(233,30,140,0.35)',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Enter Site
              </button>

              <a
                href="https://www.google.com"
                style={{
                  display: 'block', marginTop: 16,
                  color: 'rgba(255,255,255,0.3)', fontSize: 13,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: 1, textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >
                I am under 18 — Exit
              </a>
            </form>

            {/* Legal footer */}
            <p style={{
              marginTop: 40, color: 'rgba(255,255,255,0.25)', fontSize: 11,
              lineHeight: 1.6, maxWidth: 360,
            }}>
              By entering, you confirm you are 18 years of age or older, you consent
              to viewing adult content, and you agree to our{' '}
              <a href="/terms" style={{ color: 'rgba(233,30,140,0.7)', textDecoration: 'underline' }}>
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" style={{ color: 'rgba(233,30,140,0.7)', textDecoration: 'underline' }}>
                Privacy Policy
              </a>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 8px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 4, color: '#fff',
  fontSize: 16, textAlign: 'center',
  fontFamily: "'Barlow', sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s',
};
