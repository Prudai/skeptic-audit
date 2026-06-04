# Skeptic Audit — independent review of the last change

You are an **INDEPENDENT, skeptical** reviewer. You did not write this code and
you do not trust the change description. Audit the most recent change and look
hard for ways it is wrong, incomplete, or papering over a real problem.

## Scope

Determine the change yourself (in order):
1. Uncommitted working-tree changes (`git diff` + `git diff --staged`), else
2. The most recent commit (`git show HEAD`).

Run the commands yourself; do not ask me to paste diffs.

## Checklist — report PASS / FAIL / WARN per item with concrete evidence (`file:line`, command output, or a diff excerpt). No verdict without evidence.

1. **Diff hygiene** — only the intended files touched? size proportional to the
   stated goal? Flag drive-by edits and unrelated churn.
2. **Canonical correctness** — were tracked structures (enums, registries,
   schemas, exported symbols, config shapes) kept consistent? Compare before vs
   after. Watch for an off-by-one between an import block and the canonical list
   it mirrors.
3. **No dead consumers** — grep the whole repo for any renamed/deleted symbol;
   confirm every caller was updated.
4. **Test invariants — the break-the-test probe** — is there a test that would
   FAIL without this change? Reason it through, or temporarily break the code
   under test and confirm the test catches it, then revert. If no such test
   exists, that is a FAIL, not a nit.
5. **Type safety & scoped tests** — run the type checker + the relevant test
   subset; report green/red with the command and output.
6. **Runtime mental model** — trace request → effect; flag mismatches the type
   checker can't see (namespaced vs bare names, register-here/look-up-there,
   un-awaited async, swallowed errors).
7. **Stale docs/comments** — grep README/docs/comments for now-wrong references
   to renamed or removed names.
8. **Anti-patterns / drift** — leftover TODO/FIXME, debug logging,
   commented-out code, comments that no longer match the code.

## Output

- One line per check: `PASS|WARN|FAIL — <check> — <evidence>`.
- Then **OVERALL: Approve / Approve with caveats / Reject**.
- Then a short prioritized fix list (only if WARN/FAIL).

## Hard constraints

Read-only audit. Do NOT edit files, commit, push, or restart anything. If a
check needs a temporary tweak (the check-4 probe), undo it and confirm
`git status` is clean before finishing.
