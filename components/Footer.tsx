'use client';

import Link from 'next/link';
import Image from 'next/image';
import { reopenCookieConsent } from '@/lib/cookieConsent';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <Image
                src="/images/LogoAvatar_001_v001.jpg"
                alt="Modern Bond"
                width={48}
                height={48}
                style={{ mixBlendMode: 'screen', objectFit: 'contain' }}
              />
            </div>
            <p>A next-generation platform for modern intimacy, connection, and personal growth. Learn, connect, discover, and experience with intention.</p>
          </div>
          <div>
            <div className="footer-col-h">Platform</div>
            <ul className="footer-links">
              <li><Link href="/#about">About</Link></li>
              <li><Link href="/#coaching">Coaching</Link></li>
              <li><Link href="/community">Community</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-h">Explore</div>
            <ul className="footer-links">
              <li><Link href="/#products">Marketplace</Link></li>
              <li><Link href="/#experiences">Experiences</Link></li>
              <li><Link href="/account">Join</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-h">Connect</div>
            <ul className="footer-links">
              <li><a href="#">Instagram</a></li>
              <li><a href="#">TikTok</a></li>
              <li><a href="#">YouTube</a></li>
              <li><a href="#">Spotify</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 Modern Bond. All rights reserved.</div>
          <div className="footer-soc">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
            <button
              onClick={reopenCookieConsent}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Cookie Preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
