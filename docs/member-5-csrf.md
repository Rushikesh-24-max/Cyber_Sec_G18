# Member 5: CSRF — GET-based forged action

## Root cause and fix

A session cookie identifies the logged-in browser. It does not prove the user intended the action. The vulnerable endpoint accepts a state-changing GET without any proof of intent, so an external page can initiate it. The protected endpoint rejects GET and validates an unpredictable session-bound token on POST. POST by itself is not CSRF protection: an attacker can submit an ordinary cross-origin HTML form.

## Other mitigations

Synchronizer tokens bind intent to a session and must be checked server-side. SameSite cookies reduce cross-site cookie sending, but ports do not create different sites and Lax allows some GET navigations. Re-authentication protects sensitive actions. Never use GET to change state. Origin/Referer checks can add defense, but are not this implementation's chosen fix. XSS can often defeat CSRF defenses, so the profile fix is not a claim that an otherwise vulnerable site is secure.

## Verify normal use

Start a demo session, update the display name using the profile form, and verify that the updated name appears.
