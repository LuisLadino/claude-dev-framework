---
name: research
description: >
  Research and understand a problem before solving it. Use when: the user mentions
  an issue number, says "let's work on", "look into", "what's going on with",
  "research", "investigate", "explore", or indicates they want to understand
  something before acting. This is the entry point to substantive work.
allowed-tools: Read, Grep, Glob, Bash, Agent, WebSearch, WebFetch
---

# Research (UNDERSTAND)

You're entering the UNDERSTAND phase. The goal is to know what's actually going on before deciding what to do about it.

**This is the entry point to substantive work.** Whether it's a GitHub issue, a question, a problem to solve, or a thing to build — start here.

---

## Before Anything Else

If there's a GitHub issue, load it:
```bash
gh issue view {number}
```

If there's existing work (code, docs, prior decisions, closed issues on the same topic), find it. Don't research in a vacuum.

Set up design thinking tasks for this work:
```
TaskCreate: "UNDERSTAND - [problem]"
TaskCreate: "DEFINE - [problem]"
TaskCreate: "IDEATE - [problem]"
TaskCreate: "PROTOTYPE - [problem]"
TaskCreate: "TEST - [problem]"
```
Mark UNDERSTAND as in_progress.

---

## The Method

Work through these. Not as a checklist to rush through — as genuine inquiry.

### What do I actually know vs. what am I assuming?

Separate facts from assumptions. Facts have sources. Assumptions feel like facts but don't.

- What evidence do I have?
- What am I taking for granted?
- What would change my understanding if it turned out to be wrong?

### Where are the authoritative sources?

Every domain has them. Find the right ones for THIS problem.

- Documentation, specs, standards, official references?
- People who've dealt with this? (past conversations, issue history, team knowledge)
- Data, logs, metrics, direct evidence?
- Prior art — has this been solved before, here or elsewhere?
- The thing itself — can I observe the problem directly?

### Who has solved a similar problem?

Don't reinvent. Look around first.

- Similar projects, tools, products, frameworks?
- Different domains with analogous challenges?
- Competitors, alternatives, adjacent solutions?
- Industry or academic research?

### What's the vocabulary of this space?

Am I using the right terms? Wrong terminology leads to wrong searches and wrong mental models.

- What do practitioners call this?
- Am I using a term loosely that has a precise meaning?
- Would searching with different terms reveal more?

### What would change my mind?

This is the most important question. If nothing could change your mind, you're not researching — you're confirming.

- What evidence would contradict my current understanding?
- What am I not looking at because it doesn't fit my narrative?
- Have I looked at this from enough angles, or am I confirming what I already think?

### What's the full picture?

Zoom out before zooming in.

- What's the context around this problem? Why does it exist?
- Who does this affect? What do they care about?
- What are the constraints? (time, resources, technical, organizational, ethical)
- What's been tried before? Why did it work or not?

---

## Outputs

By the end of UNDERSTAND, you should be able to articulate:

1. **What's actually happening** — facts, evidence, observations
2. **What you don't know** — gaps, uncertainties, risks
3. **What surprised you** — things that challenged your initial assumptions
4. **Where to look deeper** — threads worth pulling

Share this with the user. Don't just do the research silently and jump to solutions.

---

## Moving On

You're ready for DEFINE when:
- You've done genuine research, not just confirmed what you assumed
- You can distinguish what you know from what you're guessing
- You've looked at this from multiple angles
- The user has seen your findings and had a chance to react

If this is simple enough that research is "I read the issue and it's clear" — that's fine. Not every problem needs deep research. But you MUST have actually checked, not just assumed it was simple.

Update the GitHub issue with key findings if they're worth preserving.
