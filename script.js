// ── MOUSE GLOW ──────────────────────────────────────────────
const glow = document.getElementById('mouseGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// ── PARTICLES ────────────────────────────────────────────────
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let W, H, dots = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function randBetween(a, b) { return a + Math.random() * (b - a); }

for (let i = 0; i < 55; i++) {
  dots.push({
    x: randBetween(0, W), y: randBetween(0, H),
    r: randBetween(0.6, 1.6),
    vx: randBetween(-0.18, 0.18), vy: randBetween(-0.18, 0.18),
    alpha: randBetween(0.2, 0.6)
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  dots.forEach(d => {
    d.x += d.vx; d.y += d.vy;
    if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
    if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(91,156,246,${d.alpha})`;
    ctx.fill();
  });
  // draw lines between close dots
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.strokeStyle = `rgba(91,156,246,${0.08 * (1 - dist/120)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── NAV SCROLL ───────────────────────────────────────────────
const navbar   = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  backToTop.classList.toggle('show', window.scrollY > 400);
  highlightNav();
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── HAMBURGER ────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  navLinks.classList.contains('open')
    ? (spans[0].style.transform = 'rotate(45deg) translate(5px,5px)',
       spans[1].style.opacity = '0',
       spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)')
    : (spans[0].style.transform = '', spans[1].style.opacity = '', spans[2].style.transform = '');
});

navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => (s.style.transform = '', s.style.opacity = ''));
}));

// ── ACTIVE NAV ───────────────────────────────────────────────
function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 120;
  sections.forEach(sec => {
    const id   = sec.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight);
  });
}

// ── TYPING ANIMATION ─────────────────────────────────────────
const phrases = [
  'Data Engineering Enthusiast',
  'Generative AI Explorer',
  'MERN Stack Developer',
  'Cloud Computing Learner',
  'Machine Learning Developer'
];
let pIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const current = phrases[pIdx];
  typedEl.textContent = deleting ? current.slice(0, --cIdx) : current.slice(0, ++cIdx);
  if (!deleting && cIdx === current.length) { deleting = true; return setTimeout(type, 1800); }
  if (deleting && cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  setTimeout(type, deleting ? 45 : 85);
}
type();

const cursor = document.createElement('span');
cursor.className = 'typed-cursor'; cursor.textContent = '|';
typedEl.insertAdjacentElement('afterend', cursor);

// ── SCROLL REVEAL ────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── COUNTER ANIMATION ────────────────────────────────────────
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1600;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.hc-num').forEach(animateCounter);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const counters = document.querySelector('.hero-counters');
if (counters) counterObs.observe(counters);

// ── SKILL BAR ANIMATION ──────────────────────────────────────
const barObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.sb-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const barGrid = document.querySelector('.skill-bars-grid');
if (barGrid) barObs.observe(barGrid);

// ── CONTACT FORM ─────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    success.style.display = 'block';
    this.reset();
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      success.style.display = 'none';
    }, 3500);
  }, 1500);
});

// ── SMOOTH SCROLL ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

// ── SKILL CARD TILT ──────────────────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    card.style.transform = `translateY(-10px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
