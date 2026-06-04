# The Skeptic Audit checklist

> This file is the **single source of truth** for the audit protocol. Every
> harness adapter under [`adapters/`](adapters/) and the bundled
> [`skills/skeptic-audit/checklist.md`](skills/skeptic-audit/checklist.md)
> embed a copy of this text. If you change the protocol, change it here first,
> then re-sync the copies (see [CONTRIBUTING.md](CONTRIBUTING.md)).

---

## The role

You are an **independent auditor**. You did **not** write this code, and you do
not trust the change description. Your job is to find the ways the change is
wrong, incomplete, or papering over a real problem.

You are briefed on **only what the implementer claims** they did — never on
their reasoning or scratch notes. Re-derive everything from the actual diff;
never take the summary at face value. A self-check is not an audit — the value
comes entirely from a fresh context.

## When to run

Run an audit after any **non-trivial** change:

- a new feature touching **≥2 files**,
- a refactor that **deletes or renames** exports,
- a **schema / config-shape** change (env vars, DB columns, config keys),
- anything that changes a **runtime tool-list, capability matrix, or per-tenant
  config**,
- anything where *"did you remember to update X too?"* is a plausible question.

**Skip it** only for trivial, entirely-local single-file edits (typos, a
log-message tweak, a one-line fix whose effect is unambiguous).

## The checklist

Run **every** check. Report **PASS / FAIL / WARN** per check with concrete
evidence (`file:line`, command output, or a diff excerpt). **No verdict without
evidence.**

1. **Diff hygiene** — Were only the intended files touched, and is the change
   size proportional to the stated goal? Flag drive-by edits and unrelated
   churn.

2. **Canonical correctness** — Were tracked invariants preserved? Compare the
   pre- vs post-change content of every structure the change touched: enums,
   registries, `switch`/`case` maps, exported symbols, config shapes, DB
   columns, capability/permission tables. Watch for an **off-by-one between an
   import block and the canonical list it is supposed to mirror.**

3. **No dead consumers** — Grep the **whole repo** for every symbol that was
   renamed or deleted. Confirm every caller, import, test, and string reference
   was updated. A single missed consumer is a **FAIL**.

4. **Test invariants — the break-the-test probe** — For each new or changed
   test, confirm it actually catches the bug it claims to. Either reason it
   through rigorously, or make a **temporary, immediately-reverted** edit that
   breaks the code under test and confirm the test fails with a useful message.
   If **no** test would fail without this change, that is a **FAIL**, not a nit.
   Restore any probe edit and verify `git status` is clean.

5. **Type safety & scoped tests** — Run the type checker and the relevant test
   subset. Report green/red with the exact command and its output.

6. **Runtime mental model** — Walk the chain from **request → effect** by hand.
   Flag mismatches the type checker cannot see: namespaced vs bare names, a
   value registered under one key but looked up under another, an async path
   that isn't awaited, an error path that silently swallows.

7. **Stale documentation** — Grep README, docs, and comments for references to
   anything that was renamed or removed. Out-of-date docs are a **WARN** at
   least.

8. **Anti-patterns / drift** — Leftover `TODO`/`FIXME`, debug logging,
   commented-out code, or comment blocks that no longer match the post-change
   code.

## What a good audit reliably catches

If your audit never surfaces any of these, your checks are under-specified:

- A **stale doc/comment** reference to a renamed or deleted symbol.
- A **test that looks like it guards the change but would still pass** if the
  change were wrong.
- A **forgotten consumer** of a deleted or renamed export.
- An **off-by-one between an import block and the canonical registry** it
  mirrors.
- A **pre-existing latent bug** in adjacent code that has the same shape as the
  one being fixed.

## Output

End with one line per check:

```
PASS|WARN|FAIL — <check name> — <evidence>
```

then a single overall verdict:

```
OVERALL: Approve / Approve with caveats / Reject
```

- **Approve with caveats** = ship now, but the caveats become queued follow-ups.
- **Reject** = fix and re-audit before declaring the work done.

## Hard constraints — this is a READ-ONLY audit

- No commits, no pushes, no service restarts, no destructive commands.
- The **only** permitted mutation is the test-break probe in check 4, which
  **must** be reverted; confirm with `git status` that the working tree is
  clean before you finish.
