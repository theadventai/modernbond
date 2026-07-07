'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

// Navigate to a homepage section, closing Snipcart first to prevent hash stacking.
function goToSection(hash: string, onDone?: () => void) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onDone?.();
    try { (window as any).Snipcart?.api?.theme?.cart?.close(); } catch {}
    window.location.href = '/' + hash;
  };
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isMod, setIsMod] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close the mobile menu on route/hash changes
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);

  // Force dark nav whenever Snipcart's cart/checkout hash is active
  useEffect(() => {
    const check = () => setCartOpen(window.location.hash.startsWith('#/'));
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, []);

  useEffect(() => {
    let active = true;
    async function loadProfile(userId: string | undefined) {
      if (!userId) { if (active) { setUsername(null); setIsMod(false); } return; }
      const { data } = await supabase.from('profiles').select('username, is_moderator').eq('id', userId).single();
      if (active) { setUsername(data?.username ?? null); setIsMod(!!data?.is_moderator); }
    }
    supabase.auth.getUser().then(({ data: { user } }) => loadProfile(user?.id));
    // Keep the nav in sync with login / logout across the whole app.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user?.id);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  return (
    <>
    <nav id="nav" className={scrolled || cartOpen ? 'scrolled' : ''}>
      <a href="https://www.joinmodernbond.com" className="nav-logo">
        <Image
          src="/images/MB_Logo_pink-pink2.png"
          alt="Modern Bond"
          width={53}
          height={53}
          style={{ mixBlendMode: 'multiply', objectFit: 'contain' }}
        />
      </a>

      <ul className="nav-links">
        <li><a href="/#about" onClick={goToSection('#about')}>About</a></li>
        <li><a href="/#coaching" onClick={goToSection('#coaching')}>Coaching</a></li>
        <li>
          {username
            ? <Link href="/community">Community</Link>
            : <a href="/#community" onClick={goToSection('#community')}>Community</a>
          }
        </li>
        <li><a href="/#products" onClick={goToSection('#products')}>Marketplace</a></li>
        <li><a href="/#experiences" onClick={goToSection('#experiences')}>Experiences</a></li>
        {isMod && <li><Link href="/admin" className="nav-admin">Admin</Link></li>}
      </ul>

      <div className="nav-cta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="snipcart-checkout nav-cart">
          <span className="nav-cart-icon">🛒</span>
          <span className="snipcart-items-count">0</span>
        </button>
        <Link
          href="/account"
          className="btn-pink nav-join"
          style={{ padding: '12px 32px', fontSize: '11px', clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}
        >
          {username ? `@${username}` : 'Join Now'}
        </Link>
        <button
          className={'nav-burger' + (menuOpen ? ' is-open' : '')}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    {/* Rendered as a sibling of <nav>, not a child: nav.scrolled sets backdrop-filter,
        which creates a containing block for position:fixed descendants and would
        otherwise confine this "full viewport" overlay to nav's own ~80px-tall box. */}
    <div className={'nav-mobile-menu' + (menuOpen ? ' is-open' : '')}>
      <ul className="nav-mobile-links">
        <li><a href="/#about" onClick={goToSection('#about', () => setMenuOpen(false))}>About</a></li>
        <li><a href="/#coaching" onClick={goToSection('#coaching', () => setMenuOpen(false))}>Coaching</a></li>
        <li>
          {username
            ? <Link href="/community" onClick={() => setMenuOpen(false)}>Community</Link>
            : <a href="/#community" onClick={goToSection('#community', () => setMenuOpen(false))}>Community</a>
          }
        </li>
        <li><a href="/#products" onClick={goToSection('#products', () => setMenuOpen(false))}>Marketplace</a></li>
        <li><a href="/#experiences" onClick={goToSection('#experiences', () => setMenuOpen(false))}>Experiences</a></li>
        {isMod && <li><Link href="/admin" className="nav-admin" onClick={() => setMenuOpen(false)}>Admin</Link></li>}
      </ul>
      <Link
        href="/account"
        className="btn-pink"
        style={{ marginTop: '32px', padding: '16px 44px' }}
        onClick={() => setMenuOpen(false)}
      >
        {username ? `@${username}` : 'Join Now'}
      </Link>
    </div>
    </>
  );
}
