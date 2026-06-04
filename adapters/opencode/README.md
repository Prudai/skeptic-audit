# Skeptic Audit — OpenCode adapter

OpenCode auto-discovers everything by file location; there is no build or
registry step.

## Install

Copy the pieces you want into your OpenCode config (global) or your repo
(project-local, committed for the team):

| Artifact | Global path | Project path |
|---|---|---|
| Skill (the protocol) | `~/.config/opencode/skills/skeptic-audit/SKILL.md` | `.opencode/skills/skeptic-audit/SKILL.md` |
| Independent subagent | `~/.config/opencode/agents/skeptic-auditor.md` | `.opencode/agents/skeptic-auditor.md` |
| Slash command (sugar) | `~/.config/opencode/commands/skeptic-audit.md` | `.opencode/commands/skeptic-audit.md` |

```sh
# project-local, from the repo root of THIS project:
mkdir -p .opencode/skills .opencode/agents .opencode/commands
cp -r adapters/opencode/skills/skeptic-audit .opencode/skills/
cp adapters/opencode/agents/skeptic-auditor.md .opencode/agents/
cp adapters/opencode/commands/skeptic-audit.md .opencode/commands/
```

## Use

- The **skill** is offered to every agent and pulled in on demand via the native
  `skill` tool when its description matches the task.
- Run the **command** in the TUI: `/skeptic-audit <claims about the change>`.
  `subtask: true` forces it into a fresh subagent context.
- Or `@skeptic-auditor` to talk to the independent subagent directly.

## Notes

- The skill **directory name must equal** the `name` frontmatter field
  (`skeptic-audit`), or it silently won't load.
- The subagent ships **read-only** (`permission.edit: deny`), so it runs check 4
  by reasoning about each test. If you want it to physically break-and-revert a
  test, change the agent to `edit: ask`.
- `model: anthropic/claude-sonnet-4-6` in `skeptic-auditor.md` is illustrative —
  set whatever model id your install lists.
- OpenCode also reads `AGENTS.md` (and `CLAUDE.md` as a fallback), so you can
  additionally drop the portable section from `adapters/portable/AGENTS.md` in
  as an always-on policy.
