# Skeptic Audit — Cursor adapter

Cursor offers three mechanisms; ship the **Command** for the simplest thing that
works today, or the **Skill** for maximum longevity (Cursor is steering Commands
→ Skills).

## Install

```sh
# from the repo root of YOUR project:
mkdir -p .cursor/commands .cursor/rules
cp adapters/cursor/commands/skeptic-audit.md .cursor/commands/
cp adapters/cursor/rules/skeptic-audit.mdc  .cursor/rules/      # optional
# future-proof alternative to the command:
mkdir -p .cursor/skills
cp -r adapters/cursor/skills/skeptic-audit .cursor/skills/
```

Commit `.cursor/` so the whole team gets it. For a personal/global command,
put `skeptic-audit.md` in `~/.cursor/commands/` instead.

## Use

- **Command:** open Agent chat, type `/`, pick `skeptic-audit`.
- **Skill:** invoke with `/skeptic-audit` or attach with `@`.
- **Rule** (`.cursor/rules/skeptic-audit.mdc`): Agent-Requested mode — Cursor
  pulls it in automatically when you ask it to review/audit a change.

## Notes (gotchas the format imposes)

- Rules **must** use the `.mdc` extension — a plain `.md` in `.cursor/rules/` is
  silently ignored.
- Commands are **plain markdown**; the filename (minus `.md`) is the command
  name. No frontmatter required.
- The same files work in Cursor's CLI agent (`cursor-agent`), not just the
  editor.
- Use `AGENTS.md` (root) for always-on policy; it is not a place for an
  invokable command.
