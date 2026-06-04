# Worked example: the latent orphan a skeptic audit catches

This is a small, fictional-but-typical case that shows why a fresh-context audit
beats a self-check. No real codebase is involved — the shapes are generic.

## The change

An agent is asked to rename a payment-status enum value across a TypeScript
service: `PaymentStatus.PENDING` → `PaymentStatus.AWAITING_CAPTURE`. It reports:

> "Renamed the enum value, updated the state machine that consumes it, and added
> a test asserting the new value exists. Type checks pass."

That sounds complete, and a self-review by the same agent agrees — it is looking
at the same three files it just edited, with the same mental model that produced
them.

## The brief the auditor receives (claims only)

> Repo: `./`. Audit the working-tree diff.
> Claim: renamed `PaymentStatus.PENDING` → `AWAITING_CAPTURE` in `payment.ts`,
> updated `stateMachine.ts`, added `payment.test.ts`. Type checks pass.

The auditor is **not** told *how* the agent reasoned, only *what* it claims. It
re-derives everything from the diff.

## What the audit finds

```
PASS — 1. Diff hygiene — 3 files touched (payment.ts, stateMachine.ts,
       payment.test.ts), all in scope; no unrelated churn.

PASS — 2. Canonical correctness — enum + state-machine map updated consistently.

FAIL — 3. No dead consumers — `rg '"pending"'` finds refundController.ts:84
       still doing `if (payment.status === "pending")` — a STRINGLY-TYPED
       comparison the type checker can't see. After the rename the value is
       "awaiting_capture", so this branch is now dead and refunds silently never
       trigger. Forgotten consumer.

FAIL — 4. Test invariants (break-the-test probe) — payment.test.ts only asserts
       `PaymentStatus.AWAITING_CAPTURE === "awaiting_capture"`. Temporarily
       broke the state-machine transition (returned the wrong next state); the
       test still PASSED. The test guards the enum's spelling, not the behavior
       that was supposed to change. Reverted the probe; `git status` clean.

WARN — 5. Type safety & scoped tests — `tsc --noEmit` green; `vitest run
       payment` green (but see check 4 — green here is not reassuring).

PASS — 6. Runtime mental model — request → effect traced; the only break is the
       string comparison in check 3.

WARN — 7. Stale documentation — docs/payments.md still lists "pending" as a
       status in the lifecycle table.

PASS — 8. Anti-patterns / drift — no leftover TODO/FIXME or debug logging.

OVERALL: Reject

Fix list (priority order):
1. refundController.ts:84 — compare against PaymentStatus.AWAITING_CAPTURE (and
   prefer the enum over a string literal so this can't recur).
2. payment.test.ts — add a test that asserts the state-machine transition, so a
   wrong transition fails. (A test that can't fail isn't a test.)
3. docs/payments.md — update the lifecycle table.
```

## Why the self-check missed it

- The type checker was green because the dead consumer used a **string literal**,
  not the enum — exactly the class of bug check 3's repo-wide grep is for.
- The new test **looked** like coverage but couldn't fail. Only the
  **break-the-test probe** (check 4) exposes a toothless test.
- The implementer's own context ("I changed three files and they pass") is the
  wrong context to verify from. The auditor's fresh, claims-only briefing is what
  makes it look at `refundController.ts` and `docs/` at all.

This is the whole thesis: *a self-check is not an audit.*
