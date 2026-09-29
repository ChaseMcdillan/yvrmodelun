# YVRMUN Staff Application — Google Apps Script Setup

This guide walks the site owner through connecting the YVRMUN staff
application form to their Google account (Gmail + Sheets).
Total time: ~10 minutes.

## What This Does
When a student submits the staff application form on the website:
1. A row is added to a Google Sheet named "YVRMUN Applications"
2. An email is sent to yvrmun26@gmail.com with all the answers
3. The resume PDF is attached to that email (up to 4 MB)
4. The applicant sees a reference code on screen

## Prerequisites
- A Google account (yvrmun26@gmail.com recommended)
- The file scripts/staff-apply.gs from the website repo
- Access to the website's js/config.js file

## Step 1 — Create the Google Sheet
1. Go to https://sheets.new
2. Rename the sheet to: YVRMUN Applications
3. In row 1, paste these headers exactly, one per column:
   Timestamp | Reference | Email | Phone | Legal Name | Preferred Name |
   School | Grade | Positions | Delegate Experience | Staff Experience |
   Why Join | Why You | MUN Improvement | Accommodation OK | Unpaid OK |
   Resume Link
4. Leave the rest of the sheet blank.

## Step 2 — Open Apps Script
1. In the Sheet, click Extensions → Apps Script
2. Delete any code in the editor
3. Paste the entire contents of scripts/staff-apply.gs
4. Save (Cmd/Ctrl + S)
5. Rename the project to: YVRMUN Staff Form

## Step 3 — Configure the Script
At the top of staff-apply.gs, edit these constants:

    const NOTIFY_EMAIL = 'yvrmun26@gmail.com';
    const SHEET_NAME   = 'YVRMUN Applications';
    const MAX_FILE_MB  = 4;

Save again after editing.

## Step 4 — Deploy as a Web App
1. Click Deploy → New deployment
2. Click the gear icon → select type: Web app
3. Description: YVRMUN Staff Form v1
4. Execute as: Me (yvrmun26@gmail.com)
5. Who has access: Anyone
6. Click Deploy
7. Authorize the script when prompted (Google will ask for
   permission to send email and edit Sheets — this is expected)
8. Copy the Web App URL (looks like:
   https://script.google.com/macros/s/AKfy.../exec)

## Step 5 — Connect the Website
1. Open js/config.js in the website repo
2. Find the line:
   STAFF_APPLY_ENDPOINT: 'REPLACE_WITH_APPS_SCRIPT_URL'
3. Replace with your copied URL:
   STAFF_APPLY_ENDPOINT: 'https://script.google.com/macros/s/AKfy.../exec'
4. Save and redeploy the website (Vercel does this automatically
   if connected to your GitHub repo)

## Step 6 — Test
1. Open the live site
2. Go to the Staff page
3. Fill out the form completely
4. Attach a small PDF (under 4 MB)
5. Submit
6. Check:
   - Reference code appears on screen
   - Email arrives at yvrmun26@gmail.com with the PDF attached
   - New row appears in the Google Sheet

If any step fails, see Troubleshooting below.

## Troubleshooting
- "Script function not found" → You saved the file but didn't
  deploy. Redo Step 4.
- "Authorization required" → Redo Step 4, approve permissions.
- "No email received" → Check spam. Add yvrmun26@gmail.com to
  contacts, or whitelist script.google.com.
- "No row in Sheet" → Confirm the tab name is exactly
  "YVRMUN Applications" (case-sensitive).
- "PDF missing from email" → File was over 4 MB. The Sheet will
  still log the submission, but the resume won't attach.

## Updating the Script Later
If you edit the script after deploying:
1. Save the script
2. Deploy → Manage deployments
3. Click the pencil icon next to the current deployment
4. Version: New version
5. Click Deploy

The URL stays the same. The website doesn't need any changes.

## Reference Code Format
Codes look like: A/YVRMUN/2027/042
The number is a running count of rows in the Sheet, padded to
3 digits. It's stored in column B (Reference).