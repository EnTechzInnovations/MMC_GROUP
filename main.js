/* ================================================================
   MMC GROUP 
================================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── PRELOADER ──────────────────────────────────────────── */
  const pre = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (pre) pre.classList.add('out');
    }, 2000);
  });

  /* ── SPAWN PRELOADER PARTICLES ──────────────────────────── */
  const container = document.getElementById('preParticles');
  if (container) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'pre-particle';
      p.style.cssText = `
        left:${Math.random() * 100}%;
        top:${60 + Math.random() * 40}%;
        --d:${4 + Math.random() * 5}s;
        --delay:${Math.random() * 4}s;
        background:${Math.random() > 0.5 ? 'var(--blue)' : 'var(--gold)'}
      `;
      container.appendChild(p);
    }
  }

  /* ── PRELOADER PERCENTAGE COUNTER (only if element exists) ─ */
  const pctEl = document.getElementById('prePct');
  if (pctEl) {
    let start = null;
    function animatePct(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 2400 * 100, 100);
      pctEl.textContent = Math.min(Math.round(p), 100) + '%';
      if (p < 100) requestAnimationFrame(animatePct);
    }
    requestAnimationFrame(animatePct);
  }

  /* ── NAVBAR SCROLL ──────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('solid', window.scrollY > 60);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('vis', window.scrollY > 500);
    highlightNav();
  }, { passive: true });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── SMOOTH SCROLL ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const collapse = document.querySelector('.navbar-collapse.show');
      if (collapse) bootstrap.Collapse.getInstance(collapse)?.hide();
    });
  });

  /* ── ACTIVE NAV HIGHLIGHT ───────────────────────────────── */
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];

  function highlightNav() {
    let cur = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) cur = s.id;
    });
    navLinks.forEach(a => {
      const href = a.getAttribute('href').slice(1);
      a.classList.toggle('active-nav', href === cur);
    });
  }

  /* ── FADE-UP ON SCROLL ──────────────────────────────────── */
  const fuObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('vis'), i * 80);
        fuObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fu').forEach(el => fuObs.observe(el));

  /* ── COUNTER ANIMATION ──────────────────────────────────── */
  function animCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isFloat = el.dataset.float === '1';
    const dur = 2000;
    const start = performance.now();
    (function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const val = target * ease;
      el.textContent = isFloat
        ? val.toFixed(1) + suffix
        : Math.floor(val).toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animCounter(e.target);
        cObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => cObs.observe(el));

  /* ── HERO PARTICLE CANVAS (if canvas exists) ────────────── */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    class P {
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.r = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.a = Math.random() * 0.5 + 0.2;
        const cols = [
          'rgba(0,87,168,',
          'rgba(0,170,205,',
          'rgba(232,160,32,',
          'rgba(93,185,54,'
        ];
        this.c = cols[Math.floor(Math.random() * cols.length)] + this.a + ')';
      }
      constructor() { this.reset(); }
      move() {
        this.x += this.vx;
        this.y += this.vy;
        if (
          this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height
        ) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.c;
        ctx.fill();
      }
    }

    const init = () => {
      particles = Array.from({ length: 100 }, () => new P());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.move(); p.draw(); });
      particles.forEach((a, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = a.x - particles[j].x;
          const dy = a.y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,87,168,${0.05 * (1 - d / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    resize(); init(); animate();
    window.addEventListener('resize', () => { resize(); init(); });
  }

  /* ── JOURNEY SLIDER (only if element exists) ────────────── */
  const jScroll = document.getElementById('jScroll');
  if (jScroll) {
    const jItems = jScroll.querySelectorAll('.j-item');
    const jDotNav = document.getElementById('jDotNav');
    const jSpine = document.getElementById('jSpineFill');
    let jCur = 0;

    jItems.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'j-ndot2' + (i === 0 ? ' jact' : '');
      d.onclick = () => jGo(i);
      if (jDotNav) jDotNav.appendChild(d);
    });

    const jUpdate = i => {
      if (jDotNav) {
        jDotNav.querySelectorAll('.j-ndot2').forEach((d, j) => {
          d.classList.toggle('jact', j === i);
        });
      }
      if (jSpine) jSpine.style.width = ((i + 1) / jItems.length * 100) + '%';
      jItems.forEach((item, j) => item.classList.toggle('jactive', j === i));
    };

    const jGo = i => {
      jCur = Math.max(0, Math.min(i, jItems.length - 1));
      jScroll.scrollTo({ left: jItems[jCur].offsetLeft - 40, behavior: 'smooth' });
      jUpdate(jCur);
    };

    const jPrev = document.getElementById('jPrev');
    const jNext = document.getElementById('jNext');
    if (jPrev) jPrev.onclick = () => jGo(jCur - 1);
    if (jNext) jNext.onclick = () => jGo(jCur + 1);

    let drag = false, sx, sl;
    jScroll.addEventListener('mousedown', e => {
      drag = true;
      jScroll.classList.add('grabbing');
      sx = e.pageX;
      sl = jScroll.scrollLeft;
    });
    jScroll.addEventListener('mouseleave', () => {
      drag = false;
      jScroll.classList.remove('grabbing');
    });
    jScroll.addEventListener('mouseup', () => {
      drag = false;
      jScroll.classList.remove('grabbing');
    });
    jScroll.addEventListener('mousemove', e => {
      if (!drag) return;
      jScroll.scrollLeft = sl - (e.pageX - sx) * 1.4;
    });
    jScroll.addEventListener('scroll', () => {
      const mid = jScroll.scrollLeft + jScroll.offsetWidth / 2;
      let cl = 0, md = Infinity;
      jItems.forEach((item, i) => {
        const d = Math.abs(item.offsetLeft + item.offsetWidth / 2 - mid);
        if (d < md) { md = d; cl = i; }
      });
      if (cl !== jCur) { jCur = cl; jUpdate(jCur); }
    }, { passive: true });

    jUpdate(0);
  }

  /* ── CONTACT FORM — Formspree ready ────────────────────── */
  /* Replace YOUR_FORM_ID below with your Formspree endpoint  */
  /* Sign up free at formspree.io to get an endpoint ID       */
  const FORMSPREE_ID = 'YOUR_FORM_ID';

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const origText = btn.textContent;

      btn.textContent = 'Sending…';
      btn.disabled = true;

      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });

        if (res.ok) {
          btn.textContent = '✓ Message Sent!';
          btn.style.background = '#5DB936';
          btn.style.color = '#fff';
          form.reset();
          setTimeout(() => {
            btn.textContent = origText;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
          }, 4000);
        } else {
          throw new Error('Server error');
        }
      } catch {
        btn.textContent = '✗ Failed — try info@mmcgroup.in';
        btn.style.background = '#E31E52';
        btn.style.color = '#fff';
        setTimeout(() => {
          btn.textContent = origText;
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 4000);
      }
    });
  }

  /* ── HERO CAROUSEL ──────────────────────────────────────── */
  const INTERVAL = 5000;
  const slides = document.querySelectorAll('.hero-carousel-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let current = 0, timer;

  function goTo(n) {
    if (!slides.length) return;
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function startCarousel() {
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  if (slides.length) {
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(timer);
        goTo(+dot.dataset.index);
        startCarousel();
      });
    });
    startCarousel();
  }

});