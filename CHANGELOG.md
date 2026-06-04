# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-06-04

### Added

- Initial release of the **Skeptic Audit** protocol: an independent,
  fresh-context audit of a coding agent's just-shipped change against a fixed
  8-point evidence checklist, including the **break-the-test probe**.
- Canonical protocol in [`AUDIT-CHECKLIST.md`](AUDIT-CHECKLIST.md).
- Claude Code plugin: `skills/skeptic-audit/` (skill) + `agents/skeptic-auditor.md`
  (independent read-only subagent) + `.claude-plugin/` manifest and marketplace.
- Cross-harness adapters for **OpenCode**, **Cursor**, **Codex CLI**, and
  **Gemini CLI**, plus a portable `AGENTS.md` fallback.
- A worked example in [`examples/worked-example.md`](examples/worked-example.md).
