'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/products';

const SITE = 'https://joinmodernbond.com';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = PRODUCTS[slug];

  const [mainImg, setMainImg] = useState(product?.cover ?? '');
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} — The Marketplace | Modern Bond`;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [product]);

  if (!product) return notFound();

  function swapTo(src: string) {
    setFading(true);
    setTimeout(() => { setMainImg(src); setFading(false); }, 150);
  }

  return (
    <>
      {/* PRODUCT DETAIL */}
      <section className="prod-detail">
        <div className="prod-detail-bg"></div>
        <div className="tex"></div>
        <div className="prod-detail-inner">
          <div className="prod-detail-grid">

            {/* Image */}
            <div className="prod-img-col reveal">
              <div className="prod-img-wrap">
                <img src={mainImg} alt={product.name} className="prod-main-img" style={{ opacity: fading ? 0 : 1, transition: 'opacity .15s ease' }} />
                <div className="prod-img-glow"></div>
              </div>
              <div className="prod-thumb-strip">
                {product.thumbs.map((t, i) => (
                  <img
                    key={i}
                    src={t}
                    alt=""
                    className={'prod-thumb' + (mainImg === t ? ' active' : '')}
                    onClick={() => swapTo(t)}
                  />
                ))}
              </div>
              <div className="prod-badges">
                {product.badges.map((b, i) => <span key={i} className="prod-badge">{b}</span>)}
              </div>
            </div>

            {/* Info */}
            <div className="prod-info-col">
              <div className="sec-label reveal">The Marketplace</div>
              <h2 className="prod-detail-title reveal d1">{product.titleTop}<br /><span>{product.titleBottom}</span></h2>
              <div className="prod-price-block reveal d2">
                <span className="prod-price-main">{product.priceStr}</span>
                <span className="prod-price-note">{product.priceNote}</span>
              </div>
              <p className="prod-tagline reveal d2">{product.tagline}</p>
              <p className="prod-desc reveal d3">{product.desc}</p>
              <ul className="prod-features reveal d3">
                {product.features.map((f, i) => (
                  <li key={i}><span className="feat-icon">⚡</span><div><strong>{f.title}</strong> {f.body}</div></li>
                ))}
              </ul>
              <div className="prod-ctas reveal d3">
                <button
                  className="snipcart-add-item btn-pink"
                  id={`prod-cta-${product.slug}`}
                  data-item-id={product.slug}
                  data-item-price={product.price.toFixed(2)}
                  data-item-url={`${SITE}/products/${product.slug}`}
                  data-item-name={product.name}
                  data-item-description={product.snipcartDescription}
                  data-item-image={product.cover}
                >
                  Add to Cart — {product.priceStr}
                </button>
                <Link href="/#products" className="btn-outline">Back to Marketplace</Link>
              </div>
              <div className="prod-guarantee reveal d4">
                <span className="guarantee-icon">🔒</span>
                <span>30-day satisfaction guarantee. Private &amp; secure checkout.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY THIS PRODUCT */}
      <section className="prod-why">
        <div className="prod-why-bg"></div>
        <div className="tex"></div>
        <div className="prod-why-inner">
          <div className="sec-label reveal" style={{ justifyContent: 'center' }}>Why It Works</div>
          <h2 className="prod-why-title reveal d1">{product.why.titleTop}<br /><span>{product.why.titleBottom}</span></h2>
          <p className="prod-why-desc reveal d2">{product.why.desc}</p>
          <div className="prod-why-stats">
            {product.why.stats.map((s, i) => (
              <div key={i} className={'why-stat reveal' + (i ? ` d${i}` : '')}>
                <span className="why-stat-n">{s.n}</span>
                <span className="why-stat-l">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section className="prod-related">
        <div className="prod-related-inner">
          <div className="sec-label reveal" style={{ justifyContent: 'center' }}>Also in The Marketplace</div>
          <h2 className="prod-related-title reveal d1">You Might Also <span>Love</span></h2>
          <div className="related-grid">
            {product.related.map((rs, i) => {
              const r = PRODUCTS[rs];
              if (!r) return null;
              return (
                <Link key={rs} href={`/products/${r.slug}`} className={'prod-card reveal' + (i ? ` d${i}` : '')} style={{ textDecoration: 'none' }}>
                  <div className="prod-vis" style={{ background: `url('${r.cover}') center/cover no-repeat` }}></div>
                  <div className="prod-overlay"></div>
                  <div className="prod-info">
                    <div className="prod-cat">{r.category}</div>
                    <div className="prod-name">{r.name}</div>
                    <div className="prod-price">{r.priceStr}</div>
                  </div>
                  <div className="prod-hover"><div className="prod-btn">Shop Now</div></div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
