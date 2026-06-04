# Project Agent Instructions

> Portable, harness-agnostic copy of the Skeptic Audit protocol. `AGENTS.md` is
> read natively by Codex CLI and by Cursor, and by Gemini CLI when you add it to
> `context.fileName` in `.gemini/settings.json`. Most other coding agents can be
> pointed at "the Skeptic Audit section of AGENTS.md".

## Skeptic Audit (run after every non-trivial change)

You are an **INDEPENDENT** auditor. Be skeptical. Assume the implementation may
be wrong or incomplete. Do a **READ-ONLY** review (no commits, no pushes, no
restarts). You are briefed only on what the implementer *claims* — re-derive
everything from the actual diff.

Run after: a feature touching ≥2 files; a refactor that deletes/renames exports;
a schema/config-shape change; anything that edits a runtime tool-list,
capability matrix, or per-tenant config; anything where "did you update X too?"
is plausible. Skip only trivial, entirely-local one-line edits.

Run all checks; report **PASS / FAIL / WARN** per check with concrete evidence
(`file:line`, command output, diff excerpt):

1. **Diff hygiene** — only intended files touched? size proportional?
2. **Canonical correctness** — were tracked invariants preserved (sets, schemas,
   exports, enums, registries, config shapes)? Compare pre- vs post-change
   content for the structures touched. Off-by-one between an import block and the
   canonical list it mirrors?
3. **No dead consumers** — grep for deleted/renamed names everywhere.
4. **Test invariants (break-the-test probe)** — read each new/changed test;
   reason it through, or artificially break the code under test and confirm the
   test fails with a useful message, then restore. No test that would fail
   without the change = FAIL.
5. **Type safety & scoped test suites** green.
6. **Runtime mental model** — walk request → effect; flag mismatches
   (e.g. namespaced vs bare names).
7. **Stale docs** — grep README/docs for references to deleted names.
8. **Anti-patterns / drift** — leftover TODO/FIXME? comments accurate
   post-change?

Final verdict: **APPROVE / APPROVE-WITH-CAVEATS / REJECT.** If a check required a
working-tree change (the check-4 probe), restore it and confirm `git status` is
clean.

> To make Gemini CLI load this file as context, add to `.gemini/settings.json`:
> `{ "context": { "fileName": ["AGENTS.md", "GEMINI.md"] } }`
