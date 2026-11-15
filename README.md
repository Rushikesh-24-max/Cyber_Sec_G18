# Student Portal — Web Server Security Assignment

A deliberately small **local-only** portal demonstrating five variants across the four required vulnerability categories. Node.js + Express + EJS + SQLite. No React, build step, external database server, or real student data.

## Run

Requires **Node.js 24 or newer** (uses built-in `node:sqlite`; an experimental warning on Node 24.11 is expected).

```sh
npm install
npm start
```

Open **http://127.0.0.1:3000**. In a second terminal run:

```sh
npm run attacker
```

The CSRF demonstration page is **http://127.0.0.1:4000**. Always use `127.0.0.1`, not a mixture of localhost and numeric IPs. Leave the main server on port 3000 for the attacker link.

Both servers bind only to the loopback interface. Do not deploy this deliberately vulnerable exercise to a public host. Public source-code submission is separate from hosting the running application.

## Select vulnerable or protected behaviour

Edit **config.js**. Each flag is independent: `false` runs the vulnerable branch; `true` enables the corresponding mitigation. All five default to `false`. Stop the portal with Ctrl+C and run `npm start` again after editing. The webpage and URL remain the same. There is no UI toggle.

- `sqlInjection` — login parameterisation.
- `commandInjection` — validated IP + argument-vector execution without a shell.
- `reflectedXss` — escaped search-term output.
- `storedXss` — escaped feedback output.
- `csrf` — POST-only profile changes + session-bound token verification.

The code includes comments marking the flaw and fix. EJS uses `<%=` for escaped HTML text and `<%-` for raw HTML. Raw output is deliberately used only at the two XSS lesson sinks (and trusted template includes).

Profile sessions are in memory, so **restarting ends them**. Start a fresh profile session after every restart. Profile data and comments persist in `database/portal.sqlite`. `lib/demo-session.js` uses random opaque session IDs, rotates them at demo sign-in, and expires them after two hours. It is a small lab helper, not a production authentication framework. Both profile modes use the same HttpOnly, SameSite=Lax cookie configuration, so the CSRF difference is the server-side mitigation.

## Ownership declaration — replace these member labels before submission

- Member 1 — Name / roll number: **to be filled by group**. Category: SQL injection. Variant: authentication bypass. Files: `modules/login/index.js`, `views/login.ejs`. Guide: `docs/member-1-sql.md`.
- Member 2 — Name / roll number: **to be filled by group**. Category: OS command injection. Variant: in-band output. Files: `modules/network/index.js`, `views/network.ejs`. Guide: `docs/member-2-command.md`.
- Member 3 — Name / roll number: **to be filled by group**. Category: XSS. Variant: reflected. Files: `modules/search/index.js`, `views/search.ejs`. Guide: `docs/member-3-reflected.md`.
- Member 4 — Name / roll number: **to be filled by group**. Category: XSS. Variant: stored. Files: `modules/feedback/index.js`, `views/feedback.ejs`. Guide: `docs/member-4-stored.md`.
- Member 5 — Name / roll number: **to be filled by group**. Category: CSRF. Variant: GET-based forged action. Files: `modules/profile/index.js`, `views/profile.ejs`, `attacker/`. Guide: `docs/member-5-csrf.md`.

Shared infrastructure: `server.js`, `config.js`, `database/`, shared templates and CSS. Each member must understand, work through, and be able to explain their own implementation. Follow your course's authorship and AI-use requirements; don't claim generated code was personally written without doing the required individual work.

## Presentation flow

See `docs/presentation.md`. Allow 2–3 minutes per member: normal use → vulnerable attack → root cause → implemented fix → **same attack** blocked → normal use still works. Demonstrate only against this group's app.

## Reset and verify

```sh
npm run reset
npm test
```

Reset clears feedback and restores the dummy profile name. It does not change config flags. The feedback page also has a clear-demo-feedback action. Tests use separate in-memory databases and never reset your presentation data. They exercise both modes independently of the checked-in flags.

The SQL login credentials are `student` / `campus123`. Its result does not authenticate the separate profile exercise. For that exercise click **Start demo session** on `/profile`.

## Limits of the exercise

This is a vulnerability demonstration, not a production-ready portal. Demo-session creation, feedback clearing, and feedback posting are deliberately simple supporting actions. The CSRF mitigation is scoped to the profile update endpoint, not a claim of site-wide hardening. HttpOnly does not stop XSS from executing or issuing actions; CSP is an additional layer, not a substitute for encoding. Parameterised SQL does not replace proper password hashing in a real login system.

The PDF's header says maximum four members, but its detailed instructions discuss groups larger than four. Confirm your five-member arrangement with the instructor. Its listed deadline is 15 November 2026, 23:59.

## Submission checklist

- Fill actual names and roll numbers in the ownership declaration.
- Each member studies their implementation and alternative mitigation theory against the lecture slides.
- Capture genuine before/after evidence in `docs/evidence/` (screenshots are not supplied or fabricated).
- Record a group video with every member narrating their own part; add its link here.
- Create the required public GitHub repository and submit repository/video links through the course page.
- Be prepared for individual live viva questions.

Video link: **to be added by group**.

## References

- Node SQLite: https://nodejs.org/api/sqlite.html
- Express: https://expressjs.com/en/5x/api.html
- EJS output escaping: https://ejs.co/#docs
- OWASP SQL injection: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- OWASP command injection: https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html
- OWASP XSS: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- OWASP CSRF: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
