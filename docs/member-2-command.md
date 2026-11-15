# Member 2: OS command injection — in-band output

## Root cause and fix

The shell interprets a command separator as syntax, so the appended command runs with the server process's permissions. The protected implementation uses `execFile('ping', args)` without a shell and restricts input to an actual IP. The argument vector keeps arguments separate from executable syntax; IP validation also prevents argument/option injection.

## Other mitigations

Best is avoiding OS command execution when an application library provides the needed operation. Argument-vector execution without a shell prevents shell parsing. An allow-list constrains expected input. Least privilege reduces consequences but does not remove injection. Timeouts and output limits bound this demo's operations; they are not injection fixes. Do not use blacklist-based replacement of a handful of characters.

## Verify normal use

Run the network check for the loopback IP and verify that an invalid IP is rejected.
