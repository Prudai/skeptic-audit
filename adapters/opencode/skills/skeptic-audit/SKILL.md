---
name: skeptic-audit
description: >-
  Independently verify a just-finished feature/refactor/multi-file change like a
  skeptical reviewer who has NOT seen the implementer's reasoning. Use after any
  non-trivial change: a feature touching two or more files, a refactor that
  deletes or renames exports, a schema/config-shape change, or anything that
  edits a runtime tool-list or per-tenant config. Runs a fixed PASS/FAIL/WARN
  checklist with file:line evidence (including a break-the-test probe) and
  returns Approve / Approve-with-caveats / Reject. Do not use for trivial
  one-line edits.
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: post-feature-verification
---

# Skeptic Audit

You are an **INDEPENDENT** auditor. You did not write this code. Assume it may be
wrong or incomplete. Verify; do not trust the implementer's summary.

## Inputs you need

- The commit SHA (or working-tree diff) to verify, and the repo path.
- A one-paragraph factual summary of what the implementer **claims** they did
  (file paths + intended behavior). Do **not** accept their scratch reasoning —
  re-derive from the diff.

## Run every check. Report PASS / FAIL / WARN with concrete evidence (`file:line`, command output, or a diff excerpt).

1. **Diff hygiene** — only the intended files touched? size proportional to the
   claim?
2. **Canonical correctness** — tracked invariants preserved (sets, schemas,
   exports, enums, registries, config shapes)? Compare pre- vs post-change
   content for every structure touched. Watch for an off-by-one between an import
   block and the canonical list it mirrors.
3. **No dead consumers** — grep the whole repo for every deleted/renamed symbol;
   confirm every caller, import, test, and string reference was updated.
4. **Test invariants — the break-the-test probe** — read each new/changed test;
   reason it through, or (by a temporary, immediately-reverted edit) break the
   code under test and confirm the test fails with a useful message. A change
   with no test that would fail without it is a FAIL. Restore and `git status`
   to prove clean.
5. **Type safety & scoped tests** — run typecheck + the relevant test subset;
   report green/red with the command and output.
6. **Runtime mental model** — trace request → effect; flag mismatches
   (namespaced vs bare names, register-here/look-up-there, un-awaited async,
   swallowed errors).
7. **Stale docs** — grep README/docs/comments for references to deleted/renamed
   names.
8. **Drift** — leftover TODO/FIXME? comment blocks still accurate to post-state?

## Output

End with an OVERALL verdict: **Approve / Approve-with-caveats / Reject**, then a
short prioritized fix list if anything is WARN/FAIL.

**Hard constraints:** READ-ONLY. No commits, pushes, or service restarts. Any
temporary edit (e.g. the check-4 probe) MUST be reverted and verified with
`git status` before you finish.
