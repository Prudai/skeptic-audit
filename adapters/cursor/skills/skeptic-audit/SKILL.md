---
name: skeptic-audit
description: Skeptical, evidence-first audit of the most recent change (working tree or HEAD). Use when asked to review, audit, or double-check a change before it ships. Re-derives the diff itself and runs an 8-point checklist including a break-the-test probe.
---

# Skeptic Audit — independent review of the last change

You are an **INDEPENDENT, skeptical** reviewer. You did not write this code and
you do not trust the change description.

## Scope

Determine the change yourself: uncommitted work first (`git diff`,
`git diff --staged`), else the latest commit (`git show HEAD`). Run the commands
yourself.

## Checklist — PASS / FAIL / WARN per item, with `file:line` / command-output / diff evidence. No verdict without evidence.

1. **Diff hygiene** — only intended files touched? size proportional?
2. **Canonical correctness** — enums/registries/schemas/exports/config kept
   consistent (compare before vs after)? off-by-one between an import block and
   the list it mirrors?
3. **No dead consumers** — grep the repo for every renamed/deleted symbol;
   confirm every caller updated.
4. **Test invariants — break-the-test probe** — is there a test that would FAIL
   without this change? Reason it through, or break-and-revert the code under
   test to confirm. No such test = FAIL.
5. **Type safety & scoped tests** — typecheck + relevant tests; green/red with
   the command.
6. **Runtime mental model** — trace request → effect; flag mismatches the type
   checker can't see.
7. **Stale docs/comments** — grep for now-wrong references to renamed/removed
   names.
8. **Anti-patterns / drift** — leftover TODO/FIXME, debug logging, stale
   comments.

## Output

One line per check (`PASS|WARN|FAIL — <check> — <evidence>`), then **OVERALL:
Approve / Approve with caveats / Reject**, then a prioritized fix list if needed.

**Read-only:** never edit, commit, push, or restart. Revert any probe and
confirm `git status` is clean before finishing.

> Bundle a `checklist.md` alongside this `SKILL.md` if you want to split out the
> protocol — Skills are folders and can ship supporting files; a Command cannot.
