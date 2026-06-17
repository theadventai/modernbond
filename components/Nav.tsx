'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isMod, setIsMod] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
        {isMod && <li><Link href="/admin" className="nav-admin">Admin</Link></li>}
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
          {username ? `@${username}` : 'Join Now'}
        </Link>
      </div>
    </nav>
  );
}
