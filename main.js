/* ================================================================
   MMC GROUP — Main JavaScript + AI Chatbot
   Version 2.0 | Adani-Inspired Corporate Website
================================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── PRELOADER ──────────────────────────────────────────── */
  const pre = document.getElementById('preloader');
  window.addEventListener('load', () => setTimeout(() => pre.classList.add('out'), 2000));

  /* ── NAVBAR SCROLL ──────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('solid', window.scrollY > 60);
    scrollTopBtn.classList.toggle('vis', window.scrollY > 500);
    highlightNav();
  }, { passive: true });
  scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── SMOOTH SCROLL ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const collapse = document.querySelector('.navbar-collapse.show');
      if (collapse) bootstrap.Collapse.getInstance(collapse)?.hide();
    });
  });

  /* ── ACTIVE NAV ─────────────────────────────────────────── */
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
  function highlightNav() {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    navLinks.forEach(a => {
      const href = a.getAttribute('href').slice(1);
      a.classList.toggle('active-nav', href === cur);
    });
  }

  /* ── FADE-UP OBSERVER ───────────────────────────────────── */
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
      el.textContent = isFloat ? val.toFixed(1) + suffix : Math.floor(val).toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
    })(performance.now());
  }
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animCounter(e.target); cObs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => cObs.observe(el));

  /* ── PARTICLE CANVAS ────────────────────────────────────── */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    class P {
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.r = Math.random() * 1.5 + .5;
        this.vx = (Math.random() - .5) * .3;
        this.vy = (Math.random() - .5) * .3;
        this.a = Math.random() * .5 + .2;
        const cols = ['rgba(0,87,168,', 'rgba(0,170,205,', 'rgba(232,160,32,', 'rgba(93,185,54,'];
        this.c = cols[Math.floor(Math.random() * cols.length)] + this.a + ')';
      }
      constructor() { this.reset(); }
      move() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = this.c; ctx.fill(); }
    }
    const init = () => { particles = Array.from({ length: 100 }, () => new P()); };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.move(); p.draw(); });
      particles.forEach((a, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = a.x - particles[j].x, dy = a.y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,87,168,${.05 * (1 - d / 90)})`;
            ctx.lineWidth = .5;
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

  /* ── JOURNEY SLIDER ─────────────────────────────────────── */
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
      jDotNav.appendChild(d);
    });
    const jUpdate = i => {
      jDotNav.querySelectorAll('.j-ndot2').forEach((d, j) => d.classList.toggle('jact', j === i));
      jSpine.style.width = ((i + 1) / jItems.length * 100) + '%';
      jItems.forEach((item, j) => item.classList.toggle('jactive', j === i));
    };
    const jGo = i => {
      jCur = Math.max(0, Math.min(i, jItems.length - 1));
      jScroll.scrollTo({ left: jItems[jCur].offsetLeft - 40, behavior: 'smooth' });
      jUpdate(jCur);
    };
    document.getElementById('jPrev').onclick = () => jGo(jCur - 1);
    document.getElementById('jNext').onclick = () => jGo(jCur + 1);
    let drag = false, sx, sl;
    jScroll.addEventListener('mousedown', e => { drag = true; jScroll.classList.add('grabbing'); sx = e.pageX; sl = jScroll.scrollLeft; });
    jScroll.addEventListener('mouseleave', () => { drag = false; jScroll.classList.remove('grabbing'); });
    jScroll.addEventListener('mouseup', () => { drag = false; jScroll.classList.remove('grabbing'); });
    jScroll.addEventListener('mousemove', e => { if (!drag) return; jScroll.scrollLeft = sl - (e.pageX - sx) * 1.4; });
    jScroll.addEventListener('scroll', () => {
      const mid = jScroll.scrollLeft + jScroll.offsetWidth / 2;
      let cl = 0, md = Infinity;
      jItems.forEach((item, i) => { const d = Math.abs(item.offsetLeft + item.offsetWidth / 2 - mid); if (d < md) { md = d; cl = i; } });
      if (cl !== jCur) { jCur = cl; jUpdate(jCur); }
    }, { passive: true });
    jUpdate(0);
  }

  /* ── CONTACT FORM ───────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const orig = btn.textContent;
      btn.textContent = 'Sending…'; btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg,#5DB936,#00AACD)';
        form.reset();
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; }, 3500);
      }, 1600);
    });
  }

  /* ================================================================
     AI CHATBOT — Powered by Anthropic API
     MMC Group Virtual Assistant
  ================================================================ */
  const chatToggle  = document.getElementById('chat-toggle');
  const chatWindow  = document.getElementById('chat-window');
  const chatClose   = document.getElementById('chat-close');
  const chatMsgs    = document.getElementById('chat-msgs');
  const chatInput   = document.getElementById('chat-input');
  const chatSend    = document.getElementById('chat-send');
  const quickChips  = document.querySelectorAll('.q-chip');

  let chatOpen = false;
  let chatHistory = [];
  let isTyping = false;

  const SYSTEM_PROMPT = `You are Aria, the official AI assistant of MMC Group — a prestigious, diversified conglomerate headquartered in Kerala, India. MMC Group's tagline is "Growing With Trust."

MMC Group operates across 8 sectors:
1. MMC Infrastructure — Roads, bridges, civil construction
2. MMC Real Estate — Premium residential and commercial developments
3. MMC Healthcare — Multi-specialty hospitals and diagnostic centres
4. MMC Technologies — AI software, cloud, IT solutions
5. MMC Education — Schools, colleges, skill institutes
6. MMC Hospitality — Luxury resorts and boutique hotels
7. MMC Financial Services — Lending, microfinance, wealth management
8. MMC Trading & Commerce — Import-export, FMCG, construction materials

Key facts:
- Founded: 2001 in Kerala, India
- Employees: 5,000+
- Annual Turnover: ₹500 Crore+
- Projects completed: 250+
- States of presence: 12+
- Contact: info@mmcgroup.in | +91 484 000 0000

You are helpful, professional, warm and concise. When asked about careers, investments, partnerships or specific details you don't know, politely invite them to contact the team at info@mmcgroup.in. Keep responses under 120 words unless a detailed question is asked. Always be positive and reflect the group's values of trust, integrity and excellence.`;

  function toggleChat() {
    chatOpen = !chatOpen;
    chatWindow.classList.toggle('open', chatOpen);
    chatToggle.innerHTML = chatOpen ? '✕' : '💬';
    if (chatOpen && chatMsgs.children.length === 0) addWelcome();
  }

  chatToggle.addEventListener('click', toggleChat);
  chatClose.addEventListener('click', toggleChat);

  function addWelcome() {
    appendMsg('bot', `👋 Hello! I'm **Aria**, MMC Group's virtual assistant. I'm here to help you learn about our businesses, partnerships, careers, and more.\n\nHow can I assist you today?`, true);
  }

  function appendMsg(role, text, animate = true) {
    const div = document.createElement('div');
    div.className = `msg msg-${role === 'bot' ? 'bot' : 'user'}`;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    div.innerHTML = `
      <div class="msg-bubble">${formatText(text)}</div>
      <div class="msg-time">${now}</div>
    `;
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function formatText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'msg msg-bot';
    div.id = 'typing-msg';
    div.innerHTML = `<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('typing-msg');
    if (t) t.remove();
  }

  async function sendMessage(userText) {
    if (!userText.trim() || isTyping) return;
    isTyping = true;
    chatInput.value = '';
    chatInput.style.height = 'auto';

    appendMsg('user', userText);
    chatHistory.push({ role: 'user', content: userText });
    showTyping();

    // Disable quick chips while responding
    quickChips.forEach(c => c.style.opacity = '.4');

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': window.MMC_API_KEY || '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 400,
          system: SYSTEM_PROMPT,
          messages: chatHistory
        })
      });

      const data = await res.json();
      removeTyping();

      if (data.content && data.content[0]) {
        const reply = data.content[0].text;
        chatHistory.push({ role: 'assistant', content: reply });
        appendMsg('bot', reply);
      } else if (data.error) {
        appendMsg('bot', '⚠️ I need an API key to respond. Please add your Anthropic API key to `config.js`. For now, contact us at **info@mmcgroup.in**');
      }
    } catch (err) {
      removeTyping();
      appendMsg('bot', '🌐 Connection issue. Please try again or reach us at **info@mmcgroup.in** | **+91 484 000 0000**');
    } finally {
      isTyping = false;
      quickChips.forEach(c => c.style.opacity = '1');
    }
  }

  // Send button
  chatSend.addEventListener('click', () => sendMessage(chatInput.value));

  // Enter to send (shift+enter for newline)
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(chatInput.value); }
  });

  // Auto-resize input
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 80) + 'px';
  });

  // Quick chips
  quickChips.forEach(chip => {
    chip.addEventListener('click', () => sendMessage(chip.dataset.msg));
  });

  // Spawn particles (add once on DOMContentLoaded)
const container = document.getElementById('preParticles');
for (let i = 0; i < 20; i++) {
  const p = document.createElement('div');
  p.className = 'pre-particle';
  p.style.cssText = `left:${Math.random()*100}%;top:${60+Math.random()*40}%;--d:${4+Math.random()*5}s;--delay:${Math.random()*4}s;background:${Math.random()>.5?'var(--blue)':'var(--gold)'}`;
  container.appendChild(p);
}

// Percentage counter
const pctEl = document.getElementById('prePct');
let start = null;
function animatePct(ts) {
  if (!start) start = ts;
  const p = Math.min((ts - start) / 2400 * 100, 100);
  pctEl.textContent = Math.min(Math.round(p), 100) + '%';
  if (p < 100) requestAnimationFrame(animatePct);
}
requestAnimationFrame(animatePct);

// Your existing hide code stays as-is:
// document.getElementById('preloader').classList.add('out');



});
