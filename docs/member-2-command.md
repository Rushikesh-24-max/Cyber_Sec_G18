# Member 2: OS command injection — in-band output

## Demonstrate

1. Keep `commandInjection: false`; run `/network` with `127.0.0.1` to show a normal ping.
2. On Windows submit `127.0.0.1 & echo COMMAND_INJECTION_WORKED`.
3. On Linux submit `127.0.0.1 ; echo COMMAND_INJECTION_WORKED`.
4. Show the marker printed in the **output**, not just the input box. This is a harmless demonstration of an extra command executed by the shell.
5. Show `modules/network/index.js`: `exec()` invokes a shell around a string containing user input.
6. Set `commandInjection: true`, restart, and repeat the exact platform-appropriate input. It is rejected as an invalid IP address.
7. Show `127.0.0.1` still works.

## Why and fix

The shell interprets a command separator as syntax, so the appended command runs with the server process's permissions. The protected implementation uses `execFile('ping', args)` without a shell and restricts input to an actual IP. The argument vector keeps arguments separate from executable syntax; IP validation also prevents argument/option injection.

## Other mitigations — theory

Best is avoiding OS command execution when an application library provides the needed operation. Argument-vector execution without a shell prevents shell parsing. An allow-list constrains expected input. Least privilege reduces consequences but does not remove injection. Timeouts and output limits bound this demo's operations; they are not injection fixes. Do not use blacklist-based replacement of a handful of characters.

## Troubleshooting

The OS must provide `ping`; Windows does. On Linux, install your distribution's ping utility if absent. A firewall can block replies. This lesson's shell payload is platform-specific. The output is HTML-escaped in both modes so this exercise does not add another XSS sink.

Viva: why is `shell: true` dangerous even if arguments are in an array? Why combine IP validation with avoiding the shell?

Evidence: marker in output, rejected replay, and normal ping after the fix.
