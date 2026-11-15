# Group demonstration plan

## Before recording

- Confirm the group-size rule with the instructor (header and detailed instruction differ).
- Fill in real ownership details and follow the course's authorship requirements.
- Run `npm test` and rehearse each member's guide.
- Set all flags to false, stop the server, run `npm run reset`, and restart.
- Run `npm run attacker` in a second terminal. Use 127.0.0.1 in every URL.
- Open the portal and each member's module in the editor.
- Read the alternative mitigations alongside your lecture slides.

## For each member (roughly 2–3 minutes)

1. Say your name, roll number, category, and exact variant.
2. Show normal behaviour, then the exact exploit and its visible result.
3. Show the faulty code and explain why input becomes SQL/shell/HTML syntax, or why a forged request is trusted.
4. Explain the fix, enable only your flag, and restart the server.
5. Repeat the same attack and show it is blocked. For CSRF re-establish the session first. For stored XSS keep the original malicious comment saved.
6. Show normal behaviour remains usable; briefly mention alternative mitigations.

Members 3 and 4: your fixes are in the EJS output branches, not just the route files. Member 2: show the marker in output. Member 5: show the name did not change, not merely that an error page appeared.

## Evidence and submission

Save genuine screenshots in `docs/evidence/`, named by member and before/after. Capture browser alerts for XSS and blocked output after protection. Include payloads in the narration. Record each member's own voice, combine into one video, and add its link to README. Publish the source in the group's required GitHub repository; do not host the running vulnerable app publicly. Repository creation/video submission remain group actions.
