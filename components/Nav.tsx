'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav id="nav" className={scrolled ? 'scrolled' : ''}>
      <Link href="/" className="nav-logo">
        <Image
          src="/images/MB_Logo_pink-pink2.png"
          alt="Modern Bond"
          width={53}
          height={53}
          style={{ mixBlendMode: 'multiply', objectFit: 'contain' }}
        />
      </Link>

      <ul className="nav-links">
        <li><Link href="/#about">About</Link></li>
        <li><Link href="/#coaching">Coaching</Link></li>
        <li><Link href="/community">Community</Link></li>
        <li><Link href="/#products">Marketplace</Link></li>
        <li><Link href="/#experiences">Experiences</Link></li>
      </ul>

      <div className="nav-cta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="snipcart-checkout nav-cart">
          🛒 <span className="snipcart-items-count">0</span>
        </button>
        <Link
          href="/account"
          className="btn-pink"
          style={{ padding: '12px 32px', fontSize: '11px', clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}
        >
          Join Now
        </Link>
      </div>
    </nav>
  );
}
