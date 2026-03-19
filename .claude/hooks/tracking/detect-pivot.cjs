#!/usr/bin/env node

/**
 * Pivot Detection Hook
 *
 * Event: PostToolUse (Bash)
 * Purpose: Detects dependency or structural changes and prompts for /sync-stack
 *
 * Language-agnostic. Catches:
 * - Package install commands (Node, Python, Rust, Go, Ruby, PHP, Java)
 * - Config file modifications (any language)
 * - New directory creation that may indicate structural changes
 */

// Read hook input from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    handleHook(data);
  } catch (e) {
    process.exit(0);
  }
});

function handleHook(data) {
  const { tool_input } = data;
  const command = tool_input?.command;

  if (!command) {
    process.exit(0);
  }

  // --- Dependency install commands (any language) ---
  const installPatterns = [
    // Node
    /npm\s+(install|i|add)\b/i,
    /yarn\s+(add|install)\b/i,
    /pnpm\s+(add|install|i)\b/i,
    /bun\s+(add|install|i)\b/i,
    // Python
    /pip\s+install\b/i,
    /pip3\s+install\b/i,
    /uv\s+(pip\s+install|add)\b/i,
    /poetry\s+add\b/i,
    /pdm\s+add\b/i,
    // Rust
    /cargo\s+add\b/i,
    // Go
    /go\s+get\b/i,
    /go\s+install\b/i,
    // Ruby
    /gem\s+install\b/i,
    /bundle\s+add\b/i,
    // PHP
    /composer\s+require\b/i,
    // Java/Kotlin
    /gradle\s+.*dependencies/i,
    /mvn\s+.*dependency/i,
    // Swift
    /swift\s+package\s+add/i,
    // .NET
    /dotnet\s+add\s+package/i
  ];

  // --- Config file modifications ---
  const configPatterns = [
    // Editing dependency/config files directly
    />\s*(package\.json|Cargo\.toml|go\.mod|Gemfile|requirements\.txt|pyproject\.toml|composer\.json|build\.gradle|pom\.xml)/i,
    // Writing to config files
    /cat\s+.*>\s*(tsconfig|tailwind\.config|vite\.config|next\.config|nuxt\.config|svelte\.config|astro\.config|webpack\.config|rollup\.config|eslint\.config|prettier\.config|jest\.config|vitest\.config|\.env)/i
  ];

  // --- Structural changes ---
  const structurePatterns = [
    // Creating new top-level or src-level directories
    /mkdir\s+(-p\s+)?(src\/|packages\/|apps\/|backend|frontend|server|client|api|workers|lib|shared|services|infra|deploy)/i
  ];

  const isInstall = installPatterns.some(p => p.test(command));
  const isConfigChange = configPatterns.some(p => p.test(command));
  const isStructuralChange = structurePatterns.some(p => p.test(command));

  if (isInstall) {
    console.error('\n[PIVOT DETECTED] Dependencies changed.');
    console.error('Consider running /sync-stack to update specs and system map.\n');
  }

  if (isConfigChange) {
    console.error('\n[PIVOT DETECTED] Config file modified.');
    console.error('Specs may be stale. Consider running /sync-stack.\n');
  }

  if (isStructuralChange) {
    console.error('\n[PIVOT DETECTED] New project structure created.');
    console.error('Consider running /sync-stack to generate component specs and update the system map.\n');
  }

  process.exit(0);
}
