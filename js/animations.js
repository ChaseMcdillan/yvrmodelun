/* ============================================================
   YVRMUN — Motion
   Scroll reveals, word splitting, stat counters, tilt,
   scroll progress, back-to-top, text scramble, custom cursor.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    if (prefersReduced) {
      revealEls.forEach(el => el.classList.add('is-visible'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

      revealEls.forEach(el => io.observe(el));
    }
  }

  /* ---------- WORD SPLIT (headline reveal) ---------- */
  document.querySelectorAll('[data-split], [data-lock-split]').forEach(el => {
    if (prefersReduced) return;
    const text = el.textContent;
    const words = text.split(/\s+/);

    el.textContent = '';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'split-word';
      const inner = document.createElement('span');
      inner.className = 'split-word__inner';
      inner.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
      inner.style.animationDelay = `${0.05 + i * 0.08}s`;
      span.appendChild(inner);
      el.appendChild(span);
    });
  });

  /* ---------- STAT COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat');
  if (counters.length && !prefersReduced) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count || '0', 10);
        const suffix = el.dataset.suffix || '';
        const valueEl = el.querySelector('.stat__value');
        if (!valueEl) return;

        const duration = 1400;
        const start = performance.now();
        el.classList.add('is-counting');

        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const current = Math.floor(eased * target);
          valueEl.textContent = current + (t === 1 ? suffix : '');
          if (t < 1) requestAnimationFrame(tick);
          else el.classList.remove('is-counting');
        };
        requestAnimationFrame(tick);
        countIO.unobserve(el);
      });
    }, { threshold: 0.4 });

    counters.forEach(el => countIO.observe(el));
  }

  /* ---------- SCROLL PROGRESS BAR ---------- */
  const progressBar = document.querySelector('[data-scroll-progress]');
  if (progressBar) {
    const updateProgress = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const total = h.scrollHeight - h.clientHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  /* ---------- BACK TO TOP ---------- */
  const backBtn = document.querySelector('[data-back-to-top]');
  if (backBtn) {
    const onScroll = () => {
      if (window.scrollY > 400) backBtn.classList.add('is-visible');
      else backBtn.classList.remove('is-visible');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 3D TILT ON HOVER (cards) ---------- */
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      let raf = null;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotX = (0.5 - y) * 8;
        const rotY = (x - 0.5) * 8;

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
        });
      });

      card.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = '';
      });
    });
  }

  /* ---------- TEXT SCRAMBLE ON HOVER ---------- */
  const scrambleChars = '!<>-_\\/[]{}—=+*^?#';
  document.querySelectorAll('[data-scramble]').forEach(el => {
    if (prefersReduced) return;
    const original = el.textContent;

    el.addEventListener('mouseenter', () => {
      let frame = 0;
      const totalFrames = 12;
      const interval = setInterval(() => {
        el.textContent = original
          .split('')
          .map((char, i) => {
            if (char === ' ') return char;
            if (i < (frame / totalFrames) * original.length) return original[i];
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          })
          .join('');
        frame++;
        if (frame > totalFrames) {
          clearInterval(interval);
          el.textContent = original;
        }
      }, 40);
    });
  });

  /* ---------- CUSTOM CURSOR (desktop only) ---------- */
  if (!prefersReduced
      && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();

    document.querySelectorAll('a, button, [data-tilt], .committee-card, .role-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }

  /* ---------- TIMELINE PROGRESS LINE ---------- */
  const tlProgress = document.querySelector('[data-timeline-progress]');
  const tlWrap = document.querySelector('.timeline-wrap');
  if (tlProgress && tlWrap) {
    const updateTimeline = () => {
      const rect = tlWrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh * 0.5;
      const passed = Math.max(0, vh * 0.6 - rect.top);
      const pct = Math.min(100, (passed / total) * 100);
      tlProgress.style.height = pct + '%';
    };
    updateTimeline();
    window.addEventListener('scroll', updateTimeline, { passive: true });
    window.addEventListener('resize', updateTimeline);
  }

  /* ---------- SCENARIO GAME ---------- */
  const scenario = document.querySelector('[data-feature="scenario"]');
  if (scenario) {
    const cards = Array.from(scenario.querySelectorAll('.scenario__card'));
    const result = scenario.querySelector('[data-scenario-result]');
    const idxLabel = scenario.querySelector('[data-scenario-index]');
    const energyLabel = scenario.querySelector('[data-scenario-energy]');
    const fillBar = scenario.querySelector('[data-scenario-fill]');
    const verdict = scenario.querySelector('[data-scenario-verdict]');

    let current = 0;
    let energy = 0;

    const showCard = (i) => {
      cards.forEach((c, idx) => {
        c.hidden = idx !== i;
        c.classList.toggle('is-active', idx === i);
      });
      if (result) result.hidden = true;
      if (idxLabel) idxLabel.textContent = String(i + 1).padStart(2, '0');
    };

    const setEnergy = (val) => {
      energy = Math.min(100, Math.max(0, val));
      if (energyLabel) energyLabel.textContent = String(energy).padStart(2, '0');
      if (fillBar) fillBar.style.width = energy + '%';
    };

    scenario.querySelectorAll('.scenario__choice').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Ripple
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty('--rx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
        btn.style.setProperty('--ry', ((e.clientY - rect.top) / rect.height) * 100 + '%');
        btn.classList.add('is-rippling', 'is-selected');
        setTimeout(() => btn.classList.remove('is-rippling'), 300);

        // Update energy
        const delta = parseInt(btn.dataset.energy || '0', 10);
        setEnergy(energy + delta);

        // Reveal outcome for this card
        const card = btn.closest('.scenario__card');
        const outcome = card.querySelector('.scenario__outcome');
        const choices = card.querySelector('.scenario__choices');
        if (outcome) outcome.hidden = false;
        if (choices) choices.style.pointerEvents = 'none';
      });
    });

    scenario.querySelectorAll('[data-scenario-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        current++;
        if (current < cards.length) showCard(current);
        else if (result) {
          cards.forEach(c => c.hidden = true);
          result.hidden = false;
          if (verdict) {
            verdict.textContent =
              energy > 70 ? 'moves fast.' :
              energy > 40 ? 'moves.' :
                            'holds steady.';
          }
        }
      });
    });

    const resetBtn = scenario.querySelector('[data-scenario-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        current = 0;
        setEnergy(0);
        cards.forEach(c => {
          const oc = c.querySelector('.scenario__outcome');
          const ch = c.querySelector('.scenario__choices');
          if (oc) oc.hidden = true;
          if (ch) ch.style.pointerEvents = '';
          ch?.querySelectorAll('.is-selected').forEach(b => b.classList.remove('is-selected'));
        });
        showCard(0);
      });
    }

    setEnergy(0);
    showCard(0);
  }

  /* ---------- COMMITTEE CARDS (open to modal-style detail) ---------- */
  document.querySelectorAll('.committee-card').forEach(card => {
    const open = () => {
      // Placeholder behavior: scroll to a future detail region
      // For now, we just add a temporary highlight.
      card.classList.add('is-open');
      setTimeout(() => card.classList.remove('is-open'), 600);
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

});