# Member 4: stored XSS

## Demonstrate

1. Keep `storedXss: false`; open `/feedback`, submit a harmless comment, and refresh.
2. Use author `Demo Student`, comment `<script>alert("STORED_XSS")</script>`.
3. The redirect displays the board and triggers an alert. Dismiss it.
4. Navigate away and revisit `/feedback`. The alert runs again because the comment is stored in SQLite.
5. Show `modules/feedback/index.js` (storage) and `views/feedback.ejs` (vulnerable sink).
6. Set `storedXss: true` and restart. **Do not delete or change the saved payload.** Revisit the board. It now appears as literal text and no alert executes.
7. Add a harmless comment and verify normal posting still works.
8. Clear demo feedback after finishing to avoid surprise alerts in later presentations.

## Why and fix

Untrusted content persists in the database and is later rendered as raw HTML. Parameterised inserts prevent SQL injection but do not make data safe for HTML rendering. The protected output encodes the stored body with EJS `<%= c.body %>`. Encode at the output boundary; do not rely on the database to make content safe.

## Other mitigations — theory

Use context-appropriate output encoding and template auto-escaping by default. Use an HTML sanitiser for permitted rich text. CSP provides additional execution restrictions. HttpOnly limits cookie reading, not arbitrary script execution. Safe DOM sinks such as textContent prevent HTML parsing when building UI in JavaScript.

Viva: why can one comment affect multiple visits or viewers? Why doesn't parameterised SQL fix XSS? How does fixing output protect against already saved payloads?

Evidence: initial alert, repeat alert on revisit, and the unchanged stored payload displayed safely after protection.
