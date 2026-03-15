#!/usr/bin/env node

/**
 * Test: Can command hooks spawn claude -p and capture output?
 *
 * Run manually first: node .claude/hooks/test/test-agent-spawn.cjs
 * Then test as hook if manual test passes.
 */

const { execSync } = require('child_process');

const PROMPT = `You are a test agent. Respond with exactly this JSON and nothing else:
{"status": "ok", "message": "Agent spawn works", "timestamp": "${new Date().toISOString()}"}`;

console.log('[TEST] Spawning claude -p...');

try {
  const start = Date.now();

  const result = execSync(
    `claude -p --output-format json "${PROMPT.replace(/"/g, '\\"')}"`,
    {
      encoding: 'utf8',
      timeout: 30000,  // 30 second timeout
      maxBuffer: 1024 * 1024  // 1MB buffer
    }
  );

  const elapsed = Date.now() - start;

  console.log(`[TEST] Response received in ${elapsed}ms`);
  console.log('[TEST] Raw output:', result.substring(0, 500));

  // Try to parse as JSON
  try {
    const parsed = JSON.parse(result);
    console.log('[TEST] Parsed JSON:', JSON.stringify(parsed, null, 2));
    console.log('[TEST] SUCCESS - Agent spawn works!');
  } catch (parseErr) {
    console.log('[TEST] Output is not JSON, but command succeeded');
    console.log('[TEST] This is expected - claude -p returns text by default');
  }

} catch (err) {
  console.error('[TEST] FAILED:', err.message);
  if (err.stderr) {
    console.error('[TEST] stderr:', err.stderr);
  }
  process.exit(1);
}
