'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const STORAGE_KEY = 'mb_age_verified';

export default function AgeGate() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState('');

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
    if (!checked) {
      setError('You must confirm you are 18 or older to continue.');
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
          Age Verification
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>
          Modern Bond contains mature content intended for adults only.
          Please confirm your age to continue.
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '16px 18px', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4,
            cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s',
          }}>
            <input
              type="checkbox"
              checked={checked}
              onChange={e => { setChecked(e.target.checked); setError(''); }}
              style={{
                marginTop: 2, width: 20, height: 20, flexShrink: 0,
                accentColor: '#e91e8c', cursor: 'pointer',
              }}
            />
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.6 }}>
              I certify that I am at least 18 years old and consent to viewing adult content.
            </span>
          </label>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.3)',
              padding: '12px 16px', borderRadius: 4, marginTop: 16,
            }}>
              <span style={{ fontSize: 18 }}>⚡</span>
              <p style={{ color: '#f548a8', fontSize: 13, margin: 0, fontWeight: 500 }}>{error}</p>
            </div>
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
      </div>
    </div>
  );
}
