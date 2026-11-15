# Member 3: reflected XSS

## Demonstrate

1. Keep `reflectedXss: false`; open `/search` and search for `library`.
2. Search for `<script>alert("REFLECTED_XSS")</script>`.
3. A browser alert appears. Dismiss it. The input comes from the current URL/request and is not saved.
4. Show `modules/search/index.js` and the output branch in `views/search.ejs`.
5. Set `reflectedXss: true`, restart, and submit the exact same search. The payload appears as text; no alert executes.
6. Search for `library` again to confirm normal results.

## Why and fix

The raw EJS `<%- query %>` output sink treats input as HTML in the response document. The browser parses a script element and executes it. The protected `<%= query %>` sink encodes special characters in this HTML text context. The input field itself is already escaped in both modes; the vulnerable sink is the search summary.

## Other mitigations — theory

Context-aware encoding must match HTML text, attribute, JavaScript, CSS, or URL contexts; this demo fixes HTML text only. Framework auto-escaping makes safe output the default. Use a maintained HTML sanitiser if rich user HTML is genuinely needed. CSP can restrict script execution as a second layer. HttpOnly prevents JavaScript reading that cookie, but does not prevent XSS execution or authenticated actions. In browser code, use textContent instead of innerHTML for plain user text.

Viva: why is this reflected rather than stored? Is replacing the string `<script>` enough? No, HTML has many executable forms.

Evidence: alert executing before the fix; literal payload after the fix. A screenshot of text alone cannot prove an alert executed, so include the real browser behaviour in the video.
