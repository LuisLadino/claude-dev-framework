---
name: define
description: >
  Define the problem precisely before solving it. Use when: the user says
  "what are we actually solving", "scope this", "root cause", "what's the real
  problem", "narrow this down", "definition of done", or when research is done
  and it's time to get precise about the problem.
allowed-tools: Read, Bash
---

# Define (DEFINE)

You're entering the DEFINE phase. The goal is to name the problem precisely — root causes, not symptoms — and set clear boundaries for what success looks like.

**This is where vague becomes specific.** Most bad solutions come from solving the wrong problem. This phase prevents that.

---

## The Method

### Separate symptoms from root causes

The thing someone notices is rarely the thing that's wrong.

- What's the observable symptom?
- Why is that happening? (Ask why multiple times)
- If I fixed this symptom, would the underlying problem still exist?
- Am I solving a cause or patching an effect?

### Write a problem statement

One to three sentences. If you can't state it concisely, you don't understand it yet.

- What's wrong or missing?
- Who does it affect?
- What's the impact of NOT solving it?

Test it: Would someone unfamiliar with the context understand the problem from this statement alone?

### Set the Definition of Done

What does success look like? Be specific enough to verify.

- How will we KNOW this is solved? What's the evidence?
- What's in scope and what's explicitly out?
- What's the minimum outcome that would be acceptable?
- What's the stretch outcome if things go well?

If you can't define done, you can't define the problem.

### Identify constraints and boundaries

Every problem lives inside constraints. Name them.

- What CAN'T change? (technical, organizational, time, budget, ethical)
- What's negotiable vs. fixed?
- What dependencies exist?
- What's the blast radius — what else gets affected by this change?

### Challenge the framing

The most dangerous assumption is that we're solving the right problem.

- Is this the highest-leverage problem to solve right now?
- Are we solving what's urgent or what's important?
- Would a different framing open up better solutions?
- Who defined this as the problem? What's their perspective? What might they be missing?
- Is this actually multiple problems pretending to be one?

---

## Outputs

By the end of DEFINE, you MUST have:

1. **Problem statement** — concise, precise, testable
2. **Root cause** — not symptoms
3. **Definition of Done** — how we'll know it's solved
4. **Scope boundaries** — what's in and what's out
5. **Constraints** — what we're working within

Present these to the user. Get alignment before moving on. Misalignment here costs the most.

---

## Moving On

You're ready for IDEATE when:
- The problem statement is specific (not "make it better")
- Root cause is identified (not symptom)
- Definition of Done exists and is verifiable
- The user agrees this is the right problem to solve

Update the GitHub issue with the problem definition if it's evolved from the original.
