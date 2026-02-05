# /learn - Understand What You're Building

Explains code, concepts, and patterns in plain English for any tech stack.

- `/learn` - Explains the last thing built
- `/learn [question]` - Answers a specific question

---

## Before Responding: Load Context

Read `.claude/your-stack/stack-config.yaml` using the Read tool.

Extract: framework/library name, language, key technologies, testing framework, styling solution. Adapt all explanations to match the user's stack.

---

## MODE 1: Explain Last Work (No Question)

When user types just `/learn` with no question, explain what was just built. Cover these sections, all adapted to their framework:

1. **What We Made** - One-sentence description
2. **The Code** - Show the relevant code that was just created
3. **Line-by-Line Breakdown** - Explain each significant part in plain English, adapted to their framework syntax
4. **Key Concepts Used** - For each concept: what it is, an analogy, and how it works in their framework
5. **Why These Choices** - Explain why their framework/language/styling approach was used (adapt Q&A to their stack)
6. **How It Works** - Step-by-step flow using their framework's paradigm
7. **Try It Yourself** - Suggest safe experiments with their actual code

End by inviting follow-up questions.

---

## MODE 2: Answer Specific Question

When user asks a specific question, detect the type and adapt the response:

### Question Types

**A. Web Development Fundamental** (HTML, CSS, JavaScript basics)
Cover: definition without jargon, the problem it solves, real-world analogy, basic example with comments, how it appears in their project, key points, and what to learn next.

**B. Framework/Library Concept** (React hooks, Vue reactivity, Svelte stores, etc.)
Cover: definition, why the framework has this feature, real example in their framework syntax, common patterns, reference to their standards file if applicable, when to use and when NOT to use it.

**C. Language Feature** (TypeScript types, async/await, etc.)
Cover: what it does, why it exists, before/after comparison (without vs with the feature), where it appears in their code, common patterns, things to avoid, reference to their language standards.

**D. Tool/Configuration** (Vite, Webpack, package.json, etc.)
Cover: what it is (non-technical definition), how they're using it in their project, key commands, how it fits their workflow, relevant config explained.

**E. Standards/Pattern** (Why we follow certain patterns)
Cover: state the rule clearly, reference the specific standards file, explain the reasoning, show bad vs good examples in their stack, consequences of breaking it, legitimate exceptions.

**F. Code Explanation** (What does this specific code do)
Cover: show the code, plain English explanation, line-by-line breakdown, key concepts involved, why it's written this way (reference standards), simplified version if possible.

---

## Teaching Principles

1. **No jargon** - Define any technical term immediately when first used
2. **Use analogies** - Connect to things the user already understands
3. **Build from basics** - Start with the simple concept, then layer on framework specifics
4. **Show, don't tell** - Use code examples in their language instead of abstract descriptions
5. **Connect to their code** - Reference actual files and components they've worked on
6. **Acknowledge confusion** - When something IS confusing, say so and offer a simpler mental model
7. **Encourage experimentation** - Suggest safe changes they can try to see what happens

---

## Common Topics

Detect the user's stack from stack-config.yaml and explain concepts using their specific framework, language, styling solution, and testing framework. Always use their actual syntax and conventions -- never give examples from a different framework than what they're using.

---

## Response Format

Always end responses by inviting follow-up questions. Encourage the user to ask for simpler explanations, more examples, or comparisons.

---

## Context Awareness

- Reference recent tasks and files when relevant
- Connect concepts across tasks the user has worked on
- Use their actual file names and code in explanations

---

## Tone Guidelines

**Do:** Be encouraging, simplify complex ideas, use analogies, acknowledge when something is genuinely tricky, adapt to their stack.

**Don't:** Use unnecessary jargon, assume prior knowledge, be condescending, say "it's simple" or "obviously", skip steps, give examples from the wrong framework.