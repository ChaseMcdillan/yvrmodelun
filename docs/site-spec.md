# YVRMUN Website — Build Specification

## Project
Rebuild of the YVRMUN conference website.
Existing site: https://yvrmun.netlify.app
Goal: multi-page, animation-rich, handoff-friendly rebuild.

## Conference Facts (verbatim — do not alter)
- Organization: Vancouver Youth Model United Nations (YVRMUN)
- Session: Session II / 2027
- Location: Richmond, British Columbia (Metro Vancouver)
- Timeframe: April 2027
- Tagline: "MAKE THE room." / "ENTER THE ROOM."
- Founded: 2005
- Committees: 6
- Delegates: 300+
- Staff positions: 40
- Notification email: yvrmun26@gmail.com

## Names & Spellings (enforce in all copy)
- YVRMUN  (all caps)
- Chase McDillan  (capital M, capital D — NOT "McMillan")
- YVRMUN Session II / 2027

## Tech Stack
- HTML5, custom CSS3 (variables), vanilla JS
- Static host: Vercel
- Form backend: Google Apps Script → Gmail + Sheets
- No frameworks, no build tools, no npm

## Page Structure
| File | Purpose |
|------|---------|
| index.html | Lock screen → landing |
| about.html | Why This Exists + The Setting |
| committees.html | Six committees (interactive) |
| scenario.html | Test Your Instincts (interactive game) |
| schedule.html | Weekend timeline |
| staff.html | Staff roles + application form |
| faq.html | FAQ accordion |
| contact.html | Contact info |
| credits.html | Full copyright & asset credits |

## Lock Screen Behavior
- Full viewport, plain near-black background
- Small monospace label: YVRMUN / SESSION II / 2027
- Huge headline: ENTER THE ROOM.
- Description (inspiring copy)
- Single button: ENTER →
- Shows once per browser session (sessionStorage key: yvrmun-entered)
- Skip via ?skip=1 query param (for testing)
- Respects prefers-reduced-motion

## Animations (all enabled — "showy" mode)
- Lock screen word-stagger reveal
- Lock screen exit: scale up + blur + fade
- Page transitions between inner pages
- Shrinking sticky header with blur backdrop
- Scroll progress bar (top of every page)
- Custom cursor ring (desktop only, additive — native cursor still visible)
- Hero word-stagger on page load
- Marquee (pauses on hover)
- Stat counters (count up on view)
- Section labels/titles fade + slide on scroll
- Scroll-triggered reveal on all cards & timeline items
- Committee cards: 3D tilt + glow + modal expand
- Scenario game: animated room-energy meter, ripple buttons, spring easing
- Role cards: smooth height expand
- Form: floating labels, shake on error, confetti on success
- FAQ: smooth height accordion
- Back-to-top button (fades in after 400px, spins on click)
- Button press-down + glow
- Link underline draw-in on hover
- Grain overlay (subtle, CSS-only)
- Animated gradient orbs on dark sections
- Text scramble on hover for section labels

Every animation behind prefers-reduced-motion: no-preference or has a fallback.

## Staff Application Form
- Endpoint configured in js/config.js (STAFF_APPLY_ENDPOINT)
- 15 fields (see docs/apps-script-setup.md for full field map)
- Client-side validation + word counters on textareas
- PDF resume upload, 4 MB cap (client-side check)
- Auto-reject: disable submit if accommodation=No or unpaid=No
- Success: reference code + copy button + confetti
- Submits JSON to Apps Script → Gmail + Sheets

## Design System
- Palette:
  - --ink: #0a0a0a (near-black)
  - --paper: #f5f3ee (off-white)
  - --accent: #ff4d2e (bright coral — energetic)
  - --accent-2: #f2c94c (warm gold)
  - --muted: #8a8a8a
- Typography: system stack (no external fonts)
- Type scale: fluid via clamp()
- Section labels: monospace, small caps, tracked

## Footer (every page)
© 2027 Vancouver Youth Model United Nations.
All rights reserved except where otherwise noted.
Certain visual assets © Chase McDillan, used with permission.

## Accessibility
- WCAG AA contrast minimum
- Keyboard-navigable everywhere
- Focus rings visible & brand-colored
- prefers-reduced-motion respected
- Semantic HTML5 landmarks
- aria-labels on icon-only controls

## Coding Conventions
- CSS variables in :root, no hardcoded colors elsewhere
- Class naming: kebab-case, BEM-ish (.section__label)
- JS wrapped in DOMContentLoaded, split across 4 files
- No inline styles except CSS custom property overrides
- Comments: // FEATURE: <name> above each interactive block