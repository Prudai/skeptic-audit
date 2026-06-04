# Skeptic Audit — Google Gemini CLI adapter

Gemini CLI uses **TOML** custom commands.

## Install

```sh
# global (all projects):
mkdir -p ~/.gemini/commands
cp adapters/gemini/commands/skeptic-audit.toml ~/.gemini/commands/

# OR project-scoped (version-controlled), from your project root:
mkdir -p .gemini/commands
cp adapters/gemini/commands/skeptic-audit.toml .gemini/commands/
```

Then in the CLI run `/commands reload` (no restart needed).

## Use

```
/skeptic-audit <optional: claims about the change, or a SHA + path>
```

If you omit arguments, the command audits the current working tree.

## Notes

- Command files **must** be `.toml`; `prompt` is the only required field.
- A subdirectory namespaces the command: `.gemini/commands/audit/skeptic.toml`
  → `/audit:skeptic`.
- `{{args}}` injects raw user input; inside `!{...}` shell blocks it is escaped
  and the shell run requires confirmation.
- For an always-on policy instead of an explicit command, add the portable
  `AGENTS.md` to `context.fileName` in `.gemini/settings.json`:
  `{ "context": { "fileName": ["AGENTS.md", "GEMINI.md"] } }`.
