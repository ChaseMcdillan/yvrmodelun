/* ============================================================
   YVRMUN — Staff Application Form
   Validation, word counters, file check, submit to Apps Script,
   success state with reference code, confetti burst.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const form = document.querySelector('[data-feature="staff-form"]');
  if (!form) return;

  const cfg = window.YVRMUN_CONFIG || {};
  const endpoint = cfg.STAFF_APPLY_ENDPOINT || '';
  const maxMb = cfg.MAX_RESUME_MB || 4;
  const maxBytes = maxMb * 1024 * 1024;

  const errorEl = form.querySelector('[data-form-error]');
  const rejectEl = form.querySelector('[data-form-reject]');
  const submitBtn = form.querySelector('[data-form-submit]');
  const successPanel = document.querySelector('[data-form-success]');
  const refEl = document.querySelector('[data-form-ref]');
  const copyBtn = document.querySelector('[data-copy-ref]');

  /* ---------- WORD COUNTERS ---------- */
  form.querySelectorAll('textarea[data-word-limit]').forEach(ta => {
    const limit = parseInt(ta.dataset.wordLimit, 10);
    const counter = ta.parentElement.querySelector('[data-word-counter]');
    if (!counter) return;

    const update = () => {
      const words = ta.value.trim().split(/\s+/).filter(Boolean).length;
      counter.textContent = `${words} / ${limit}`;
      counter.classList.toggle('is-over', words > limit);
    };
    ta.addEventListener('input', update);
    update();
  });

  /* ---------- FILE INPUT VALIDATION ---------- */
  const fileInput = form.querySelector('input[type="file"]');
  const fileHint = form.querySelector('[data-file-hint]');

  if (fileInput && fileHint) {
    fileInput.addEventListener('change', () => {
      const f = fileInput.files?.[0];
      if (!f) {
        fileHint.textContent = `No file selected. Max ${maxMb} MB.`;
        fileHint.classList.remove('is-error');
        return;
      }
      if (f.type !== 'application/pdf') {
        fileHint.textContent = 'File must be a PDF.';
        fileHint.classList.add('is-error');
        fileInput.value = '';
        return;
      }
      if (f.size > maxBytes) {
        fileHint.textContent = `File is ${(f.size / 1024 / 1024).toFixed(1)} MB. Max ${maxMb} MB.`;
        fileHint.classList.add('is-error');
        fileInput.value = '';
        return;
      }
      fileHint.textContent = `${f.name} (${(f.size / 1024).toFixed(0)} KB)`;
      fileHint.classList.remove('is-error');
    });
  }

  /* ---------- AUTO-REJECT WATCH ---------- */
  // If any data-reject-if-no radio named accommodationOk or unpaidOk
  // is set to "No", disable submit.
  const rejectRadios = form.querySelectorAll('[data-reject-if-no]');

  const checkRejects = () => {
    let shouldReject = false;
    rejectRadios.forEach(r => {
      if (r.checked && r.value === 'No') shouldReject = true;
    });
    if (submitBtn) submitBtn.disabled = shouldReject;
    if (rejectEl) rejectEl.hidden = !shouldReject;
  };

  rejectRadios.forEach(r => r.addEventListener('change', checkRejects));
  checkRejects();

  /* ---------- SUBMIT ---------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errorEl) errorEl.hidden = true;

    // Browser validation
    if (!form.checkValidity()) {
      form.reportValidity();
      if (errorEl) errorEl.hidden = false;
      return;
    }

    // Word limit hard check
    let wordLimitBroken = false;
    form.querySelectorAll('textarea[data-word-limit]').forEach(ta => {
      const limit = parseInt(ta.dataset.wordLimit, 10);
      const words = ta.value.trim().split(/\s+/).filter(Boolean).length;
      if (words > limit) wordLimitBroken = true;
    });
    if (wordLimitBroken) {
      if (errorEl) {
        errorEl.textContent = 'One or more responses exceed the word limit.';
        errorEl.hidden = false;
      }
      return;
    }

    // File required
    if (fileInput && !fileInput.files?.[0]) {
      if (errorEl) {
        errorEl.textContent = 'Please attach your resume as a PDF.';
        errorEl.hidden = false;
      }
      return;
    }

    // Build payload
    const fd = new FormData(form);

    // Convert resume to base64 for transport
    const file = fileInput.files[0];
    const b64 = await fileToBase64(file);
    fd.append('resumeBase64', b64);
    fd.append('resumeName', file.name);
    fd.append('resumeType', file.type);
    fd.append('resumeSize', file.size);

    // Collect checkbox group values
    const positions = Array.from(form.querySelectorAll('input[name="positions"]:checked'))
      .map(i => i.value);
    fd.append('positionsList', positions.join('; '));

    // Show loading
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    // Ensure endpoint configured
    if (!endpoint || endpoint.includes('REPLACE_WITH')) {
      console.warn('[YVRMUN] STAFF_APPLY_ENDPOINT is not configured. See js/config.js.');
      // For development, simulate success so the UX can be tested
      await new Promise(r => setTimeout(r, 800));
      handleSuccess('A/YVRMUN/2027/DEV');
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: fd,
        // No headers — Apps Script prefers raw FormData
        redirect: 'follow',
      });

      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch { /* ignore */ }

      if (!res.ok || (data && data.success === false)) {
        throw new Error((data && data.error) || 'Submission failed.');
      }

      const ref = (data && data.reference) || 'A/YVRMUN/2027/---';
      handleSuccess(ref);

    } catch (err) {
      console.error('[YVRMUN] Form submit error:', err);
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      if (errorEl) {
        errorEl.textContent = 'Something went wrong. Please try again or email yvrmun26@gmail.com.';
        errorEl.hidden = false;
      }
    }
  });

  function handleSuccess(reference) {
    if (refEl) refEl.textContent = reference;
    form.hidden = true;
    if (successPanel) successPanel.hidden = false;
    successPanel?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    confettiBurst();

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(reference);
          copyBtn.textContent = 'Copied ✓';
          setTimeout(() => copyBtn.textContent = 'Copy reference code', 2000);
        } catch {
          copyBtn.textContent = 'Select and copy above';
        }
      });
    }
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result).split(',')[1] || '';
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* ---------- CONFETTI (no library) ---------- */
  function confettiBurst() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed; inset: 0; pointer-events: none;
      z-index: 99999; width: 100vw; height: 100vh;
    `;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const W = window.innerWidth;
    const H = window.innerHeight;
    const colors = ['#ff4d2e', '#f2c94c', '#f5f3ee', '#0a0a0a'];
    const pieces = [];

    for (let i = 0; i < 140; i++) {
      pieces.push({
        x: W / 2 + (Math.random() - 0.5) * 200,
        y: H / 2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 14 - 4,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        size: 6 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
      });
    }

    let raf = null;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = 0;

      pieces.forEach(p => {
        p.vy += 0.45;   // gravity
        p.vx *= 0.99;   // drag
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life++;

        if (p.y < H + 40 && p.life < 260) alive++;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      if (alive > 0) raf = requestAnimationFrame(tick);
      else {
        cancelAnimationFrame(raf);
        canvas.remove();
      }
    };
    tick();
  }

});