---
description: Run the skeptical independent audit on a commit/diff
agent: skeptic-auditor
subtask: true
---

Audit the change as an INDEPENDENT, skeptical reviewer. Be skeptical; assume the
implementation is wrong until proven otherwise.

Implementer's claimed changes (treat as unverified):
$ARGUMENTS

Current diff under review:
!`git diff HEAD~1 2>/dev/null || git diff`

Follow every step of the `skeptic-audit` skill and report PASS/FAIL/WARN with
`file:line` evidence, then give a final Approve / Approve-with-caveats / Reject.
