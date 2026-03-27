---
name: build
description: >
  Build, implement, or create something concrete. Use when: the user says
  "let's build it", "implement", "code it", "write it", "create it", "make it",
  "draft it", or when ideation is done and it's time to make something real.
  This is the commitment point — where thinking becomes tangible.
allowed-tools: Read, Grep, Glob, Bash, Edit, Write, Agent, TaskUpdate
---

# Build (PROTOTYPE)

You're entering the PROTOTYPE phase. The goal is to make something concrete — real enough to test, evaluate, and learn from.

**This is the commitment point.** You've researched, defined, and ideated. Now you're making it tangible. For code, this is where the branch gets created. For writing, this is the first draft. For a plan, this is the concrete proposal.

---

## Before Building

### Set up for the work

If this is code work and you're on main:
```bash
# Create branch (this is the commitment point)
git checkout -b {type}/{issue-number}-short-description

# Mark issue as in progress
gh issue edit {number} --remove-label "status/backlog" --remove-label "status/ready" --add-label "status/in-progress"
```

If specs exist in `.claude/specs/`, read the ones relevant to what you're building.

### Confirm what you're building

Before starting, state:
- What you're building (from IDEATE's chosen approach)
- What the Definition of Done is (from DEFINE)
- What you're NOT building (scope boundary)
- What decisions were made (from IDEATE's decision surfacing)

If any of these are unclear, go back to the right phase. If decisions were never surfaced or accepted by the user, go back to IDEATE. Building the wrong thing fast is worse than building the right thing slow.

---

## The Method

### Work incrementally

Small pieces, each verified before moving to the next.

- What's the smallest meaningful piece I can complete?
- Can I verify this piece works before building the next?
- Am I building in an order that lets me catch problems early?
- If I stopped right now, is what I've built coherent?

### Make it real enough to test

A prototype isn't final. It needs to be good enough to answer: does this approach work?

- What's the minimum version that proves the concept?
- Am I polishing when I should be validating?
- Am I cutting corners that will make testing meaningless?
- Does this represent the chosen approach faithfully, or have I drifted?

### Stay honest about what's happening

Building reveals things that thinking can't.

- Is the approach from IDEATE actually working, or am I forcing it?
- Am I discovering new constraints I didn't see before?
- Has the problem changed now that I'm inside it?
- Am I solving a different problem than the one I defined?

If the approach isn't working, that's not failure — that's signal. Go back to the right phase:
- New constraints? → Back to DEFINE
- Approach doesn't fit? → Back to IDEATE
- Misunderstood the problem? → Back to RESEARCH

### Track what you learn

Building teaches you things. Capture them.

- What surprised you during implementation?
- What was harder or easier than expected?
- What would you do differently next time?
- What decisions did you make that aren't obvious from the output?

---

## Outputs

By the end of BUILD, you should have:

1. **Something concrete** — code, draft, plan, prototype, whatever the domain calls for
2. **Verified pieces** — each increment works on its own
3. **Build notes** — what you learned, what surprised you, what you decided along the way
4. **Ready to test** — the thing exists and can be evaluated against the Definition of Done

---

## Moving On

You're ready for TEST when:
- Something concrete exists
- It represents the chosen approach (not a drift)
- Individual pieces have been verified as you went
- You can articulate what to test it against (the DoD from DEFINE)

NEVER skip to shipping. TEST is where you find out if you actually solved the problem.
