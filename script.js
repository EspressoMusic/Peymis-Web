/* ============================================
   PEYMIZ — Interactions & Animations
   ============================================ */

// ====== THEME TOGGLE ======
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('peymiz-theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('peymiz-theme');
  if (saved) {
    setTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    setTheme('light');
  } else {
    setTheme('dark');
  }
}

initTheme();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ====== PAGE LOADER ======
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('gone');
    document.body.classList.add('loaded');
  }, 900);
});

// ====== CUSTOM CURSOR ======
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  }
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.18;
  cursorY += (mouseY - cursorY) * 0.18;
  if (cursor) {
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .benefit-card, .price-card, .contact-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursor && cursor.classList.add('grow'));
  el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('grow'));
});

// ====== NAVBAR & SCROLL ======
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const backTop = document.getElementById('backTop');

function onScroll() {
  const sy = window.scrollY;
  if (navbar) {
    navbar.classList.toggle('scrolled', sy > 60);
  }
  if (scrollProgress) {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = Math.min(100, (sy / height) * 100) + '%';
  }
  if (backTop) {
    backTop.classList.toggle('show', sy > 600);
  }
  updateActiveLink();
  heroParallax();
  scrollSections();
  pricingParallax();
}

window.addEventListener('scroll', onScroll, { passive: true });

// ====== ACTIVE LINK ======
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
  const sy = window.scrollY + 120;
  let current = '';
  sections.forEach(s => {
    if (s.offsetTop <= sy && s.offsetTop + s.offsetHeight > sy) {
      current = s.id;
    }
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

// ====== MOBILE MENU ======
const menuToggle = document.getElementById('menuToggle');
const navLinksEl = document.getElementById('navLinks');

if (menuToggle && navLinksEl) {
  menuToggle.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
    menuToggle.classList.toggle('open');
    document.body.classList.toggle('no-scroll', navLinksEl.classList.contains('open'));
  });
  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      menuToggle.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });
  });
  document.addEventListener('click', (e) => {
    if (!navLinksEl.contains(e.target) && !menuToggle.contains(e.target) && navLinksEl.classList.contains('open')) {
      navLinksEl.classList.remove('open');
      menuToggle.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
  });
}

// ====== REVEAL ON SCROLL ======
const revealTypes = ['left', 'right', 'scale', 'rotate', 'blur'];
const reveals = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

reveals.forEach((el, i) => {
  const type = el.getAttribute('data-reveal');
  if (type && revealTypes.includes(type)) {
    el.classList.add('reveal-' + type);
  }
  el.classList.add('delay-' + ((i % 3) + 1));
  observer.observe(el);
});

document.querySelectorAll('.benefit-card').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.08) + 's';
});

document.querySelectorAll('.price-card').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.15) + 's';
});

// ====== HERO PARALLAX ======
const heroLogoWrap = document.getElementById('heroLogoWrap');

function heroParallax() {
  if (!heroLogoWrap) return;
  const sy = window.scrollY;
  if (sy < window.innerHeight) {
    heroLogoWrap.style.transform = `translateY(${sy * 0.14}px) rotate(${sy * -0.012}deg)`;
  }
}

// ====== MOUSE TILT ON HERO LOGO ======
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && heroLogoWrap) {
  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroLogoWrap.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${y * -10}deg) scale(1.02)`;
  });
  heroVisual.addEventListener('mouseleave', () => {
    heroLogoWrap.style.transform = '';
  });
}

function pricingParallax() {
  const pricing = document.querySelector('.pricing-glow');
  const section = document.querySelector('.pricing');
  if (!pricing || !section) return;
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    pricing.style.transform = `translateY(${rect.top * 0.12}px)`;
  }
}

function scrollSections() {
  document.querySelectorAll('[data-scroll-section]').forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top >= window.innerHeight || rect.bottom <= 0) return;
    const shift = Math.max(-24, Math.min(24, rect.top * 0.05));
    section.style.transform = `translateY(${shift}px)`;
  });
}

// ====== 3D TILT ON CARDS ======
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${y * -5}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ====== START PILOT BUTTON ======
const startBtn = document.getElementById('startBtn');
if (startBtn) {
  startBtn.addEventListener('click', () => {
    const pricing = document.getElementById('pricing');
    if (pricing) {
      const y = pricing.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
}

// ====== SMOOTH SCROLL ======
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  });
});

// ====== BACK TO TOP ======
if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ====== SCROLL-TRIGGERED SECTION ANIMATIONS ======
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.product, .pricing').forEach(section => {
  sectionObserver.observe(section);
});

document.querySelectorAll('section').forEach((section, i) => {
  if (i > 0) section.setAttribute('data-scroll-section', '');
});

// ====== INIT ======
onScroll();
