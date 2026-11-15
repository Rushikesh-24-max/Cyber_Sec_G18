# Student Portal — Web Server Security Assignment

A deliberately small **local-only** portal demonstrating five variants across the four required vulnerability categories. Node.js + Express + EJS + SQLite. No React, build step, external database server, or real student data.

## Run

Requires **Node.js 24 or newer** (uses built-in `node:sqlite`; an experimental warning on Node 24.11 is expected).

```sh
npm install
npm start
```

Open **http://127.0.0.1:3000**. Run the lab on localhost only.

## Select vulnerable or protected behaviour

Edit **config.js**. Each flag is independent: `false` runs the vulnerable branch; `true` enables the corresponding mitigation. All five default to `false`. Stop the portal with Ctrl+C and run `npm start` again after editing. The webpage and URL remain the same. There is no UI toggle.

- `sqlInjection` — login parameterisation.
- `commandInjection` — validated IP + argument-vector execution without a shell.
- `reflectedXss` — escaped search-term output.
- `storedXss` — escaped feedback output.
- `csrf` — POST-only profile changes + session-bound token verification.

The code includes comments marking the flaw and fix. EJS uses `<%=` for escaped HTML text and `<%-` for raw HTML. Raw output is deliberately used only at the two XSS lesson sinks (and trusted template includes).

Profile sessions are in memory, so **restarting ends them**. Start a fresh profile session after every restart. Profile data and comments persist in `database/portal.sqlite`. `lib/demo-session.js` uses random opaque session IDs, rotates them at demo sign-in, and expires them after two hours. It is a small lab helper, not a production authentication framework. Both profile modes use the same HttpOnly, SameSite=Lax cookie configuration, so the CSRF difference is the server-side mitigation.

## Ownership declaration

- Member 1 — **Rushikesh Talaviya (IIT2024049)**. Category: SQL injection. Variant: authentication bypass. Files: `modules/login/index.js`, `views/login.ejs`. Guide: `docs/member-1-sql.md`.
- Member 2 — **Harin Savaliya (IIT2024051)**. Category: OS command injection. Variant: in-band output. Files: `modules/network/index.js`, `views/network.ejs`. Guide: `docs/member-2-command.md`.
- Member 3 — **Akshat Agrawal (IIT2024102)**. Category: XSS. Variant: reflected. Files: `modules/search/index.js`, `views/search.ejs`. Guide: `docs/member-3-reflected.md`.
- Member 4 — **Divyang (IIT2024107)**. Category: XSS. Variant: stored. Files: `modules/feedback/index.js`, `views/feedback.ejs`. Guide: `docs/member-4-stored.md`.
- Member 5 — **Anish Reddy (IIT2024059)**. Category: CSRF. Variant: GET-based forged action. Files: `modules/profile/index.js`, `views/profile.ejs`. Guide: `docs/member-5-csrf.md`.

Shared infrastructure: `server.js`, `config.js`, `database/`, shared templates and CSS. Each member must understand, work through, and be able to explain their own implementation. Follow your course's authorship and AI-use requirements; don't claim generated code was personally written without doing the required individual work.


See [the group presentation outline](docs/presentation.md) for the recording.

## Reset and verify

```sh
npm run reset
npm test
```

Reset clears feedback and restores the dummy profile name. It does not change config flags. The feedback page also has a clear-demo-feedback action. Tests use separate in-memory databases and never reset your presentation data. They exercise both modes independently of the checked-in flags.

The SQL login credentials are `student` / `campus123`. Its result does not authenticate the separate profile exercise. For that exercise click **Start demo session** on `/profile`.

Video link: **to be added by group**.

## References

- Node SQLite: https://nodejs.org/api/sqlite.html
- Express: https://expressjs.com/en/5x/api.html
- EJS output escaping: https://ejs.co/#docs
- OWASP SQL injection: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- OWASP command injection: https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html
- OWASP XSS: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- OWASP CSRF: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
