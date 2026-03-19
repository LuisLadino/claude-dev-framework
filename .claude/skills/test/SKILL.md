---
name: test
description: >
  Verify work against the definition of done. Use when: the user says "does it
  work", "verify", "check", "test it", "review", "evaluate", or when building
  is done and it's time to validate. Also triggers iteration — if tests reveal
  problems, go back to the right phase.
allowed-tools: Read, Grep, Glob, Bash, Agent
---

# Test (TEST)

You're entering the TEST phase. The goal is to find out if what you built actually solves the problem you defined. Not "does it run" — does it WORK?

**This is where honesty matters most.** The temptation is to confirm that your work was good. The job is to find out where it isn't.

---

## The Method

### Verify against the Definition of Done

Pull the DoD from DEFINE. Check each criterion.

- Does the work actually meet each criterion? (Not "mostly" or "close enough")
- Am I testing what matters, or what's easy to test?
- If I showed this to someone who only saw the DoD, would they agree it's met?

### Check for the thing you're not looking for

Confirmation bias is the enemy of testing.

- What could go wrong that I haven't considered?
- What's the failure mode I'm most likely to miss?
- If I were trying to break this, where would I attack?
- What edge cases exist? What happens at the boundaries?
- What assumptions from DEFINE or IDEATE could be wrong?

### Verify the root cause, not the symptom

From DEFINE, you identified root cause vs. symptoms.

- Did I actually address the root cause?
- Or did I build a sophisticated patch for the symptom?
- If the root cause is still there, will this problem come back in a different form?

### Test from multiple perspectives

Use the lenses. Different perspectives see different problems.

- Does this work for the user? (UX lens)
- Does this hold up under stress or at scale? (Engineering lens)
- Does this deliver the intended value? (PM lens)
- Are there unintended consequences? (Systems Thinking lens)
- Is this ethical? Any harm potential? (Responsible AI lens, if applicable)

### Run the actual checks

Whatever verification is appropriate for the domain:

- If code: lint, type-check, tests, build, manual verification
- If writing: read it aloud, check against voice rules, test with target audience criteria
- If a plan: stress-test assumptions, check feasibility, identify gaps
- If a decision: revisit the trade-offs, check if new information changes the calculus
- If a process: walk through it end to end, look for where it breaks

Don't just run automated checks. Think about what the automated checks DON'T cover.

### Determine what you learned

Testing ALWAYS teaches something.

- What worked as expected?
- What didn't? Why?
- What would you do differently?
- Did the Definition of Done turn out to be the right bar?

---

## Iteration Decision

Based on test results, decide:

### Pass → Ready to ship
All DoD criteria met. Move to commit/ship.

### Fail with clear fix → Back to BUILD
You know what's wrong and how to fix it. Go build the fix.

### Fail with unclear cause → Back to RESEARCH
Something unexpected happened. You need to understand why before fixing.

### Wrong problem → Back to DEFINE
The work is fine but doesn't solve the actual problem. The definition needs updating.

### Wrong approach → Back to IDEATE
The approach itself doesn't work. Need a different strategy.

**Going backward is the system working.** It means you learned something. The worst outcome is passing something that should have failed.

---

## Outputs

By the end of TEST, you MUST have:

1. **Verification results** — what passed, what failed, what was surprising
2. **Iteration decision** — pass, or which phase to return to and why
3. **Learnings** — what this round taught you

If iterating, update the GitHub issue with what you learned and why you're going back.

---

## Moving On

You're ready to ship (commit) when:
- All Definition of Done criteria are verified
- You've tested from multiple angles, not just the happy path
- You're confident the root cause is addressed, not just the symptom
- Iteration decisions have been resolved

If not ready, go back to the right phase. That's not failure — that's rigor.
