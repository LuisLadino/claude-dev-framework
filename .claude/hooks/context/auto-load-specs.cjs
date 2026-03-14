#!/usr/bin/env node

/**
 * Auto-Load Specs Hook
 *
 * Event: PreToolUse (Edit|Write)
 * Purpose: Automatically load relevant specs when editing code files
 *
 * The goal: No /start-task needed. When you're about to write code,
 * specs are loaded automatically based on file type and stack-config.yaml.
 */

const fs = require('fs');
const path = require('path');

/**
 * Simple YAML parser for stack-config.yaml
 * Only handles the specific structure we need (specs arrays)
 */
function parseStackConfig(content) {
  const config = {
    stack: {},
    specs: {
      coding: [],
      architecture: [],
      config: [],
      design: []
    }
  };

  const lines = content.split('\n');
  let currentSection = null;
  let currentCategory = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (trimmed.startsWith('#') || trimmed === '') continue;

    // Detect sections
    if (trimmed === 'stack:') {
      currentSection = 'stack';
      continue;
    }
    if (trimmed === 'specs:') {
      currentSection = 'specs';
      continue;
    }
    if (trimmed === 'project:' || trimmed === 'quality:') {
      currentSection = null;
      continue;
    }

    // Parse stack section
    if (currentSection === 'stack' && trimmed.includes(':')) {
      const [key, ...valueParts] = trimmed.split(':');
      let value = valueParts.join(':').trim();
      // Remove inline comments
      value = value.replace(/#.*$/, '').trim();
      // Remove quotes
      value = value.replace(/^["']|["']$/g, '');
      if (value) {
        config.stack[key.trim()] = value;
      }
    }

    // Parse specs section
    if (currentSection === 'specs') {
      // Category header (e.g., "coding:" or "  coding:")
      if (trimmed.endsWith(':') && !trimmed.startsWith('-')) {
        currentCategory = trimmed.replace(':', '').trim();
        if (!config.specs[currentCategory]) {
          config.specs[currentCategory] = [];
        }
        continue;
      }

      // Array item (e.g., "- typescript-specs" or "    - version-control")
      if (trimmed.startsWith('-') && currentCategory) {
        const value = trimmed.replace(/^-\s*/, '').trim();
        if (value && !value.startsWith('#')) {
          config.specs[currentCategory].push(value);
        }
      }
    }
  }

  return config;
}

// File extensions that are "code" and need specs
const CODE_EXTENSIONS = {
  // JavaScript/TypeScript
  '.js': ['coding'],
  '.ts': ['coding'],
  '.jsx': ['coding', 'design'],
  '.tsx': ['coding', 'design'],
  '.mjs': ['coding'],
  '.cjs': ['coding'],

  // Python
  '.py': ['coding'],

  // Styles
  '.css': ['design'],
  '.scss': ['design'],
  '.sass': ['design'],

  // Config (might need config specs)
  '.json': ['config'],
  '.yaml': ['config'],
  '.yml': ['config'],

  // Tests
  '.test.js': ['coding', 'config'],
  '.test.ts': ['coding', 'config'],
  '.spec.js': ['coding', 'config'],
  '.spec.ts': ['coding', 'config'],
};

// Files/paths to ignore (not code, or internal)
const IGNORE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /\.claude\/hooks/,        // Don't load specs when editing hooks
  /session-changes\.json/,
  /package-lock\.json/,
  /yarn\.lock/,
  /pnpm-lock\.yaml/,
];

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
  const filePath = tool_input?.file_path;

  if (!filePath) {
    process.exit(0);
  }

  // Check if should ignore
  for (const pattern of IGNORE_PATTERNS) {
    if (pattern.test(filePath)) {
      process.exit(0);
    }
  }

  // Get file extension (handle compound extensions like .test.ts)
  const ext = getExtension(filePath);
  const specCategories = CODE_EXTENSIONS[ext];

  if (!specCategories) {
    // Not a code file, don't load specs
    process.exit(0);
  }

  // Load stack config
  const cwd = process.cwd();
  const stackConfigPath = path.join(cwd, '.claude/specs/stack-config.yaml');

  let stackConfig = null;
  try {
    const content = fs.readFileSync(stackConfigPath, 'utf8');
    stackConfig = parseStackConfig(content);
  } catch (e) {
    // No stack config, can't load specs
    console.log('[SPECS] No stack-config.yaml found. Run /sync-stack to set up specs.');
    process.exit(0);
  }

  // Collect relevant specs based on file type and stack config
  const specsToLoad = [];
  const specsDir = path.join(cwd, '.claude/specs');

  for (const category of specCategories) {
    const configSpecs = stackConfig.specs?.[category] || [];

    for (const specName of configSpecs) {
      const specPath = path.join(specsDir, category, `${specName}.md`);
      if (fs.existsSync(specPath)) {
        try {
          const specContent = fs.readFileSync(specPath, 'utf8');
          specsToLoad.push({
            name: specName,
            category,
            content: specContent
          });
        } catch (e) {
          // Skip if can't read
        }
      }
    }
  }

  if (specsToLoad.length === 0) {
    // No specs configured for this file type
    const stackInfo = stackConfig.stack?.framework
      ? `Stack: ${stackConfig.stack.framework}`
      : 'Stack not configured';
    console.log(`[SPECS] Editing ${ext} file. ${stackInfo}. No specific specs loaded.`);
    console.log(`[SPECS] Run /sync-stack to generate specs for your stack.`);
    process.exit(0);
  }

  // Output specs for Claude to see
  console.log(`[SPECS AUTO-LOADED] Editing ${ext} file. Loading ${specsToLoad.length} spec(s):\n`);

  for (const spec of specsToLoad) {
    console.log(`--- ${spec.category}/${spec.name} ---`);
    // Truncate very long specs to avoid overwhelming output
    const maxLength = 2000;
    if (spec.content.length > maxLength) {
      console.log(spec.content.substring(0, maxLength));
      console.log(`\n... [truncated, full spec at .claude/specs/${spec.category}/${spec.name}.md]`);
    } else {
      console.log(spec.content);
    }
    console.log('');
  }

  console.log('[SPECS] Follow these patterns in your edit.');

  process.exit(0);
}

function getExtension(filePath) {
  // Handle compound extensions like .test.ts, .spec.js
  const basename = path.basename(filePath);

  if (basename.includes('.test.')) {
    const match = basename.match(/\.test\.[^.]+$/);
    if (match) return match[0];
  }
  if (basename.includes('.spec.')) {
    const match = basename.match(/\.spec\.[^.]+$/);
    if (match) return match[0];
  }

  return path.extname(filePath);
}
