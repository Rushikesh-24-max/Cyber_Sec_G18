# Member 5: CSRF — GET-based forged action

## Demonstrate

1. Keep `csrf: false`; run `npm start` and, in a second terminal, `npm run attacker`.
2. Open `http://127.0.0.1:3000/profile` and click **Start demo session**.
3. Show a normal display-name change and the GET request in the URL.
4. In another tab open `http://127.0.0.1:4000` and click **Claim campus reward**.
5. The browser navigates to the portal and the display name becomes **Changed by CSRF**. The user did not intentionally submit the profile form.
6. Explain `modules/profile/index.js`, the profile form, and `attacker/index.html`.
7. Set `csrf: true` and restart the portal. Start a **fresh demo session**; otherwise an unauthenticated failure does not prove CSRF protection.
8. Save a normal name (for example `Aarav Sharma`) through the real profile form.
9. Return to the same attacker page and click the **same link**. The portal returns 405 and leaves the name unchanged.
10. Show a legitimate save still works. The test suite additionally checks that POST without a token, or with a wrong token, returns 403.

## Why and fix

A session cookie identifies the logged-in browser. It does not prove the user intended the action. The vulnerable endpoint accepts a state-changing GET without any proof of intent, so an external page can initiate it. The protected endpoint rejects GET and validates an unpredictable session-bound token on POST. POST by itself is not CSRF protection: an attacker can submit an ordinary cross-origin HTML form.

## Browser details

Use **127.0.0.1 consistently**, main app on port 3000 and attacker on port 4000. These are different origins (different ports), although the same site for SameSite-cookie rules. Do not call this a demonstration of bypassing the same-origin policy: cross-origin navigations are allowed. A top-level GET link was chosen rather than an image or auto-submitting POST to avoid modern browser cookie restrictions making the GET lesson unreliable. The attacker does not need to read the response or steal a cookie. SameSite=Lax also permits top-level safe-method navigation from a different site; it does not make state-changing GET safe.

## Other mitigations — theory

Synchronizer tokens bind intent to a session and must be checked server-side. SameSite cookies reduce cross-site cookie sending, but ports do not create different sites and Lax allows some GET navigations. Re-authentication protects sensitive actions. Never use GET to change state. Origin/Referer checks can add defense, but are not this implementation's chosen fix. XSS can often defeat CSRF defenses, so the profile fix is not a claim that an otherwise vulnerable site is secure.

Viva: why is login required for the attack? Why not just switch to POST? Why can the attacker cause a request despite being on another origin?

Evidence: profile name before attack, forged change, then blocked request and unchanged name with a live session after the fix.
