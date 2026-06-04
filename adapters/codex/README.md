# Skeptic Audit — OpenAI Codex CLI adapter

Codex custom prompts (`~/.codex/prompts/*.md`) are **deprecated** in favor of
**Skills** (`.agents/skills/<name>/SKILL.md`). Both are provided; prefer the
Skill for new setups.

## Install — Skill (recommended)

```sh
# user scope (all projects):
mkdir -p ~/.agents/skills
cp -r adapters/codex/skills/skeptic-audit ~/.agents/skills/

# OR repo scope (version-controlled, shared with the team), from your project root:
mkdir -p .agents/skills
cp -r adapters/codex/skills/skeptic-audit .agents/skills/
```

Use it: run `/skills` and pick `skeptic-audit`, mention `$skeptic-audit`, or let
Codex auto-select it from the description.

## Install — custom prompt (deprecated, still works)

```sh
mkdir -p ~/.codex/prompts
cp adapters/codex/prompts/skeptic-audit.md ~/.codex/prompts/
```

Invoke: `/prompts:skeptic-audit SHA=abc123 REPO=/path/to/repo` (the `prompts:`
namespace is mandatory; named args are `KEY=value`).

## Notes

- Codex Skills live under `.agents/skills/` (**not** `.codex/skills/`). The
  initial skills list is capped (~8,000 chars / ~2% of context), so keep
  descriptions tight.
- Codex also reads `AGENTS.md` from git root down to cwd — drop in the portable
  section from `adapters/portable/AGENTS.md` for an always-on policy. Keep the
  global `~/.codex/AGENTS.md` small (the chain is capped at 32 KiB).
