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

// Add to cart button pulse on click
document.querySelectorAll('[id^="prod-cta"]').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    this.textContent = '✓ Added!';
    this.style.background = '#2e0d48';
    setTimeout(() => {
      this.textContent = this.dataset.orig || this.textContent;
      window.location.href = 'index.html#join';
    }, 1000);
  });
  btn.dataset.orig = btn.textContent;
});
