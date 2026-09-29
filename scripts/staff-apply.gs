/**
 * YVRMUN — Staff Application Handler
 * Receives POSTs from staff.html, writes a row to the linked Sheet,
 * and emails yvrmun26@gmail.com with the application + resume.
 *
 * Setup instructions: docs/apps-script-setup.md
 */

/* ---------- CONFIG (edit these) ---------- */
const NOTIFY_EMAIL   = 'yvrmun26@gmail.com';
const SHEET_NAME     = 'Applications';
const MAX_FILE_MB    = 4;
const FROM_NAME      = 'YVRMUN Applications';

/* ---------- SHEET HEADERS (order matters) ---------- */
const HEADERS = [
  'Timestamp',
  'Reference',
  'Email',
  'Phone',
  'Legal Name',
  'Preferred Name',
  'School',
  'Grade',
  'Positions',
  'Delegate Experience',
  'Staff Experience',
  'Why Join',
  'Why You',
  'MUN Improvement',
  'Accommodation OK',
  'Unpaid OK',
  'Resume Filename',
];

/* ---------- ENTRY POINTS ---------- */

/**
 * GET — used for a quick health check and to help debugging.
 * Visit the deployed Web App URL in a browser to see this.
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      service: 'YVRMUN Staff Application Handler',
      time: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * POST — the form posts here.
 * Accepts FormData (multipart) from the browser.
 */
function doPost(e) {
  try {
    // --- 1. Parse incoming fields ---
    const p = (e && e.parameter) || {};

    const payload = {
      email:               p.email || '',
      phone:               p.phone || '',
      legalName:           p.legalName || '',
      preferredName:       p.preferredName || '',
      school:              p.school || '',
      grade:               p.grade || '',
      positions:           p.positionsList || p.positions || '',
      delegateExperience:  p.delegateExperience || '',
      staffExperience:     p.staffExperience || '',
      whyJoin:             p.whyJoin || '',
      whyYou:              p.whyYou || '',
      munImprovement:      p.improve || p.munImprovement || '',
      accommodationOk:     p.accommodationOk || '',
      unpaidOk:            p.unpaidOk || '',
      resumeName:          p.resumeName || '',
      resumeType:          p.resumeType || '',
      resumeSize:          parseInt(p.resumeSize || '0', 10),
      resumeBase64:        p.resumeBase64 || '',
    };

    // --- 2. Server-side validation ---
    const required = ['email', 'phone', 'legalName', 'school', 'grade',
                      'positions', 'delegateExperience', 'whyJoin',
                      'munImprovement', 'accommodationOk', 'unpaidOk'];
    const missing = required.filter(k => !payload[k]);
    if (missing.length) {
      return jsonResponse({
        success: false,
        error: 'Missing required fields: ' + missing.join(', ')
      });
    }

    // --- 3. Auto-reject checks ---
    if (payload.accommodationOk !== 'Yes' || payload.unpaidOk !== 'Yes') {
      return jsonResponse({
        success: false,
        error: 'Acknowledgement questions must be Yes.'
      });
    }

    // --- 4. Resume size check ---
    if (payload.resumeSize && payload.resumeSize > MAX_FILE_MB * 1024 * 1024) {
      return jsonResponse({
        success: false,
        error: 'Resume exceeds ' + MAX_FILE_MB + ' MB.'
      });
    }

    // --- 5. Open sheet and append row ---
    const sheet = getOrCreateSheet_();
    const reference = nextReference_(sheet);

    sheet.appendRow([
      new Date(),
      reference,
      payload.email,
      payload.phone,
      payload.legalName,
      payload.preferredName,
      payload.school,
      payload.grade,
      payload.positions,
      payload.delegateExperience,
      payload.staffExperience,
      payload.whyJoin,
      payload.whyYou,
      payload.munImprovement,
      payload.accommodationOk,
      payload.unpaidOk,
      payload.resumeName,
    ]);

    // --- 6. Send notification email ---
    sendNotification_(payload, reference);

    // --- 7. Respond to the browser ---
    return jsonResponse({ success: true, reference });

  } catch (err) {
    // Log to Apps Script execution log and return error to client
    console.error('YVRMUN staff-apply error:', err);
    return jsonResponse({
      success: false,
      error: 'Server error: ' + (err && err.message ? err.message : String(err))
    });
  }
}

/* ---------- HELPERS ---------- */

/**
 * Get the "Applications" sheet in this spreadsheet.
 * Creates it with headers if missing.
 */
function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#d4f542')
      .setFontColor('#0a0a0a');
    sheet.setFrozenRows(1);
  }

  // If the sheet exists but has no headers, add them.
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#d4f542')
      .setFontColor('#0a0a0a');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * Generate the next reference code: A/YVRMUN/2027/NNN
 * NNN = row count (minus header) padded to 3 digits.
 */
function nextReference_(sheet) {
  const rows = sheet.getLastRow() - 1; // exclude header
  const nextNum = Math.max(1, rows + 1);
  return 'A/YVRMUN/2027/' + String(nextNum).padStart(3, '0');
}

/**
 * Send the notification email to NOTIFY_EMAIL with all fields
 * and (if small enough) the resume PDF attached.
 */
function sendNotification_(payload, reference) {
  const lines = [
    'A new staff application has been submitted.',
    '',
    'Reference:  ' + reference,
    '',
    '--- Contact ---',
    'Email:      ' + payload.email,
    'Phone:      ' + payload.phone,
    '',
    '--- Identity ---',
    'Legal Name:     ' + payload.legalName,
    'Preferred Name: ' + (payload.preferredName || '—'),
    'School:         ' + payload.school,
    'Grade (Sept):   ' + payload.grade,
    '',
    '--- Position Preferences ---',
    payload.positions || '—',
    '',
    '--- MUN Experience (Delegate) ---',
    payload.delegateExperience || '—',
    '',
    '--- MUN Experience (Staff) ---',
    payload.staffExperience || '—',
    '',
    '--- Why Join ---',
    payload.whyJoin || '—',
    '',
    '--- Why You ---',
    payload.whyYou || '—',
    '',
    '--- One Aspect to Improve ---',
    payload.munImprovement || '—',
    '',
    '--- Acknowledgements ---',
    'No accommodation provided: ' + payload.accommodationOk,
    'Unpaid, high commitment:    ' + payload.unpaidOk,
    '',
    '--- Resume ---',
    payload.resumeName
      ? payload.resumeName + ' (' + Math.round(payload.resumeSize / 1024) + ' KB)'
      : 'No resume uploaded.',
    '',
    '—',
    'Sent automatically by the YVRMUN website.',
  ];

  const subject = '[YVRMUN] Staff application — ' + payload.legalName + ' (' + reference + ')';
  const body = lines.join('\n');

  const options = {
    name: FROM_NAME,
    replyTo: payload.email || NOTIFY_EMAIL,
  };

  // Attach resume if present and small enough
  if (payload.resumeBase64 && payload.resumeName) {
    try {
      const bytes = Utilities.base64Decode(payload.resumeBase64);
      const blob = Utilities.newBlob(
        bytes,
        payload.resumeType || 'application/pdf',
        payload.resumeName
      );
      options.attachments = [blob];
    } catch (err) {
      // If the attachment fails, still send the email with a note.
      console.warn('Resume attach failed:', err);
    }
  }

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body, options);
}

/**
 * JSON response helper.
 */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}