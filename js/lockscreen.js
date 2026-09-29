/* ============================================================
   YVRMUN — Lock screen
   Shows once per session. Enter button dismisses with animation.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const lockscreen = document.getElementById('lockscreen');
  if (!lockscreen) return;

  const cfg = window.YVRMUN_CONFIG || {};
  const key = cfg.LOCK_STORAGE_KEY || 'yvrmun-entered';
  const alwaysShow = cfg.LOCK_ALWAYS_SHOW === true;

  // Skip if already entered this session (unless always-show)
  const entered = sessionStorage.getItem(key);
  if (entered && !alwaysShow) {
    lockscreen.remove();
    document.body.classList.remove('has-lockscreen');
    return;
  }

  // Allow ?skip=1 to bypass (useful for testing / deep links)
  const params = new URLSearchParams(window.location.search);
  if (params.get('skip') === '1') {
    sessionStorage.setItem(key, '1');
    lockscreen.remove();
    document.body.classList.remove('has-lockscreen');
    return;
  }

  // Make sure the main content is fully rendered underneath
  document.body.classList.add('has-lockscreen');

  const enterBtn = document.getElementById('enter-room');
  if (!enterBtn) return;

  const exit = () => {
    sessionStorage.setItem(key, '1');
    lockscreen.classList.add('is-exiting');

    // Remove from DOM after the exit animation completes
    const cleanup = () => {
      lockscreen.remove();
      document.body.classList.remove('has-lockscreen');
      // Re-enable scroll
      document.body.style.overflow = '';
      // Focus the header for accessibility
      const header = document.querySelector('.site-header');
      if (header) header.focus?.();
    };

    // Respect reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(cleanup, prefersReduced ? 50 : 900);
  };

  enterBtn.addEventListener('click', exit);

  // Enter key also works
  lockscreen.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') exit();
  });

  // Focus the enter button on load
  setTimeout(() => enterBtn.focus(), 100);

});