# Skeptic Audit — portable `AGENTS.md` fallback

`AGENTS.md` is the cross-tool standard for agent instructions. Use this when your
harness isn't one of the four with a dedicated adapter, or when you want the
audit as an **always-on policy** rather than an explicitly-invoked command.

## Install

Copy the **Skeptic Audit** section from [`AGENTS.md`](AGENTS.md) into your
project's root `AGENTS.md` (or use the file as-is if you don't have one):

```sh
cp adapters/portable/AGENTS.md ./AGENTS.md     # if you have none yet
```

## Who reads `AGENTS.md`

- **Codex CLI** — natively, from git root down to cwd.
- **Cursor** — natively, at root and nested (more-specific overrides parent).
- **Gemini CLI** — when you add it to `context.fileName` in
  `.gemini/settings.json`.
- **Most other agents** — can be told "run the Skeptic Audit section of
  AGENTS.md".

## Trade-off

An `AGENTS.md` section is always-on prose context, not an on-demand, independent
subagent. For the strongest version of the protocol — a *fresh-context* auditor
briefed only on the claims — prefer a harness adapter that supports a subagent
(Claude Code's `skeptic-auditor`, OpenCode's `mode: subagent`).
