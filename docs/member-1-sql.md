    # Member 1: SQL injection — authentication bypass

## Root cause and fix

String interpolation merges untrusted data with SQL syntax. The protected branch binds values with `?` placeholders, so quotes and comment characters are data, not query operators. The attack does not guess a password; it removes its check from the interpreted query.

## Other mitigations

Allow-list validation restricts expected username formats but is not a replacement for parameterisation. In a database server, a least-privileged account limits damage; SQLite has no per-user SQL account roles, so restrict file/process privileges instead. Safe errors avoid leaking schema or query details. A real login also hashes passwords; the plaintext dummy credential here isolates the SQL lesson.

## Verify normal use

Sign in with the demo account and verify that a wrong password is rejected.
