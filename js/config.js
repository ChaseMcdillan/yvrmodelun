/* ============================================================
   YVRMUN — Site Configuration
   Editable values. No logic lives here.
   ============================================================ */

window.YVRMUN_CONFIG = {

  /* --------------------------------------------------------
     STAFF APPLICATION ENDPOINT
     After deploying the Google Apps Script (see
     docs/apps-script-setup.md), paste the Web App URL here.
     The URL looks like:
     https://script.google.com/macros/s/AKfy.../exec
     -------------------------------------------------------- */
  STAFF_APPLY_ENDPOINT: 'https://script.google.com/macros/s/AKfycbxtN6m9vAY65xEPQcied5i6S2ZZYaXcVNRMtZN8nipP-38OTIPW1mrnZqZ4JKc6vFrqzA/exec',

  /* --------------------------------------------------------
     LOCK SCREEN
     -------------------------------------------------------- */
  // Key used in sessionStorage so the lock screen only
  // appears once per browser session.
  LOCK_STORAGE_KEY: 'yvrmun-entered',

  // Set to true to always show the lock screen (useful while
  // developing). Set to false for production.
  LOCK_ALWAYS_SHOW: false,

  /* --------------------------------------------------------
     FORM LIMITS
     -------------------------------------------------------- */
  MAX_RESUME_MB: 4,

  /* --------------------------------------------------------
     MISC
     -------------------------------------------------------- */
  // Reduced-motion detection is automatic; no need to configure.
};