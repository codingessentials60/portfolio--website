/* ============================================================
   CODING ESSENTIALS — script.js
   Interactive Features & Animations
   ============================================================ */

'use strict';

/* ============================================================
   1. NAVBAR — Scroll effect + Mobile toggle
   ============================================================ */
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navLinkEls = document.querySelectorAll('.nav-link');
const navClose = document.getElementById('navClose');

// Scroll → add "scrolled" class
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
  toggleBackTop();
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  // prevent background scrolling when menu is open on mobile
  if (navLinks.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Close nav on link click (mobile)
navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close button (mobile)
if (navClose) {
  navClose.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
}

// Close menu with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Close mobile menu when resizing to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 900 && navLinks.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ============================================================
   2. SMOOTH SCROLLING (handles #hash links)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   3. ACTIVE NAV LINK on scroll
   ============================================================ */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinkEls.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ============================================================
   4. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((el, idx) => {
        if (el === entry.target) delay = idx * 80;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   5. ANIMATED SKILL BARS
   ============================================================ */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const w = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = w + '%'; }, 300);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsGrid = document.querySelector('.skills-grid');
if (skillsGrid) skillObserver.observe(skillsGrid);

/* ============================================================
   6. ANIMATED COUNTERS (Hero stats)
   ============================================================ */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, parseInt(el.getAttribute('data-target'), 10));
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

function animateCounter(el, target) {
  let start = 0;
  const duration = 1800;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start >= target) { el.textContent = target; clearInterval(timer); }
  }, 16);
}

/* ============================================================
   7. PORTFOLIO FILTERING
   ============================================================ */
const filterBtns   = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    portfolioCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const show = filter === 'all' || category === filter;

      if (show) {
        card.classList.remove('hidden');
        // Re-trigger reveal animation
        card.classList.remove('visible');
        requestAnimationFrame(() => {
          setTimeout(() => card.classList.add('visible'), 50);
        });
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ============================================================
   8. TESTIMONIAL SLIDER
   ============================================================ */
const track    = document.getElementById('testimonialTrack');
const prevBtn  = document.getElementById('sliderPrev');
const nextBtn  = document.getElementById('sliderNext');
const dotsEl   = document.getElementById('sliderDots');
const cards    = document.querySelectorAll('.testimonial-card');

if (track && prevBtn && nextBtn && dotsEl && cards.length) {
  let current = 0;
  let autoSlideTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = `dot${i === 0 ? ' active' : ''}`;
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
    resetAutoSlide();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-slide every 5s
  function startAutoSlide() {
    autoSlideTimer = setInterval(() => goTo(current + 1), 5000);
  }
  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }
  startAutoSlide();

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
  });
}

/* ============================================================
   9. DARK / LIGHT MODE TOGGLE
   ============================================================ */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('ce-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('ce-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* ============================================================
   10. CONTACT FORM VALIDATION
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validateForm()) return;

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Form submission failed (${response.status})`);
    }

    contactForm.reset();
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  } catch (error) {
    console.error(error);
    alert('Sorry, there was a problem sending your message. Please try again.');
  } finally {
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    submitBtn.disabled = false;
  }
});

function validateForm() {
  let valid = true;
  const fields = [
    { id: 'name',    errorId: 'nameError',    msg: 'Please enter your name.' },
    { id: 'email',   errorId: 'emailError',   msg: 'Please enter a valid email.', type: 'email' },
    { id: 'project', errorId: 'projectError', msg: 'Please select a project type.' },
    { id: 'message', errorId: 'messageError', msg: 'Please enter a message.' }
  ];

  fields.forEach(f => {
    const el    = document.getElementById(f.id);
    const errEl = document.getElementById(f.errorId);
    let err = '';

    if (!el.value.trim()) {
      err = f.msg;
    } else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
      err = f.msg;
    }

    errEl.textContent = err;
    el.classList.toggle('error', !!err);
    if (err) valid = false;
  });

  return valid;
}

// Real-time field clearing
['name','email','project','message'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', () => {
    el.classList.remove('error');
    document.getElementById(id + 'Error').textContent = '';
  });
});

/* ============================================================
   11. BACK TO TOP BUTTON
   ============================================================ */
const backTop = document.getElementById('backTop');

function toggleBackTop() {
  backTop.classList.toggle('show', window.scrollY > 400);
}

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   12. HERO — Subtle parallax on mouse move
   ============================================================ */
const hero = document.querySelector('.hero');
if (hero) {
  document.addEventListener('mousemove', e => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xPct = (clientX / innerWidth  - 0.5) * 20;
    const yPct = (clientY / innerHeight - 0.5) * 20;
    const orbs = hero.querySelectorAll('.orb');
    orbs[0]?.style.setProperty('transform', `translate(${xPct * 0.5}px, ${yPct * 0.5}px) scale(1)`);
    orbs[1]?.style.setProperty('transform', `translate(${-xPct * 0.3}px, ${-yPct * 0.3}px) scale(1)`);
  });
}

/* ============================================================
   13. SERVICE CARD — Icon color cycling on hover
   ============================================================ */
const serviceIcons = document.querySelectorAll('.service-icon-wrap');
const iconColors   = ['var(--blue-light)', 'var(--orange-light)', '#a78bfa', '#34d399'];

serviceIcons.forEach((icon, i) => {
  const base = iconColors[i % iconColors.length];
  icon.style.setProperty('--icon-color', base);
});

/* ============================================================
   14. TYPING EFFECT in hero badge (optional polish)
   ============================================================ */
(function() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;
  const texts = ['Available for new projects', 'Open to collaborations', 'Let\'s build something great'];
  let tIdx = 0, cIdx = 0, isDeleting = false;
  const textSpan = document.createElement('span');
  textSpan.className = 'typed-text';

  // Replace static text after badge dot
  const dot = badge.querySelector('.badge-dot');
  badge.innerHTML = '';
  badge.appendChild(dot);
  badge.appendChild(document.createTextNode(' '));
  badge.appendChild(textSpan);

  function type() {
    const current = texts[tIdx];
    textSpan.textContent = isDeleting
      ? current.substring(0, cIdx--)
      : current.substring(0, cIdx++);

    let delay = isDeleting ? 40 : 80;
    if (!isDeleting && cIdx === current.length + 1) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && cIdx === 0) {
      isDeleting = false;
      tIdx = (tIdx + 1) % texts.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  type();
})();

/* ============================================================
   15. PROCESS STEPS — animate on scroll
   ============================================================ */
const processSteps = document.querySelectorAll('.process-step');
const processObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 150);
      processObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

processSteps.forEach(step => {
  step.style.opacity = '0';
  step.style.transform = 'translateY(30px)';
  step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  processObs.observe(step);
});

/* ============================================================
   INIT — Trigger visible for already-in-view elements
   ============================================================ */
window.addEventListener('load', () => {
  // Small delay so transitions play nicely
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add('visible');
      }
    });
    // Skill bars already in view
    if (skillsGrid) {
      const rect = skillsGrid.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        skillsGrid.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.getAttribute('data-width') + '%';
        });
      }
    }
  }, 200);
});
