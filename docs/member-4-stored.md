# Member 4: stored XSS

## Root cause and fix

Untrusted content persists in the database and is later rendered as raw HTML. Parameterised inserts prevent SQL injection but do not make data safe for HTML rendering. The protected output encodes the stored body with EJS `<%= c.body %>`. Encode at the output boundary; do not rely on the database to make content safe.

## Other mitigations

Use context-appropriate output encoding and template auto-escaping by default. Use an HTML sanitiser for permitted rich text. CSP provides additional execution restrictions. HttpOnly limits cookie reading, not arbitrary script execution. Safe DOM sinks such as textContent prevent HTML parsing when building UI in JavaScript.

## Verify normal use

Post a normal comment, reload the board, and verify that the comment persists. Check that text containing angle brackets is displayed literally.
