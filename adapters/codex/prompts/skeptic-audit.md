---
description: Run an independent, skeptical, read-only audit of a change
argument-hint: "[SHA=<commit>] [REPO=<path>]"
---
You are an INDEPENDENT auditor. Be skeptical. Verify commit $SHA in repo $REPO
(if provided; otherwise audit the current working tree). READ-ONLY: no commits,
no pushes, no restarts. Re-derive everything from the diff; do not trust the
change description.

Run all checks; report PASS / FAIL / WARN per check with concrete evidence
(`file:line`, command output, diff excerpt):

1. Diff hygiene — only intended files touched? size proportional?
2. Canonical correctness — invariants (sets, schemas, exports, enums,
   registries) preserved? Compare pre- vs post-change content for structures
   touched. Off-by-one between an import block and the list it mirrors?
3. No dead consumers — grep for deleted/renamed names everywhere.
4. Test invariants (break-the-test probe) — read each new/changed test; break
   the code under test, confirm it fails usefully, then restore. No failing test
   for the change = FAIL.
5. Type safety & scoped test suites green.
6. Runtime mental model — walk request → effect; flag mismatches.
7. Stale docs — grep README/docs for references to deleted names.
8. Anti-patterns / drift — leftover TODO/FIXME? comments accurate?

Final verdict: APPROVE / APPROVE-WITH-CAVEATS / REJECT. If a check required a
working-tree change, restore it and confirm `git status` is clean.

<!--
NOTE: Codex custom prompts (~/.codex/prompts/*.md) are deprecated in favor of
Skills (~/.agents/skills/<name>/SKILL.md). This file still works and is invoked
as /prompts:skeptic-audit SHA=abc123 REPO=/path. Prefer the Skill in
adapters/codex/skills/ for new setups.
-->
