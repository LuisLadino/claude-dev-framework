# Design Thinking as Operating System

Research findings on how design thinking works in practice - non-linear, fractal, rhythm-based.

---

## Core Insight: It's Rhythm, Not Sequence

Design thinking is NOT a linear process (understand → define → ideate → prototype → test). It's a **rhythm** of divergent and convergent thinking that repeats at multiple scales.

### The Double Diamond

```
PROBLEM SPACE                    SOLUTION SPACE
    ◇                                ◇
   / \                              / \
  /   \                            /   \
 / DI- \                          / DI- \
/  VER- \                        /  VER- \
\  GE   /                        \  GE   /
 \     /                          \     /
  \   /                            \   /
   \ /                              \ /
    ◇                                ◇
 CONVERGE                         CONVERGE
   on                               on
 PROBLEM                          SOLUTION
```

Each diamond: Diverge (explore widely) → Groan Zone → Converge (decide)

### The Groan Zone

The uncomfortable transition between diverging and converging:
- Feels stuck, frustrated, chaotic
- Teams want to escape (close too early OR stay open forever)
- **This is normal and valuable** - don't rush through it

---

## Non-Linear Movement

### When to Go Back

| Trigger | What Happened | Go Back To |
|---------|---------------|------------|
| Wrong problem | Testing shows users don't need this | Understand |
| New insight | Prototype reveals something unexpected | Ideate or Understand |
| Team misaligned | Wildly different directions in ideation | Define |
| Approach fails | Implementation hits fundamental blocker | Ideate |
| Requirements changed | Scope shift invalidates work | Define or Understand |

### When to Jump Ahead

| Trigger | What's Happening | Jump To |
|---------|------------------|---------|
| Build to think | Need to make abstract concrete | Prototype (to learn) |
| Obvious solution | Clear answer, needs validation | Test |
| Pattern recognition | Experienced practitioner sees the path | Appropriate phase |

---

## Fractal Nature: Same Pattern at Every Scale

Design thinking applies simultaneously at multiple levels:

| Level | Timeframe | Scope | Example |
|-------|-----------|-------|---------|
| **Macro** (Project) | Weeks-months | Entire product | "We're in prototype phase" |
| **Meso** (Feature) | Days-weeks | Single capability | "This feature is being tested" |
| **Micro** (Task) | Minutes-hours | Single task | "For this task, I need to understand first" |

### Key Principles

1. **Levels are semi-independent** - You can be in different phases at different levels
2. **Upward flow** - Micro work contributes to meso progress contributes to macro milestones
3. **Downward constraint** - Macro context shapes what's appropriate at micro level

### Example: Normal State

```
PROJECT: Prototype (building MVP)
├── FEATURE A: Test (validating)
│   └── TASK: Iterate (fixing bug found in test)
├── FEATURE B: Prototype (building)
│   └── TASK: Understand (researching implementation)
└── FEATURE C: Understand (researching approach)
```

This is healthy - features progress at different rates.

---

## Phase Signals

### Observable Indicators

| Phase | You're Here When... |
|-------|---------------------|
| **Understand** | Asking "what problem?", "who uses this?", researching, exploring |
| **Define** | Asking "how measure success?", "what's in scope?", setting boundaries |
| **Ideate** | Asking "which approach?", "what are trade-offs?", generating options |
| **Prototype** | Building, coding, creating artifacts |
| **Test** | Gathering feedback, measuring, validating |
| **Iterate** | Fixing issues, addressing feedback, refining |

### Entry Criteria

| Phase | Enter When... |
|-------|---------------|
| Understand | Problem unclear, users undefined, assumptions untested |
| Define | Problem exists but no metrics, no scope boundaries |
| Ideate | Success defined but no approach selected |
| Prototype | Approach selected, ready to build |
| Test | Something testable exists |
| Iterate | Testing revealed issues |

### Exit Criteria

| Phase | Complete When... |
|-------|------------------|
| Understand | Can state user need in one sentence, research shows patterns |
| Define | Problem actionable, scope bounded, success measurable |
| Ideate | Approach chosen, trade-offs accepted, path clear |
| Prototype | Something testable exists |
| Test | Learnings captured, next step clear |
| Iterate | Issues resolved, ready to re-test |

---

## The Diverge-Converge Rhythm

Within EACH phase, the diverge-converge pattern repeats:

1. **Diverge** - Generate options, explore widely, suspend judgment
2. **Groan Zone** - Feel the tension, resist premature closure
3. **Converge** - Apply criteria, make decisions, move forward

### Facilitator Questions

**Divergent prompts:**
- "What else?"
- "What if we couldn't use that approach?"
- "What would [different stakeholder] say?"

**Convergent prompts:**
- "Given our constraints, which options are viable?"
- "What criteria matter most?"
- "What would we need to believe for this to work?"

**Groan zone navigation:**
- "This discomfort is normal - we're between modes"
- "Let's name the tension without resolving it yet"
- "What's blocking the decision?"

---

## AI's Role: Observer, Not Director

### The Cognitive Mirror Principle

AI should help practitioners see their own process, not replace their judgment.

| Do | Don't |
|----|-------|
| "I notice we've generated options but not applied criteria" | "You should move to the next phase" |
| "There's tension between speed and validation" | "You're in the wrong phase" |
| "What would convince you the problem is understood?" | "Go back to understand" |

### Phase Evaluator Approach

1. **Observe** - What artifacts exist? What questions are being asked?
2. **Reflect** - Share observations without judgment
3. **Prompt** - Ask questions that help self-assessment
4. **Support** - Name the groan zone, normalize iteration

### Anti-Patterns

- Being prescriptive ("you should...")
- Binary phase detection (it's usually mixed)
- Triggering too often (noise vs signal)
- Rushing through groan zone
- Treating iteration as failure

---

## Sources

- [IxDF - 5 Stages of Design Thinking](https://ixdf.org/literature/article/5-stages-in-the-design-thinking-process)
- [NN/g - Design Thinking 101](https://www.nngroup.com/articles/design-thinking/)
- [Design Council - Double Diamond](https://www.designcouncil.org.uk/our-resources/framework-for-innovation/)
- [Voltage Control - Diverge and Converge](https://voltagecontrol.com/articles/the-synergy-of-diverge-and-converge-in-design-thinking/)
- [IDEO U - Design Thinking Process](https://www.ideou.com/blogs/inspiration/design-thinking-process)
- [Sid Laurea - Groan Zone](https://sidlaurea.com/2018/09/30/where-is-the-groan-zone-in-design-thinking/)
- [Frontiers - Cognitive Mirror Framework](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2025.1697554/full)
- [Cambridge - AI in Design Process](https://www.cambridge.org/core/journals/proceedings-of-the-design-society)

---

## Condensed Version (for agent context)

```
DESIGN THINKING RHYTHM

Not sequential. Diverge → Groan Zone → Converge, at every scale.

PHASES (modes, not steps):
- Understand: What's the problem? Who has it?
- Define: How do we measure success? What's in/out?
- Ideate: What approaches? What trade-offs?
- Prototype: Build something testable
- Test: Does it work? What did we learn?
- Iterate: Fix and refine

MOVEMENT:
- Go back when: wrong problem, new insight, approach fails
- Jump ahead when: need to build to think, obvious solution

FRACTAL:
- Same pattern at project, feature, and task level
- Can be in different phases at different levels

EVALUATOR ROLE:
- Observe, don't direct
- "I notice..." not "You should..."
- Name the groan zone, normalize iteration
- Ask questions, don't give answers
```
