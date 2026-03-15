# Claude Code Anti-Patterns

Things that don't work, common mistakes, and behavioral issues. Read this to avoid repeating known failures.

---

## Hallucination Patterns

### Making Up Tool Parameters
```yaml
# WRONG - tool_response doesn't have exit_code field
if (tool_response.exit_code !== 0) { ... }

# WRONG - Bash output doesn't include exit code
const { stdout, exitCode } = tool_response;
```

**Fix:** Check actual tool schemas. PostToolUse Bash response has: `stdout`, `stderr`, `interrupted`, `isImage`. No exit code.

### Assuming Hook Capabilities
```yaml
# WRONG - Object matchers don't work
"matcher": {"tool": "Bash", "command": "git commit"}

# WRONG - SessionEnd fires reliably
SessionEnd hook → save important state
```

**Fix:** Use string patterns. SessionEnd is unreliable (doesn't fire on terminal close). Use PreCompact for state saving.

### Inventing Configuration Options
```yaml
# WRONG - These fields don't exist
hooks:
  timeout: 5000
  retry: true
  async: true
```

**Fix:** Check actual settings.json schema. Only use documented fields.

---

## Hook Mistakes

### Exit Code Swallowing
```json
// WRONG - || true converts exit code 2 to 0
"command": "/path/to/hook.cjs || true"
```

**Fix:** Remove `|| true`. Let hook exit codes propagate.

### Using .js Instead of .cjs
```javascript
// In package.json
"type": "module"

// FAILS - .js treated as ES module
const fs = require('fs');
```

**Fix:** Use `.cjs` extension for hooks. CommonJS works regardless of package.json.

### PostToolUse for Failed Commands
```javascript
// WRONG - PostToolUse doesn't fire on failure
PostToolUse → log all command results
```

**Fix:** PostToolUse only fires on success. Use PostToolUseFailure for failures.

---

## Skill Mistakes

### Relying on Natural Language Triggering
```yaml
# User says "commit this"
# Expected: commit skill triggers
# Actual: ~20% trigger rate
```

**Fix:** Use hook enforcement. Block direct commands, require Skill tool invocation.

### Missing SKILL_ACTIVE Bypass
```javascript
// Hook blocks git commit
// Skill tries to git commit
// BLOCKED - skill can't work
```

**Fix:** Skills use marker: `SKILL_ACTIVE=1 git commit`. Hook checks for marker before blocking.

### Description Without Trigger Phrases
```yaml
# BAD
description: Commits code

# GOOD
description: >
  Commit and create PR. Use when: the user says "commit", "let's commit",
  "save this", "checkpoint", "done", "ready to merge".
```

---

## Agent Mistakes

### Missing Frontmatter
```markdown
# Context Agent

You are the Context Agent...
```

Agent doesn't load. No error message.

**Fix:** Always include frontmatter:
```yaml
---
name: context-agent
description: What it does
tools: Read, Grep
model: sonnet
---
```

### Wrong Tool Access
```yaml
tools: Read, Grep

# Agent tries to:
Write to file → FAILS
Run Bash command → FAILS
```

**Fix:** List all needed tools in frontmatter.

---

## Behavioral Issues

### Pattern Matching Instead of Thinking
```
User: "How does X work?"
Claude: [Generates plausible-sounding explanation without checking]
```

**Fix:** Before claiming facts: Did I read the code? Did I check the docs? If not, say "I don't know" or investigate.

### Confident Tone Without Evidence
```
"This will work because..." [without verification]
"The standard pattern is..." [without checking context7]
```

**Fix:** Show proof. File path and line number for claims. Command output for verifications.

### Deflecting on Corrections
```
User: "Why did you do X wrong?"
Claude: "I apologize, I'll do better next time."
```

**Fix:** Analyze actual cause. Identify specific fix. "I'll do better" means nothing without what to change.

### Ignoring Session Context
```
SessionStart provides: identity, task, learnings
Claude: "What project is this?" [Already in context]
```

**Fix:** Read session context before asking questions. Check learnings before repeating mistakes.

---

## File Operation Mistakes

### Editing Without Reading
```
Edit(file_path: "x.ts", old_string: "...", new_string: "...")
# ERROR - Must read file first
```

**Fix:** Always Read before Edit/Write.

### Using Bash for File Operations
```bash
# WRONG
cat file.txt
echo "content" > file.txt
sed -i 's/old/new/g' file.txt
grep pattern file.txt
find . -name "*.ts"
```

**Fix:** Use dedicated tools: Read, Write, Edit, Grep, Glob.

### Relative Paths
```
Edit(file_path: "./src/index.ts", ...)
# ERROR - Must be absolute
```

**Fix:** Use absolute paths: `/Users/user/project/src/index.ts`

---

## Workflow Mistakes

### Committing Without Skill
```bash
git commit -m "message"
# Should use commit skill for:
# - version-control.md compliance
# - CHANGELOG update
# - Push + PR + auto-merge
```

**Fix:** Invoke `Skill(skill: "commit")`. Hook enforcement blocks direct commits.

### Coding Without /start-task
```
User: "Let's discuss the feature"
[Discussion leads to implementation]
Claude: [Writes code without loading specs]
```

**Fix:** Before writing code, load specs. enforce-specs hook blocks edits until specs are read.

### Skipping Steps
```
User: "Implement X"
Claude: [Writes code immediately without understanding existing patterns]
```

**Fix:** Research first. Read existing code. Check specs. Then implement.

---

## Communication Mistakes

### Over-Validation
```
"You're absolutely right!"
"Great catch!"
"Exactly!"
```

**Fix:** Don't use validation phrases. Be direct and objective.

### Time Estimates
```
"This will take about 5 minutes"
"It's a quick fix"
```

**Fix:** Never give time estimates. Focus on what needs to be done.

### Using Emojis
```
"Let me check that! 🔍"
"Fixed! ✅"
```

**Fix:** No emojis unless user explicitly requests them.

---

## Remember

1. **Verify before claiming** - Read code, check docs, run commands
2. **Use correct formats** - Check specs for exact schemas
3. **Follow enforcement** - Hooks exist for reasons
4. **Learn from failures** - Check learnings.md before repeating mistakes
5. **Be honest about gaps** - "I don't know" beats hallucination
