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

**CI enforces this.** [`.github/workflows/sync-check.yml`](.github/workflows/sync-check.yml)
runs [`scripts/check-sync.mjs`](scripts/check-sync.mjs) on every push and PR. It
fails if any full mirror is missing one of the 8 checks, if a manifest doesn't
parse, or if an internal/private reference leaks. Run it locally with
`bun scripts/check-sync.mjs` before opening a PR. If you add a full-embed mirror,
add it to the `FULL_MIRRORS` list in that script.

## Design note: the auditor's edit posture

The protocol is **read-only**, with exactly one permitted mutation — the check-4
break-the-test probe, which must be reverted (`git status` clean). The adapters
take two equivalent stances on enforcing that:

- The **Claude Code** subagent (`agents/skeptic-auditor.md`) grants `Edit` but
  its prompt scopes it strictly to the revertible probe.
- The **OpenCode** subagent ships `permission.edit: deny`, so it runs check 4 by
  reasoning rather than a physical break-and-revert (flip to `edit: ask` if you
  want the literal probe).

Both honor the same read-only contract; they differ only in whether enforcement
is by prompt or by permission. Keep that contract intact in any new adapter.

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
