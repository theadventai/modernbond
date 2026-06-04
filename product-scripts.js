// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Hero image subtle scale on load
window.addEventListener('load', () => {
  const heroBg = document.querySelector('.prod-hero-bg');
  if (heroBg) {
    setTimeout(() => { heroBg.style.transform = 'scale(1)'; }, 100);
  }
});

// Cart handled by Snipcart

// Rewrite "x1" → "Qty: 1" in Snipcart order summary
const rewriteQty = () => {
  document.querySelectorAll('.snipcart-cart-summary-item__quantity').forEach(el => {
    const text = el.textContent.trim();
    const match = text.match(/x(\d+)/i);
    if (match) el.textContent = 'Qty: ' + match[1];
  });
};
// Watch for Snipcart cart DOM changes
const cartObserver = new MutationObserver(rewriteQty);
cartObserver.observe(document.body, { childList: true, subtree: true });
rewriteQty();

// Image gallery — thumbnail swap
document.querySelectorAll('.prod-img-col').forEach(col => {
  const mainImg = col.querySelector('.prod-main-img');
  const thumbs  = col.querySelectorAll('.prod-thumb');
  if (!mainImg || !thumbs.length) return;
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = thumb.src;
        mainImg.style.opacity = '1';
      }, 150);
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
  thumbs[0].classList.add('active');
});
