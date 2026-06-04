# skeptic-audit

**A skeptical second agent that audits what your coding agent just built — before you ship it.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Works with: Claude Code · OpenCode · Cursor · Codex · Gemini](https://img.shields.io/badge/works%20with-Claude%20Code%20·%20OpenCode%20·%20Cursor%20·%20Codex%20·%20Gemini-blue.svg)](#install)

Coding agents are confident. They finish a refactor, say "type checks pass,"
and move on — while a renamed export still has one stringly-typed consumer two
files away and the new test would pass even if the change were wrong. The agent
that wrote the code is the worst-placed reviewer of it: it reviews from the same
mental model that produced the bug.

`skeptic-audit` is a small, opinionated protocol that runs an **independent,
fresh-context auditor** over a just-finished change. The auditor is briefed on
**only what was claimed** — never the implementer's reasoning — and runs a fixed
**8-point evidence checklist**, including a **break-the-test probe**, returning
**Approve / Approve-with-caveats / Reject** with `file:line` evidence for every
check.

> A self-check is not an audit. The value comes entirely from a fresh context.

## How it's different

| Tool type | What it does | What `skeptic-audit` does instead |
|---|---|---|
| Security scanners | Hunt for vulnerabilities in a diff | Verify **correctness & integrity** of an agent's own feature |
| Auto-fixers | Find bugs and patch them | **Read-only.** It returns a verdict; you fix |
| Second-vendor passes | Use a different model/API for fresh eyes | **Single-vendor.** Independence comes from a fresh subagent + claims-only briefing |
| Generic "review this" personas | Freeform review | A **deterministic rubric** with a mandatory **break-the-test probe** |

The genuinely differentiated mechanics are the **break-the-test probe** (a test
that can't fail isn't coverage) and the **claims-only briefing** (the auditor
re-derives everything from the diff). Everything else in the space agrees that
"fresh context catches more" — this pins down *how*.

## The 8-point checklist

Every check reports **PASS / FAIL / WARN** with concrete evidence:

1. **Diff hygiene** — only the intended files touched, size proportional?
2. **Canonical correctness** — invariants preserved (enums, registries, schemas,
   exports, config shapes); no off-by-one between an import block and the list it
   mirrors?
3. **No dead consumers** — every renamed/deleted symbol's callers updated?
4. **Test invariants — the break-the-test probe** — would any test actually fail
   if the change were wrong?
5. **Type safety & scoped tests** — typecheck + relevant tests green?
6. **Runtime mental model** — request → effect traced by hand; mismatches the
   type checker can't see?
7. **Stale documentation** — docs/comments referencing renamed/removed names?
8. **Anti-patterns / drift** — leftover TODO/FIXME, debug logging, stale
   comments?

Full protocol: [`AUDIT-CHECKLIST.md`](AUDIT-CHECKLIST.md). A worked case:
[`examples/worked-example.md`](examples/worked-example.md).

## When to run it

After any **non-trivial** change — a feature touching ≥2 files, a refactor that
renames/deletes exports, a schema/config-shape change, or anything where *"did
you remember to update X too?"* is plausible. **Skip** trivial, entirely-local
one-line edits.

## Install

This repo *is* a Claude Code plugin, and it ships native adapters for four other
harnesses.

### Claude Code

Install the plugin from this repo's marketplace:

```
/plugin marketplace add Prudai/skeptic-audit
/plugin install skeptic-audit@prudai
```

Then run `/skeptic-audit:skeptic-audit` (or just `/skeptic-audit` if you instead
copy the skill folder to `.claude/skills/`). It spawns the bundled
`skeptic-auditor` subagent — a read-only, fresh-context reviewer.

> Prefer no marketplace? Copy `skills/skeptic-audit/` into `.claude/skills/` and
> `agents/skeptic-auditor.md` into `.claude/agents/`.

### Other harnesses

| Harness | Adapter | Invoke |
|---|---|---|
| **OpenCode** | [`adapters/opencode/`](adapters/opencode/) | `/skeptic-audit` or `@skeptic-auditor` |
| **Cursor** | [`adapters/cursor/`](adapters/cursor/) | `/skeptic-audit` |
| **OpenAI Codex CLI** | [`adapters/codex/`](adapters/codex/) | `/skills` → `skeptic-audit` |
| **Google Gemini CLI** | [`adapters/gemini/`](adapters/gemini/) | `/skeptic-audit` |
| **Anything else** | [`adapters/portable/`](adapters/portable/) (`AGENTS.md`) | "run the Skeptic Audit section of AGENTS.md" |

Each adapter folder has a `README.md` with copy-paste install steps and that
harness's format gotchas.

## Quickstart

After your agent finishes a change, in the same session:

```
/skeptic-audit  Renamed PaymentStatus.PENDING → AWAITING_CAPTURE in payment.ts,
updated stateMachine.ts, added payment.test.ts. Type checks pass.
```

The auditor re-derives the diff, runs all 8 checks, and might come back with:

```
FAIL — 3. No dead consumers — refundController.ts:84 still compares against the
       string "pending"; the rename made that branch dead.
FAIL — 4. Test invariants — broke the state-machine transition and the new test
       still passed; it guards the enum's spelling, not the behavior. Reverted.
OVERALL: Reject
```

See the full walkthrough in [`examples/worked-example.md`](examples/worked-example.md).

## Why we built this

[PrudAI](https://prudai.com) builds legal-AI products on Claude, where output has
to be trustworthy enough to put in front of lawyers. We run an independent audit
on our own coding agents' work as a matter of course — the discipline caught a
class of "looks done, isn't" bug often enough that we standardized it. This is
that discipline, generalized and open-sourced.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The one rule: `AUDIT-CHECKLIST.md` is the
source of truth — keep the adapter copies in sync.

## License

[MIT](LICENSE) © 2026 PrudAI.

## Trademarks

Claude Code is a product of Anthropic; Codex of OpenAI; Gemini CLI of Google;
Cursor of Anysphere; OpenCode of its respective authors. This is an independent,
unaffiliated project that interoperates with those tools. All trademarks belong
to their owners.
