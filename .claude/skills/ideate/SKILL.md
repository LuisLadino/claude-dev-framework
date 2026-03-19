---
name: ideate
description: >
  Generate and evaluate approaches before committing to one. Use when: the user
  says "what are our options", "how should we", "approaches", "ideas", "what if",
  "alternatives", "brainstorm", or when the problem is defined and it's time to
  explore solutions.
allowed-tools: Read, Grep, Glob, Bash, Agent, WebSearch, WebFetch, TaskUpdate
---

# Ideate (IDEATE)

You're entering the IDEATE phase. The goal is to generate genuinely different approaches, evaluate them honestly, and converge on a direction with eyes open.

**This is where most people skip.** They see the problem and jump to the first reasonable solution. The first idea is rarely the best idea — it's just the most available one.

---

## The Method

### Generate at least three genuinely different approaches

Not three variations of the same idea. Different strategies, different trade-offs, different philosophies.

- What's the obvious approach? (Start here, but don't stop here)
- What's the opposite approach? (Invert the problem)
- What's the approach from a completely different lens? (How would a designer solve this? An engineer? A user? A business person?)
- What would you do with unlimited time? With only one hour?
- What's the approach you're avoiding? Why are you avoiding it?

### Evaluate honestly

For each approach:

- What's the actual trade-off? (Everything has a cost — name it)
- What's the effort vs. impact?
- What does this make easy? What does this make hard?
- What's the risk? What could go wrong?
- What assumptions does this approach depend on?
- How reversible is this? Can we change course later?

### Check for prior art

Before committing to an approach, see if the work is already done.

- Has this been solved before? (In this project, in other projects, in the industry)
- What can we learn from existing solutions?
- What's available to build on vs. what needs to be created?
- Is there a standard or convention for this that we should follow?

### Sit in the groan zone

The groan zone is the uncomfortable space between diverging and converging. Multiple options exist and none is clearly best. This is normal and valuable.

- Am I converging too early because the ambiguity is uncomfortable?
- Am I avoiding an option because it's harder, not because it's worse?
- What new information would make the choice clear?
- Is the tension between options revealing something about the problem we missed?

Do NOT escape the groan zone by:
- Removing requirements to make an option work
- Pretending trade-offs don't exist
- Picking the first option because "we need to move forward"
- Avoiding the hard question

### Converge with a recommendation

After genuine exploration, recommend a direction.

- Which approach best fits the constraints from DEFINE?
- Which approach best serves the Definition of Done?
- What are we giving up by choosing this? (Say it explicitly)
- What would make us change this decision later?

---

## Outputs

By the end of IDEATE, you MUST have:

1. **Options explored** — at least 3 genuinely different approaches
2. **Trade-off analysis** — honest costs and benefits of each
3. **Recommendation** — which approach and why
4. **What we're giving up** — explicit acknowledgment of trade-offs
5. **Reversal conditions** — what would make us reconsider

Present the options and recommendation to the user. This is a decision point — NEVER make it for them silently.

---

## Moving On

You're ready for BUILD when:
- Multiple approaches were genuinely considered (not rubber-stamped)
- Trade-offs are named and accepted
- The user has chosen a direction
- You know what you're building AND what you're not building

Update the GitHub issue with the decision record if it's non-trivial.
