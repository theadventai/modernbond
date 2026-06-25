'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  useEffect(() => {
    // Scroll reveal
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    // Hero parallax on scroll
    const onParallax = () => {
      const bloom = document.querySelector<HTMLElement>('.hero-bloom');
      if (bloom) bloom.style.transform = `translateX(-50%) translateY(${window.scrollY * 0.15}px)`;
    };
    window.addEventListener('scroll', onParallax, { passive: true });

    // Hero bloom mouse parallax
    const onMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      const bloom = document.querySelector<HTMLElement>('.hero-bloom');
      if (bloom) bloom.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y}px)`;
    };
    document.addEventListener('mousemove', onMouse);

    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', onParallax);
      document.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <>
      {/* ══════════════════════════════════════════ HERO */}
      <section id="hero">
        <div className="hero-bg"></div>
        <div className="tex"></div>
        <div className="hero-img-wrap">
          <img src="/images/Image_VTAR_002_LAnding_v003.png" alt="Modern Bond" />
        </div>
        <div className="hero-top-fade"></div>
        <div className="hero-bottom-fade"></div>
        <div className="hero-bloom"></div>
        <div className="hero-side hero-side-left">⚡ Modern Intimacy Coaching for Individuals + Couples ⚡</div>
        <div className="hero-side hero-side-right">Coaching / Content / Community / Products / Experiences</div>
        <div className="hero-content">
          <img src="/images/Tagline_001_v002.png" alt="Unlock Your Best S*x Life" className="hero-tagline-img reveal" />
          <div className="hero-supertitle reveal d1">⚡ The Unfiltered Platform to Modern Intimacy ⚡</div>
          <div className="hero-ctas reveal d2">
            <Link href="#join" className="btn-pink">Begin Your Journey</Link>
            <Link href="#coaching" className="btn-outline">Explore Coaching</Link>
          </div>
        </div>
        <div className="scroll-line">
          <div className="scroll-bar"></div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ PINK BAND MARQUEE */}
      <div className="marquee-outer mq-band">
        <div className="marquee-track rev">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '32px', padding: '0 32px' }}>
            <span className="mq-word">Intimacy</span><span className="mq-dot"></span>
            <span className="mq-word">Connection</span><span className="mq-dot"></span>
            <span className="mq-word">Coaching</span><span className="mq-dot"></span>
            <span className="mq-word">Confidence</span><span className="mq-dot"></span>
            <span className="mq-word">Community</span><span className="mq-dot"></span>
            <span className="mq-word">Growth</span><span className="mq-dot"></span>
            <span className="mq-word">Experience</span><span className="mq-dot"></span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '32px', padding: '0 32px' }} aria-hidden="true">
            <span className="mq-word">Intimacy</span><span className="mq-dot"></span>
            <span className="mq-word">Connection</span><span className="mq-dot"></span>
            <span className="mq-word">Coaching</span><span className="mq-dot"></span>
            <span className="mq-word">Confidence</span><span className="mq-dot"></span>
            <span className="mq-word">Community</span><span className="mq-dot"></span>
            <span className="mq-word">Growth</span><span className="mq-dot"></span>
            <span className="mq-word">Experience</span><span className="mq-dot"></span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════ BIG MARQUEE */}
      <div className="marquee-outer" style={{ padding: '36px 0', overflow: 'hidden' }}>
        <div className="marquee-track" style={{ animationDuration: '32s' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px' }}>
            <span className="mq-word">LEARN</span><span className="mq-dot"></span>
            <span className="mq-word lit">CONNECT</span><span className="mq-dot"></span>
            <span className="mq-word">DISCOVER</span><span className="mq-dot"></span>
            <span className="mq-word lit">EXPERIENCE</span><span className="mq-dot"></span>
            <span className="mq-word">GROW</span><span className="mq-dot"></span>
            <span className="mq-word lit">BOND</span><span className="mq-dot"></span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px' }} aria-hidden="true">
            <span className="mq-word">LEARN</span><span className="mq-dot"></span>
            <span className="mq-word lit">CONNECT</span><span className="mq-dot"></span>
            <span className="mq-word">DISCOVER</span><span className="mq-dot"></span>
            <span className="mq-word lit">EXPERIENCE</span><span className="mq-dot"></span>
            <span className="mq-word">GROW</span><span className="mq-dot"></span>
            <span className="mq-word lit">BOND</span><span className="mq-dot"></span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════ ABOUT */}
      <section id="about">
        <div className="about-bg"></div>
        <div className="tex"></div>
        <div className="about-grid">
          <div>
            <div className="sec-label reveal">Who We Are</div>
            <h2 className="about-h2 reveal d1">Let&apos;s Get <span>Real.</span></h2>
            <div className="about-body reveal d2">
              <p>Modern Bond is where sex gets real. We believe a hot sex life and deep connection aren&apos;t magic — they&apos;re skills you can actually learn. We&apos;re not here to be gentle — <strong>we&apos;re here to get you results.</strong></p>
              <p>We built one raw, unfiltered playground that combines expert coaching, a community that tells it like it is, tools that actually work, and experiences you won&apos;t forget.</p>
              <p>Whether you&apos;re building confidence or looking to level up, you&apos;re in the right place. This is for everyone who&apos;s done with mediocre and <strong>ready for more.</strong></p>
            </div>
            <div className="about-values reveal d3">
              <div className="val">Trust &amp; Safety</div>
              <div className="val">Expert-Led Coaching</div>
              <div className="val">Like-Minded Community</div>
              <div className="val">Curated Tools &amp; Products</div>
              <div className="val">Modern &amp; Unapologetic</div>
            </div>
          </div>
          <div className="about-right reveal d2">
            <div className="about-logo-wrap">
              <img src="/images/ABOUT_Image_001_v014.png" alt="A New Standard for Deeper Intimacy" />
            </div>
            <div className="about-stats">
              <div className="stat-box"><span className="stat-n">8</span><span className="stat-l">Experiences</span></div>
              <div className="stat-box"><span className="stat-n">1:1</span><span className="stat-l">Coaching</span></div>
              <div className="stat-box"><span className="stat-n">∞</span><span className="stat-l">Growth</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ COACHING */}
      <section id="coaching">
        <div className="coaching-bg"></div>
        <div className="tex"></div>
        <div className="coaching-inner">
          <div className="coaching-top">
            <h2 className="coaching-h2 reveal">Guides<br />&amp; <span>Coaching</span></h2>
            <div className="coaching-intro reveal d1">
              <p>Intimacy doesn't just happen. It is built through <strong>trust, communication, curiosity, and practice.</strong></p>
              <p style={{ marginTop: '14px' }}>The stronger the connection, the stronger the experience. This is where you learn, ask real questions, and develop the skills to connect with clarity and confidence.</p>
            </div>
          </div>
          <div className="coaching-grid">
            <div className="c-card reveal">
              <div className="c-card-text">
                <div className="c-num">01</div>
                <div className="c-title">1:1 Coaching</div>
                <div className="c-desc">Private, focused sessions for personal guidance and lasting clarity.</div>
              </div>
              <div className="c-card-img"><img src="/images/1on1Icon_v003.png" alt="" className="c-card-icon" /></div>
            </div>
            <div className="c-card reveal d1">
              <div className="c-card-text">
                <div className="c-num">02</div>
                <div className="c-title">Couples Coaching</div>
                <div className="c-desc">Better communication, deeper understanding, stronger connection.</div>
              </div>
              <div className="c-card-img"><img src="/images/CouplesC_Icon_v003.png" alt="" className="c-card-icon" /></div>
            </div>
            <div className="c-card reveal d2">
              <div className="c-card-text">
                <div className="c-num">03</div>
                <div className="c-title">Group Coaching</div>
                <div className="c-desc">Shared learning in a curated group of like-minded people.</div>
              </div>
              <div className="c-card-img"><img src="/images/GroupC_Icon_v003.png" alt="" className="c-card-icon" /></div>
            </div>
            <div className="c-card reveal d3">
              <div className="c-card-text">
                <div className="c-num">04</div>
                <div className="c-title">Scenario Coaching</div>
                <div className="c-desc">What to say and how to handle real-life moments with confidence.</div>
              </div>
              <div className="c-card-img"><img src="/images/ScenarioC_Icon_v003.png" alt="" className="c-card-icon" /></div>
            </div>
          </div>
          <div className="coaching-feat reveal">
            <div>
              <div className="sec-label">Our Promise</div>
              <p className="feat-quote">&ldquo;Coaching designed to help you <span>communicate better</span>, connect deeper, and feel more confident in real-life situations.&rdquo;</p>
              <div style={{ marginTop: '36px' }}>
                <Link href="#join" className="btn-pink">Book a Session</Link>
              </div>
            </div>
            <div className="feat-items">
              <div className="feat-item"><span className="feat-arrow">→</span><div className="feat-text"><strong>For Individuals</strong>Build confidence, clarity, and real-world communication skills.</div></div>
              <div className="feat-item"><span className="feat-arrow">→</span><div className="feat-text"><strong>For Couples</strong>Deepen trust, improve communication, and strengthen your bond.</div></div>
              <div className="feat-item"><span className="feat-arrow">→</span><div className="feat-text"><strong>For Groups</strong>Learn alongside others navigating similar journeys.</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ REVERSE MARQUEE */}
      <div className="marquee-outer" style={{ padding: '36px 0', overflow: 'hidden', borderTop: '1px solid rgba(233,30,140,.08)', borderBottom: '1px solid rgba(233,30,140,.08)' }}>
        <div className="marquee-track rev">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px' }}>
            <span className="mq-word lit">INTIMACY</span><span className="mq-dot"></span>
            <span className="mq-word">TRUST</span><span className="mq-dot"></span>
            <span className="mq-word lit">COMMUNICATION</span><span className="mq-dot"></span>
            <span className="mq-word">CONFIDENCE</span><span className="mq-dot"></span>
            <span className="mq-word lit">GROWTH</span><span className="mq-dot"></span>
            <span className="mq-word">PLEASURE</span><span className="mq-dot"></span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px' }} aria-hidden="true">
            <span className="mq-word lit">INTIMACY</span><span className="mq-dot"></span>
            <span className="mq-word">TRUST</span><span className="mq-dot"></span>
            <span className="mq-word lit">COMMUNICATION</span><span className="mq-dot"></span>
            <span className="mq-word">CONFIDENCE</span><span className="mq-dot"></span>
            <span className="mq-word lit">GROWTH</span><span className="mq-dot"></span>
            <span className="mq-word">PLEASURE</span><span className="mq-dot"></span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════ COMMUNITY */}
      <section id="community">
        <div className="community-bg"></div>
        <div className="tex"></div>
        <div className="community-inner">
          <div className="community-hero">
            <div className="community-hero-img-wrap reveal">
              <img src="/images/COMUNITY_Image_001_v006-1.png" alt="" className="community-hero-img" />
            </div>
            <div className="community-hero-center">
              <div className="sec-label reveal" style={{ justifyContent: 'center' }}>A Refined Space</div>
              <h2 className="community-h2 reveal d1">
                <span className="out">COM</span><span className="pink-fill">MUNI</span><span className="fill">TY</span>
              </h2>
              <p className="community-desc reveal d2" style={{ marginBottom: 0 }}>
                A curated space for like-minded people to connect, share, and grow together.
                Private, intentional, and built for real belonging.
              </p>
            </div>
            <div className="community-hero-img-wrap reveal">
              <img src="/images/COMUNITY_Image_001_v006-2.png" alt="" className="community-hero-img" />
            </div>
          </div>
          <div className="pillars">
            <div className="pillar reveal">
              <div className="pillar-img-wrap">
                <img src="/images/CONNECT_Icon_v002.png" alt="" className="pillar-img" />
              </div>
              <div className="pillar-content">
                <div className="pillar-n">01</div>
                <div className="pillar-title">Connect</div>
                <div className="pillar-desc">Meet people on the same path — curious, intentional, and ready to grow. Our community is curated, not just collected.</div>
                <Link href="/community" className="pillar-link">Join the Circle →</Link>
              </div>
            </div>
            <div className="pillar reveal d1">
              <div className="pillar-img-wrap">
                <img src="/images/SHARE_Icon_v002.png" alt="" className="pillar-img" />
              </div>
              <div className="pillar-content">
                <div className="pillar-n">02</div>
                <div className="pillar-title">Share</div>
                <div className="pillar-desc">Real conversations, honest experiences, and genuine support. Vulnerability here is met with respect, always.</div>
                <Link href="/community" className="pillar-link">Start Sharing →</Link>
              </div>
            </div>
            <div className="pillar reveal d2">
              <div className="pillar-img-wrap">
                <img src="/images/GROW_Icon_v002.png" alt="" className="pillar-img" />
              </div>
              <div className="pillar-content">
                <div className="pillar-n">03</div>
                <div className="pillar-title">Grow</div>
                <div className="pillar-desc">Ongoing engagement, group learning, and shared milestones. Growth is better when it happens together.</div>
                <Link href="/community" className="pillar-link">Begin Growing →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ PRODUCTS / MARKETPLACE */}
      <section id="products">
        <div className="products-bg"></div>
        <div className="tex"></div>
        <div className="products-inner">
          <div className="products-hdr">
            <h2 className="products-h2 reveal">The<br /><span>Marketplace</span></h2>
            <p className="products-sub reveal d1">Curated products and tools selected to elevate intimacy, confidence, and connection. Simple, selective, premium.</p>
          </div>
          <div className="products-row">
            <Link href="/products/deep-connections-pillow" className="prod-card reveal" style={{ textDecoration: 'none' }}>
              <div className="prod-vis" style={{ background: "url('/marketplace/deep_connections_pillow/COVER_PronePillow_v002.png') center/cover no-repeat" }}></div>
              <div className="prod-overlay"></div>
              <div className="prod-info">
                <div className="prod-cat">Intimacy · Physical</div>
                <div className="prod-name">Deep Connections Pillow</div>
                <div className="prod-price">$89 — Better angles, deeper connection</div>
              </div>
              <div className="prod-hover"><div className="prod-btn">Shop Now</div></div>
            </Link>
            <Link href="/products/love-blanket" className="prod-card reveal d1" style={{ textDecoration: 'none' }}>
              <div className="prod-vis" style={{ background: "url('/marketplace/the_love_blanket/COVER_TheLoveBlanket_v001_cover.jpg') center/cover no-repeat" }}></div>
              <div className="prod-overlay"></div>
              <div className="prod-info">
                <div className="prod-cat">Comfort · Physical</div>
                <div className="prod-name">The Love Blanket</div>
                <div className="prod-price">$79 — Wrap yourself in warmth</div>
              </div>
              <div className="prod-hover"><div className="prod-btn">Shop Now</div></div>
            </Link>
            <Link href="/products/coconu-lube" className="prod-card reveal d2" style={{ textDecoration: 'none' }}>
              <div className="prod-vis" style={{ background: "url('/marketplace/coconu_lube/COVER_COCONUT_Lube_v001.jpg') center/cover no-repeat" }}></div>
              <div className="prod-overlay"></div>
              <div className="prod-info">
                <div className="prod-cat">Wellness · Physical</div>
                <div className="prod-name">Coconu Lube</div>
                <div className="prod-price">$32 — Natural, body-safe, deeply luxurious</div>
              </div>
              <div className="prod-hover"><div className="prod-btn">Shop Now</div></div>
            </Link>
            <Link href="/products/matchmaker-candle" className="prod-card reveal d1" style={{ textDecoration: 'none' }}>
              <div className="prod-vis" style={{ background: "url('/marketplace/matchmaker_candle/COVER_Matchmaker_Candle.png') center/cover no-repeat" }}></div>
              <div className="prod-overlay"></div>
              <div className="prod-info">
                <div className="prod-cat">Wellness · Physical</div>
                <div className="prod-name">Matchmaker Candle</div>
                <div className="prod-price">$38 — Light it. Let it melt. Feel everything.</div>
              </div>
              <div className="prod-hover"><div className="prod-btn">Shop Now</div></div>
            </Link>
            <Link href="/products/raunchier-together" className="prod-card reveal d2" style={{ textDecoration: 'none' }}>
              <div className="prod-vis" style={{ background: "url('/marketplace/raunchier_together_cardgame/Cover_CardGame.png') center/cover no-repeat" }}></div>
              <div className="prod-overlay"></div>
              <div className="prod-info">
                <div className="prod-cat">Game · Physical</div>
                <div className="prod-name">Raunchier Together</div>
                <div className="prod-price">$42 — Play bold. Connect deeper.</div>
              </div>
              <div className="prod-hover"><div className="prod-btn">Shop Now</div></div>
            </Link>
            <Link href="/products/sexy-time-candle" className="prod-card reveal d3" style={{ textDecoration: 'none' }}>
              <div className="prod-vis" style={{ background: "url('/marketplace/sexy_time_candle/COVER_Candle.jpg') center/cover no-repeat" }}></div>
              <div className="prod-overlay"></div>
              <div className="prod-info">
                <div className="prod-cat">Wellness · Physical</div>
                <div className="prod-name">Sexy Time Candle</div>
                <div className="prod-price">$34 — Set the scene. Own the moment.</div>
              </div>
              <div className="prod-hover"><div className="prod-btn">Shop Now</div></div>
            </Link>
          </div>
          <div style={{ textAlign: 'center', marginTop: '52px' }} className="reveal">
            <Link href="#products" className="btn-outline">Browse All Products</Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ EXPERIENCES */}
      <section id="experiences">
        <div className="exp-bg"></div>
        <div className="tex"></div>
        <div className="exp-inner">
          <div className="sec-label reveal" style={{ justifyContent: 'center' }}>Exclusive &amp; Curated</div>
          <h2 className="exp-h2 reveal d1" style={{ textAlign: 'center' }}>Experi<span>ences</span></h2>
          <div className="exp-visual reveal d2">
            <img src="/images/MB_Experiences_v012.png" alt="Modern Bond Experiences" />
            <div className="exp-cs-overlay">
              <div className="exp-cs-badge">Coming Soon</div>
            </div>
          </div>
          <div className="exp-coming-soon reveal d3">
            <p className="exp-cs-copy">We're crafting a series of immersive events, retreats, and curated gatherings designed to deepen connection in real life. Something truly special is on its way.</p>
            <Link href="#join" className="btn-pink">Get Early Access</Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ JOIN / PRICING */}
      <section id="join">
        <div className="join-bg"></div>
        <div className="join-glow"></div>
        <div className="tex"></div>
        <div className="join-inner">
          <div className="join-eyebrow reveal">Begin Your Journey</div>
          <h2 className="join-h2 reveal d1">JOIN<br /><span>Modern Bond</span></h2>
          <p className="join-desc reveal d2">
            Access the full Modern Bond experience — education, community, curated products, and exclusive events. All in one place, built with intention.
          </p>
          <div className="tiers">
            <div className="tier reveal">
              <div className="tier-name">Explorer Member</div>
              <div className="tier-price">Free <span>/ always</span></div>
              <ul className="tier-feats">
                <li>Editorial content access</li>
                <li>Community forum (read)</li>
                <li>Monthly newsletter</li>
                <li>Public events</li>
              </ul>
              <Link href="/account" className="tier-btn tier-btn--pink">Join Now</Link>
            </div>
            <div className="tier reveal d1">
              <div className="tier-name">Inner Circle</div>
              <div className="tier-price">$149 <span>/ month</span></div>
              <ul className="tier-feats">
                <li>Everything in Explorer Member</li>
                <li>Monthly 1:1 coaching</li>
                <li>Private community</li>
                <li>Priority event access</li>
                <li>Exclusive experiences</li>
                <li>Direct coach messaging</li>
              </ul>
              <button className="tier-btn tier-btn--outline">Coming Soon</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
