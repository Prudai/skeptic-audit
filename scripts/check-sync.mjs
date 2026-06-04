#!/usr/bin/env bun
// Sync + integrity check for skeptic-audit.
//
// Enforces the "single source of truth" invariant the whole project is built on:
// every full mirror of the checklist embeds all 8 numbered checks, the manifests
// parse with their required fields, and no internal/private reference leaks.
//
// This is the project eating its own dog food — it is exactly the "forgotten
// consumer" / "drift" class the audit checklist warns about.
//
// Run: `bun scripts/check-sync.mjs` (also runs unchanged under Node).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const ok = (m) => console.log(`  ok  ${m}`);
const fail = (m) => {
  errors.push(m);
  console.log(`FAIL  ${m}`);
};
const read = (p) => readFileSync(join(root, p), "utf8");

// 1. JSON manifests parse + minimal required fields.
for (const f of [".claude-plugin/plugin.json", ".claude-plugin/marketplace.json"]) {
  try {
    JSON.parse(read(f));
    ok(`${f} parses`);
  } catch (e) {
    fail(`${f} invalid JSON: ${e.message}`);
  }
}
try {
  const m = JSON.parse(read(".claude-plugin/marketplace.json"));
  if (!m.name) fail("marketplace.json missing name");
  if (!m.owner?.name) fail("marketplace.json missing owner.name");
  if (!Array.isArray(m.plugins) || m.plugins.length === 0)
    fail("marketplace.json missing plugins[]");
  else
    for (const p of m.plugins)
      if (!p.name || !p.source)
        fail(`marketplace plugin missing name/source: ${JSON.stringify(p)}`);

  const pj = JSON.parse(read(".claude-plugin/plugin.json"));
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(pj.name || ""))
    fail(`plugin.json name not kebab-case: ${pj.name}`);
  ok("manifest required fields present");
} catch {
  /* JSON parse error already reported above */
}

// 2. Gemini TOML structural check (no TOML dep needed).
{
  const t = read("adapters/gemini/commands/skeptic-audit.toml");
  if (!/^\s*prompt\s*=/m.test(t)) fail("gemini toml missing `prompt` key");
  else ok("gemini toml has prompt key");
}

// 3. THE CORE INVARIANT — every full mirror embeds all 8 numbered checks.
//    (Delegator files that point at the skill instead of re-embedding the list
//     are intentionally excluded: opencode agent/command, cursor rule.)
const FULL_MIRRORS = [
  "AUDIT-CHECKLIST.md",
  "skills/skeptic-audit/SKILL.md",
  "skills/skeptic-audit/checklist.md",
  "agents/skeptic-auditor.md",
  "adapters/opencode/skills/skeptic-audit/SKILL.md",
  "adapters/cursor/commands/skeptic-audit.md",
  "adapters/cursor/skills/skeptic-audit/SKILL.md",
  "adapters/codex/skills/skeptic-audit/SKILL.md",
  "adapters/codex/prompts/skeptic-audit.md",
  "adapters/gemini/commands/skeptic-audit.toml",
  "adapters/portable/AGENTS.md",
];
for (const f of FULL_MIRRORS) {
  const body = read(f);
  const found = new Set();
  for (const m of body.matchAll(/^\s{0,3}([1-8])\.\s/gm)) found.add(Number(m[1]));
  const missing = [1, 2, 3, 4, 5, 6, 7, 8].filter((n) => !found.has(n));
  if (missing.length) fail(`${f} missing checklist items: ${missing.join(",")}`);
  else ok(`${f} has all 8 checks`);
}

// 4. No internal/private references leak into the public repo.
const FORBIDDEN =
  /ADR-0001|platform-backend|platform-api|OpenBao|bao-fetch|005090f|SearchPucTool|rag-vps|status-vps|kv\/prod|beefy-rag/;
const SCAN = [
  ...FULL_MIRRORS,
  "README.md",
  "CONTRIBUTING.md",
  "CHANGELOG.md",
  "examples/worked-example.md",
  ".claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
];
let leaks = 0;
for (const f of SCAN) {
  const hit = read(f).match(FORBIDDEN);
  if (hit) {
    fail(`${f} contains forbidden internal reference: ${hit[0]}`);
    leaks++;
  }
}
if (leaks === 0) ok("no internal/private leaks in scanned files");

// Result.
console.log("");
if (errors.length) {
  console.error(`✗ ${errors.length} problem(s) found`);
  process.exit(1);
}
console.log("✓ all sync + integrity checks passed");
