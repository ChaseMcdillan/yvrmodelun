# YVRMUN Website Rebuild — Specification

## PROJECT
Rebuild the YVRMUN website (existing: https://yvrmun.netlify.app).
Goal: match or exceed the current site in design, content, structure,
interactivity, and performance.

## TECH STACK (non-negotiable)
- Plain HTML5, custom CSS3 (CSS variables), vanilla JavaScript
- NO React, Vue, Next.js, Tailwind, Bootstrap, npm, or build tools
- Static hosting (Netlify / GitHub Pages / Cloudflare Pages)
- Single-page scrolling site (all sections on index.html)
  OR multi-page — but current site is single-page scroll, so match it.

## BRAND IDENTITY
- Conference: Vancouver Youth Model United Nations (YVRMUN)
- Session: Session II / Spring 2027
- Location: Richmond, British Columbia (Metro Vancouver)
- Tagline: "MAKE THE room." / "ENTER THE ROOM."
- Voice: Bold, editorial, minimal, slightly provocative.
  Not corporate. Not brochure-like. Feels like a designed experience.
- Typography: Large uppercase display headings, tight tracking,
  monospace/small-caps labels for section numbers (01 / 02 / 03).
- Palette: Minimal — near-black background sections, off-white,
  one accent color (infer from live site: likely a warm/bright accent).
  Support both dark and light sections with strong contrast.

## PAGE STRUCTURE (single page, scroll-based)
The current site is ONE long scrolling page with numbered sections.
Rebuild as `index.html` with these sections in order:

00. HERO
    - Top-left: "Vancouver Youth Model United Nations" / "Session II / 2027"
    - Top-right: "ENTER THE ROOM." (link/CTA)
    - Body copy: "This is not a brochure. It is the room before the
      delegates arrive. Explore the conference, test a decision,
      find your committee, and decide where you belong."
    - Sub-label: "Session II / Spring 2027"
    - Huge headline: "MAKE THE room." (mixed case — lowercase 'room')
    - Intro paragraph about YVRMUN being built around what happens
      after someone says something unexpected
    - Marquee/stat strip (repeating): "YVR / 27", "Six committees",
      "Three hundred delegates", "Crisis is encouraged",
      "Draft. Debate. Decide.", "Richmond / April 2027"

01. WHY THIS EXISTS
    - Label: "01 / WHY THIS EXISTS"
    - Headline: "MUN should feel alive."
    - Body: 2 paragraphs (worksheet metaphor, improvised moments,
      small details matter, "an argument, not just a score")

02. THE SETTING
    - Label: "02 / THE SETTING"
    - Headline: "The room is somewhere."
    - Body: paragraph about Richmond
    - Stat row: II / Session, 06 / Committees, 300+ / Delegates,
      40 / Staff positions
    - Map/location block: "North / Vancouver", "Pacific",
      "Richmond / Conference zone"
    - Note: "Richmond, BC — Host city for Session II.
      Exact venue information can be published here when confirmed."

03. CHOOSE YOUR ROOM (Committees)
    - Label: "03 / CHOOSE YOUR ROOM"
    - Headline: "Six rooms. Six different games."
    - Body: "Click a committee. Read the premise. Imagine yourself
      in the room. This section is intentionally less like a menu
      and more like a map."
    - Interactive committee cards (click to expand/select)
    - Committee 01 example given: Security Council
      - Code: A/YVRMUN/2027/01
      - Title: Security Council
      - Description: "Fast-moving crisis committee with directives,
        veto politics, closed sessions, and consequences that
        arrive before you have finished arguing about the last one."
    - NEED: 5 more committees (placeholders acceptable, but structure
      must support 6 total with codes A/YVRMUN/2027/01–06)

04. TEST YOUR INSTINCTS (Interactive)
    - Label: "04 / TEST YOUR INSTINCTS"
    - Headline: "What would you do?"
    - Body: "No correct answer. Just consequences. Pick the response
      you would actually make in committee and see what kind of
      room you create."
    - UI: Room energy meter (00 → 100), "Scenario 01 / 03",
      "Live decision" badge
    - Scenario 01 (given):
      Prompt: "Your bloc has a majority, but your strongest ally
      wants a clause you know will split the room."
      Sub: "The chair has given you eight minutes before the draft
      resolution closes. Everyone is watching."
      Outcome shown (example): "You chose the room over the moment.
      Your move creates more space for coalition-building. In a live
      committee, that can be more valuable than winning a single clause."
    - NEED: 2 more scenarios (03 total) with 2–4 choices each
      and outcome text per choice. Build the state machine.

05. THE WEEKEND (Schedule)
    - Label: "05 / THE WEEKEND"
    - Headline: "Two days. One room."
    - Body: "Working outline only. Exact times and venue details
      can be updated here once the conference schedule is finalized."
    - Timeline entries (time / title / description / day label):
      - 08:30 Doors / Registration — Day one
      - 09:30 Opening Ceremony — Day one
      - 11:00 Committee Session I — Day one
      - 13:00 Lunch / Informal Diplomacy — Day one
      - 14:00 Committee Session II — Day one
      - 17:00 Day One Close — Day one
      - 09:00 Committee Session III — Day two
      - 13:30 Voting Bloc — Day two
      - 15:00 Closing Ceremony — Day two

06. BUILD THE CONFERENCE (Staff Application)
    - Label: "06 / BUILD THE CONFERENCE"
    - Headline: "Don't just attend."
    - Body: "Staff are the people who shape what delegates experience.
      Choose a role below to see what it actually means."
    - Role cards (clickable):
      - ROLE / 01 Chair — "Procedure, debate, room energy."
      - ROLE / 02 Crisis Staff — "Updates, directives, consequences."
      - ROLE / 03 Logistics — "People, rooms, timing, movement."
      - ROLE / 04 Press Lead — "Coverage, assignments, publication."
      - ROLE / 05 Press Writer — "Stories, interviews, perspective."
    - Application form (multi-field, validation required):
      - Fields: name, email, role selection, experience, motivation
        (infer from context; mark unknown fields as TODO)
      - On submit: generate reference code "A/YVRMUN/2027/000"
        and show success message: "You're in the queue."
      - Note visible in spec only: "Connect this form to your
        production backend before collecting real applicant information."
      - Validation message: "Please complete every field."

    QUOTE BLOCK (between sections):
      - Quote: "The point isn't to sound like a diplomat.
        The point is to make the room move."
      - Attribution: "YVRMUN / Session II / 2027"

07. QUESTIONS (FAQ)
    - Label: "07 / QUESTIONS"
    - Headline: "You ask. We answer."
    - Body: "A few practical things before you commit a weekend
      to diplomacy."
    - Accordion FAQ items (current copy uses placeholders):
      Q1: "YVRMUN is designed as a youth Model United Nations
          conference. Publish your actual eligibility range here
          once registration policy is finalized."
      Q2: "Not necessarily. Committee descriptions can indicate
          experience levels, and staff can use conference materials
          to help delegates prepare." (Q: Do I need experience?)
      Q3: "YVRMUN Session II is planned for April 2027 in Richmond,
          British Columbia. Publish exact dates and venue here once
          confirmed." (Q: When and where?)
      Q4: "Yes. Use the staff application above. The current template
          supports Chair, Crisis Staff, Logistics, and Press positions."
          (Q: Can I apply for staff?)
      Q5: "The Press Corps is a non-voting newsroom inside the
          conference. It can cover debate, interview delegates,
          publish stories, and shape how the conference is
          remembered." (Q: What is the Press Corps?)
      Q6: "No. The schedule shown is a working outline and should be
          replaced with the official timetable when the conference
          logistics are finalized." (Q: Is the schedule final?)
    - NEED: rewrite each answer as the actual answer (current copy
      is meta-instruction text from the template, not real answers).
      Also write the actual question text for each.

FOOTER
    - "YVRMUN / Session II / 2027"
    - Contact: (need to add — check live site)
    - Social links (Instagram, etc. — need to add)

## INTERACTIONS TO IMPLEMENT
1. Smooth scroll navigation (anchor links to sections)
2. Committee selector — click a card to expand/detail it
3. Scenario decision machine — 3 scenarios, choices, room-energy
   meter, outcome reveal
4. Staff role selector — click a role to see details
5. Staff application form — validation + reference code generation
6. FAQ accordion — click to expand/collapse
7. Sticky top bar with "ENTER THE ROOM." CTA

## DESIGN REQUIREMENTS (why it must be BETTER)
1. Fully responsive — 375px, 768px, 1024px, 1440px breakpoints
2. Typography-driven — huge display headlines, monospace labels
3. Section numbering visible (01 / 02 / 03 ...) as design element
4. High contrast (WCAG AA minimum)
5. No layout shift — reserve space for images/meters
6. Fast — no external fonts unless system stack; no CDN scripts
7. Semantic HTML5 — header, main, section, footer, article
8. Accessible — keyboard nav, aria-labels on icon buttons,
   aria-expanded on accordions, prefers-reduced-motion respected
9. Print stylesheet optional

## CONTENT RULES
- Keep ALL existing copy verbatim unless marked "NEED"
- Never use lorem ipsum
- TODO comments in HTML for missing content:
  `<!-- TODO: replace with real committee 02 -->`
- Use sentence case in body, Title Case in section labels
- Preserve the mixed-case headline style: "MAKE THE room."
  (capitalized words + lowercase accent word)

## FILE STRUCTURE
```
yvrmun/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── images/
│   └── (logo, map, textures)
└── docs/
    └── site-spec.md  (this file)
```

## CODING CONVENTIONS
- CSS variables in `:root` for all colors, spacing, type scale
- Class naming: kebab-case, BEM-ish for components
  (.section, .section__label, .committee-card, .committee-card__title)
- JS in `main.js`, wrapped in DOMContentLoaded
- No inline styles except CSS custom property overrides
- Each interactive feature is a self-contained IIFE or module object
- Comment every interactive block with `// FEATURE: <name>`

## WHAT I NEED (in order, one step at a time)
1. File structure
2. `index.html` skeleton with all 8 sections + header + footer,
   real copy from this spec, TODO comments for missing content
3. `css/styles.css` — full design system (type scale, colors,
   spacing, components, responsive)
4. `js/main.js` — all interactions (scroll, committees, scenario,
   roles, form, FAQ)
5. Accessibility pass
6. Performance pass

Start with step 1. Wait for confirmation before each next step.