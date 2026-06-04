# Contributing to skeptic-audit

Thanks for your interest! This project is small and opinionated. The most useful
contributions are: a new harness adapter, a real-world bug-class the checklist
misses, or a wording fix that makes a check sharper.

## The one rule that matters: keep the protocol in sync

[`AUDIT-CHECKLIST.md`](AUDIT-CHECKLIST.md) is the **single source of truth**. The
checklist text is duplicated (on purpose — each harness needs a native file) in:

- `skills/skeptic-audit/SKILL.md` and `skills/skeptic-audit/checklist.md`
- `agents/skeptic-auditor.md`
- every adapter under `adapters/` (OpenCode, Cursor, Codex, Gemini, portable)

If you change a check, **change `AUDIT-CHECKLIST.md` first**, then update the
copies so they don't drift. A change that touches the protocol but not all the
mirrors is exactly the kind of "forgotten consumer" this tool exists to catch —
so run a skeptic audit on your own PR.

## Adding a harness adapter

1. Add `adapters/<harness>/` with the native artifact(s) and a short `README.md`
   that gives copy-paste install steps and the harness's format gotchas.
2. Keep the checklist text identical to `AUDIT-CHECKLIST.md`.
3. Link it from the install table in the root `README.md`.

## Style

- Commits: `type(scope): message` (e.g. `feat(cursor): add rule adapter`).
- Keep descriptions trigger-shaped ("Use after…"), not title-shaped.
- No vendor lock-in claims; this is a single-vendor, read-only protocol.

## Reporting

Open an issue with the template. For "the checklist missed X", a minimal
reproduction of the change and the bug it should have caught is gold.
