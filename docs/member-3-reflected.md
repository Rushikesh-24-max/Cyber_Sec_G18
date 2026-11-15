# Member 3: reflected XSS

## Root cause and fix

The raw EJS `<%- query %>` output sink treats input as HTML in the response document. The browser parses a script element and executes it. The protected `<%= query %>` sink encodes special characters in this HTML text context. The input field itself is already escaped in both modes; the vulnerable sink is the search summary.

## Other mitigations

Context-aware encoding must match HTML text, attribute, JavaScript, CSS, or URL contexts; this demo fixes HTML text only. Framework auto-escaping makes safe output the default. Use a maintained HTML sanitiser if rich user HTML is genuinely needed. CSP can restrict script execution as a second layer. HttpOnly prevents JavaScript reading that cookie, but does not prevent XSS execution or authenticated actions. In browser code, use textContent instead of innerHTML for plain user text.

## Verify normal use

Search for library and verify that matching notices are listed. Check that text containing angle brackets is displayed literally.
