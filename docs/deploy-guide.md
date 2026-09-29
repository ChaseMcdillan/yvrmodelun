# YVRMUN Website — Deploy & Handoff Guide

This guide is for whoever hosts the site (you) and for the final
handoff to the site owner (the YVRMUN secretariat).

## Part 1 — Deploy to Vercel (Your Side)

### Option A — Connect a GitHub repo (recommended)
1. Push this project to a GitHub repo you own.
2. Go to https://vercel.com/new
3. Import the GitHub repo.
4. Framework preset: Other
5. Build command: (leave empty)
6. Output directory: . (a single dot)
7. Click Deploy.
8. Vercel assigns a URL like yvrmun.vercel.app
9. Add a custom domain later if desired (see Part 3).

### Option B — Vercel CLI
    npm i -g vercel
    cd yvrmun
    vercel
    vercel --prod

### After Deploy
- The site is live at the assigned URL.
- The staff form will not work until js/config.js has the real
  Apps Script URL (see docs/apps-script-setup.md).

## Part 2 — Configure the Form
1. Complete docs/apps-script-setup.md first.
2. Paste the Web App URL into js/config.js.
3. Commit and push (Vercel auto-redeploys), or run vercel --prod.

## Part 3 — Custom Domain (Optional)
1. In Vercel → Project → Settings → Domains
2. Add your domain (e.g. yvrmun.com)
3. Update DNS at your registrar:
   - A record: 76.76.21.21
   - CNAME www → cname.vercel-dns.com
4. Wait 5–60 minutes for propagation.

## Part 4 — Handoff to the Owner

### Option A — Claim Deployment (fastest, no account swap)
1. In Vercel → Project → Settings → General
2. Scroll to "Transfer Project"
3. Click "Generate Claim URL"
4. Copy the URL (valid 24 hours)
5. Send it to the owner
6. They open it, log into their Vercel account, click Claim
7. The project moves into their account

Important: Custom domains do NOT transfer automatically.
The owner will re-add the domain in their Vercel account after
claiming.

### Option B — GitHub Transfer (most complete)
If the project is already on GitHub:
1. GitHub → Repo → Settings → General → Danger Zone
2. Transfer ownership to the owner's GitHub account
3. Owner then connects the repo to their own Vercel account
4. You keep nothing; they own everything

This is cleaner if the owner wants full control over both the
code and the hosting.

## Part 5 — What the Owner Should Know

After handoff, the owner controls:
- The Vercel project (hosting, domains, deploys)
- The GitHub repo (if transferred — code, commit history)
- The Google Sheet + Gmail inbox (all applications)

To update content:
- Text changes → edit the HTML files directly, commit
- Google Apps Script changes → edit in the Sheet's Extensions menu
- Domain changes → Vercel dashboard

If they don't want to touch code, they can ask you for small
updates. The site is designed to be edit-safe: no build step,
no minified files.

## Part 6 — Post-Handoff Checklist
- [ ] Site loads at production URL
- [ ] Lock screen appears on first visit
- [ ] All 8 inner pages render
- [ ] Mobile layout works at 375px width
- [ ] Staff form submits successfully
- [ ] Email arrives at yvrmun26@gmail.com
- [ ] Row appears in the Google Sheet
- [ ] PDF resume is attached to the email
- [ ] Copyright footer shows on every page
- [ ] Owner has confirmed access to Vercel + GitHub + Google
- [ ] Custom domain resolves (if applicable)