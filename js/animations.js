/* ============================================================
   YVRMUN — Motion
   Reveals, splits, counters, cursor, sway, room selector,
   quotes ticker, live clock, countdown, scroll header.
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

  /* ---------- STAT COUNTERS (any [data-count]) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && !prefersReduced) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count || '0', 10);
        const suffix = el.dataset.suffix || '';

        // find the element that displays the number
        const valueEl = el.querySelector('.stat__value')
                     || el.querySelector('.dash-tile__value')
                     || el.querySelector('.staff-cta__number')
                     || el;
        const parent = valueEl.closest('.stat, .dash-tile, .staff-cta__big') || valueEl;

        const duration = 1400;
        const start = performance.now();
        parent.classList.add('is-counting');

        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const current = Math.floor(eased * target);
          valueEl.textContent = current + (t === 1 ? suffix : '');
          if (t < 1) requestAnimationFrame(tick);
          else parent.classList.remove('is-counting');
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

  /* ---------- HEADER HIDE-ON-SCROLL-DOWN ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 8) {
        if (y > lastY && y > 200) header.classList.add('is-hidden');
        else header.classList.remove('is-hidden');
        lastY = y;
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- NAV SLIDING PILL ---------- */
  const nav = document.querySelector('.site-header__nav');
  const pill = document.querySelector('.site-header__nav-pill');
  const navLinks = nav ? Array.from(nav.querySelectorAll('a')) : [];

  if (nav && pill && navLinks.length && !prefersReduced) {
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const navRect = nav.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        pill.style.width = linkRect.width + 'px';
        pill.style.transform = `translateX(${linkRect.left - navRect.left - 4}px)`;
        nav.classList.add('is-hover');
      });
    });
    nav.addEventListener('mouseleave', () => {
      nav.classList.remove('is-hover');
    });
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

  /* ---------- CUSTOM CURSOR ---------- */
  if (!prefersReduced
      && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    const corners = document.querySelector('.cursor-corners');

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
        dotX += (mx - dotX) * 0.35;
        dotY += (my - dotY) * 0.35;
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;

        dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

        if (corners) {
          corners.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        }
        requestAnimationFrame(loop);
      };
      loop();

      const hoverTargets = document.querySelectorAll(
        'a, button, [data-tilt], .room-list__item, .staff-role, .quote, .dash-tile'
      );
      hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
          dot.classList.add('is-hover');
          ring.classList.add('is-hover');
          corners?.classList.add('is-hover');
        });
        el.addEventListener('mouseleave', () => {
          dot.classList.remove('is-hover');
          ring.classList.remove('is-hover');
          corners?.classList.remove('is-hover');
        });
      });
    }
  } else {
    document.querySelectorAll('.cursor-dot, .cursor-ring, .cursor-corners')
      .forEach(el => el.style.display = 'none');
  }

  /* ---------- HERO SWAY ---------- */
  const swayEl = document.querySelector('[data-sway]');
  if (swayEl && !prefersReduced
      && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = (e.clientX - cx) / cx;
      targetY = (e.clientY - cy) / cy;
    });

    const animate = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      const rotY = currentX * 12;
      const rotX = -currentY * 12;

      swayEl.style.transform =
        `translateY(-50%) perspective(1200px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;

      requestAnimationFrame(animate);
    };
    animate();
  }

  /* ---------- ROOM SELECTOR ---------- */
  const roomSelector = document.querySelector('[data-feature="room-selector"]');
  if (roomSelector) {
    const items = roomSelector.querySelectorAll('.room-list__item');
    const codeEl = roomSelector.querySelector('[data-room-code]');
    const titleEl = roomSelector.querySelector('[data-room-title]');
    const descEl = roomSelector.querySelector('[data-room-desc]');

    const rooms = {
      '01': {
        code: 'A/YVRMUN/2027/01',
        title: 'Security Council',
        desc: 'Fast-moving crisis committee with directives, veto politics, closed sessions, and consequences that arrive before you have finished arguing about the last one.'
      },
      '02': {
        code: 'A/YVRMUN/2027/02',
        title: 'Committee 02',
        desc: 'Replace this placeholder with the real committee description before launch.'
      },
      '03': {
        code: 'A/YVRMUN/2027/03',
        title: 'Committee 03',
        desc: 'Replace this placeholder with the real committee description before launch.'
      },
      '04': {
        code: 'A/YVRMUN/2027/04',
        title: 'Committee 04',
        desc: 'Replace this placeholder with the real committee description before launch.'
      },
      '05': {
        code: 'A/YVRMUN/2027/05',
        title: 'Committee 05',
        desc: 'Replace this placeholder with the real committee description before launch.'
      },
      '06': {
        code: 'A/YVRMUN/2027/06',
        title: 'Committee 06',
        desc: 'Replace this placeholder with the real committee description before launch.'
      }
    };

    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('is-active'));
        item.classList.add('is-active');
        const data = rooms[item.dataset.room];
        if (!data) return;
        if (codeEl) codeEl.textContent = data.code;
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
      });
    });
  }

  /* ---------- LIVE CLOCK (footer) ---------- */
  const clockEl = document.querySelector('[data-clock]');
  if (clockEl) {
    const updateClock = () => {
      try {
        const now = new Date();
        const opts = {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'America/Vancouver'
        };
        const time = new Intl.DateTimeFormat('en-CA', opts).format(now);
        clockEl.textContent = `${time} PT`;
      } catch {
        clockEl.textContent = 'Richmond time';
      }
    };
    updateClock();
    setInterval(updateClock, 30000);
  }

  /* ---------- COUNTDOWN (lock screen) ---------- */
  const countdown = document.querySelector('[data-countdown]');
  if (countdown) {
    const daysEl = document.querySelector('[data-countdown-days]');
    const hoursEl = document.querySelector('[data-countdown-hours]');
    const minsEl = document.querySelector('[data-countdown-minutes]');
    const secsEl = document.querySelector('[data-countdown-seconds]');

    // Conference date: April 1, 2027 (placeholder — update when confirmed)
    const target = new Date('2027-04-01T08:30:00-08:00').getTime();

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      if (daysEl) daysEl.textContent = String(days).padStart(3, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
    };
    tick();
    setInterval(tick, 1000);
  }

});