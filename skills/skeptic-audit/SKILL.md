---
name: skeptic-audit
description: >-
  Run an independent, skeptical audit of a just-finished change before calling
  it done. Use after any non-trivial change — a new feature touching two or more
  files, a refactor that renames or deletes exports, a schema/config change, or
  anything where "did you remember to update X too?" is plausible. Spawns a
  fresh-context auditor that is briefed only on what was claimed and runs an
  8-point evidence checklist (including a break-the-test probe), returning
  Approve / Approve-with-caveats / Reject. This is a read-only verification gate,
  not a security scanner and not an auto-fixer.
allowed-tools: Task, Bash, Read, Grep, Glob
effort: high
---

# Skeptic Audit

You have just finished (or are reviewing) a non-trivial change. **Do not mark it
done** until an independent auditor has verified it. A self-check is not an
audit — the value comes from a *fresh context*, so the auditor runs as a
separate subagent that never saw your reasoning.

## 1. Decide scope

Identify what to audit:

- a specific **commit SHA**, or
- the current **staged / working-tree diff** (`git diff`, `git diff --staged`).

If the change is trivial and entirely local (a typo, a log tweak, a one-line fix
whose effect is unambiguous), skip the audit and say so explicitly.

## 2. Write the brief — claims only

In 3–6 lines, state the **facts** of what changed: the files touched and the
intended behavior. Do **not** include your reasoning, your uncertainty, or your
scratch notes — the auditor must form its own view from the diff.

## 3. Launch an independent auditor

Use the **Task** tool to spawn a subagent. Prefer the bundled `skeptic-auditor`
subagent (`subagent_type: "skeptic-auditor"`); if it isn't available, use a
`general-purpose` subagent. Pass it **only**:

- the repo path and the commit/diff to audit,
- your claims brief from step 2,
- the checklist below — or point it at `${CLAUDE_SKILL_DIR}/checklist.md`.

Instruct it to run **every** check and report **PASS / FAIL / WARN** with
concrete evidence. The subagent runs in a fresh context — that independence is
the entire point. Do not summarize the diff for it beyond the claims; let it
re-derive everything itself.

## 4. The checklist the auditor runs

Run every check. Report PASS / FAIL / WARN per check with concrete evidence
(`file:line`, command output, or a diff excerpt). No verdict without evidence.

1. **Diff hygiene** — only the intended files touched? size proportional to the
   stated goal? Flag drive-by edits and unrelated churn.
2. **Canonical correctness** — invariants preserved? Compare pre- vs post-change
   content of every structure touched (enums, registries, `switch` maps,
   exported symbols, config shapes, DB columns, capability tables). Watch for an
   off-by-one between an import block and the canonical list it mirrors.
3. **No dead consumers** — grep the whole repo for every renamed/deleted symbol;
   confirm every caller, import, test, and string reference was updated. One
   missed consumer is a FAIL.
4. **Test invariants — the break-the-test probe** — for each new/changed test,
   confirm it actually catches the bug it claims to. Reason it through, or make
   a temporary, immediately-reverted edit that breaks the code under test and
   confirm the test fails usefully. If no test would fail without this change,
   that is a FAIL. Restore any probe and verify `git status` is clean.
5. **Type safety & scoped tests** — run the type checker + the relevant test
   subset; report green/red with the command and output.
6. **Runtime mental model** — walk request → effect by hand; flag mismatches the
   type checker can't see (namespaced vs bare names, register-here/look-up-there,
   un-awaited async, swallowed errors).
7. **Stale documentation** — grep README/docs/comments for references to
   renamed/removed names. Out-of-date docs are at least a WARN.
8. **Anti-patterns / drift** — leftover TODO/FIXME, debug logging,
   commented-out code, comments that no longer match the code.

End with one line per check (`PASS|WARN|FAIL — <check> — <evidence>`), then
`OVERALL: Approve / Approve with caveats / Reject`.

**Hard constraints:** read-only. No commits, pushes, restarts, or destructive
commands. The only permitted mutation is the check-4 probe, which must be
reverted (confirm `git status` is clean).

## 5. Act on the verdict

- **Reject** → fix the issues and re-audit before declaring done.
- **Approve with caveats** → ship, but record each caveat as a queued follow-up.
- **Approve** → done.

The full protocol (with the classes of bug a good audit reliably catches) is in
`${CLAUDE_SKILL_DIR}/checklist.md`; a worked case is in the repo at
`examples/worked-example.md`.
