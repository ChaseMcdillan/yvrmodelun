/* ============================================================
   YVRMUN — Motion
   Scroll reveals, word splits, stat counters, custom cursor
   (dot + delayed ring), hero sway, scenario game, timeline.
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

  /* ---------- WORD SPLIT ---------- */
  document.querySelectorAll('[data-split]').forEach(el => {
    if (prefersReduced) return;
    const text = el.textContent;
    const words = text.split(/\s+/).filter(Boolean);

    el.textContent = '';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'split-word';
      const inner = document.createElement('span');
      inner.className = 'split-word__inner';
      inner.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
      inner.style.animationDelay = `${0.08 + i * 0.1}s`;
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

  /* ---------- SCROLL PROGRESS ---------- */
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

  /* ---------- CUSTOM CURSOR (dot + delayed ring) ---------- */
  if (!prefersReduced
      && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    if (dot && ring) {
      let mx = window.innerWidth / 2;
      let my = window.innerHeight / 2;
      let rx = mx, ry = my;
      let dotX = mx, dotY = my;

      document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
      });

      const loop = () => {
        // Dot follows instantly (slight easing for smoothness)
        dotX += (mx - dotX) * 0.35;
        dotY += (my - dotY) * 0.35;

        // Ring follows with softer, bouncier easing
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;

        dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

        requestAnimationFrame(loop);
      };
      loop();

      // Hover states
      const hoverTargets = document.querySelectorAll(
        'a, button, [data-tilt], .committee-card, .role-card, .preview-card, .contact-card, .mini-card, .scenario__choice'
      );
      hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
          dot.classList.add('is-hover');
          ring.classList.add('is-hover');
        });
        el.addEventListener('mouseleave', () => {
          dot.classList.remove('is-hover');
          ring.classList.remove('is-hover');
        });
      });
    }
  } else {
    // Hide cursor elements on touch devices
    document.querySelectorAll('.cursor-dot, .cursor-ring')
      .forEach(el => el.style.display = 'none');
  }

  /* ---------- HERO SWAY (artwork follows cursor) ---------- */
  const swayEl = document.querySelector('[data-sway]');
  if (swayEl && !prefersReduced
      && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = (e.clientX - cx) / cx;   // -1 … 1
      targetY = (e.clientY - cy) / cy;
    });

    const animate = () => {
      // Eased follow — creates the "delayed, bouncy" feel
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      const rotY = currentX * 12;   // degrees
      const rotX = -currentY * 12;

      swayEl.style.transform =
        `perspective(1200px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(0)`;

      requestAnimationFrame(animate);
    };
    animate();
  }

  /* ---------- TIMELINE PROGRESS ---------- */
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
      btn.addEventListener('click', () => {
        btn.classList.add('is-selected');
        const delta = parseInt(btn.dataset.energy || '0', 10);
        setEnergy(energy + delta);

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

});