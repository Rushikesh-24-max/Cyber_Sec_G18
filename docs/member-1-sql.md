    # Member 1: SQL injection — authentication bypass

## Demonstrate

1. Keep `sqlInjection: false` in `config.js` and start the portal.
2. Open `/login`. Sign in with `student` / `campus123`: success. Try a wrong password: failure.
3. Enter username `student' -- ` (including a trailing space), password `wrong`.
4. The vulnerable implementation reports a successful login despite the incorrect password.
5. Show `modules/login/index.js`. The resulting query begins `WHERE username = 'student' -- ...`; SQLite treats the password comparison as a comment.
6. Set `sqlInjection: true`, restart, and submit the **same username and password**. It fails.
7. Submit the normal credentials again. They still work.

## Why and fix

String interpolation merges untrusted data with SQL syntax. The protected branch binds values with `?` placeholders, so quotes and comment characters are data, not query operators. The attack does not guess a password; it removes its check from the interpreted query.

## Other mitigations — theory

Allow-list validation restricts expected username formats but is not a replacement for parameterisation. In a database server, a least-privileged account limits damage; SQLite has no per-user SQL account roles, so restrict file/process privileges instead. Safe errors avoid leaking schema or query details. A real login also hashes passwords; the plaintext dummy credential here isolates the SQL lesson.

## Viva questions

- Why does a wrong password fail normally but work with this input?
- Why is escaping or banning one payload weaker than parameters?
- Does changing the page's client-side validation fix SQL injection? No: requests bypass the UI.

Evidence: save successful bypass and blocked replay screenshots. Record your own narration.
