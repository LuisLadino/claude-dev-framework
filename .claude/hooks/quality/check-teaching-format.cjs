#!/usr/bin/env node

/**
 * Check Teaching Format Hook
 *
 * Event: Stop
 * Purpose: ENFORCE the Required Response Format (Lens/Refine/Phase/Teach)
 *
 * Type: Marker-based enforcement (stateless)
 * Constraint: Claude doesn't follow format instructions reliably
 * Solution: Block responses that don't have the required structure
 *
 * Checks for: **Lens:**, **Refine:**, **Phase:**, **Teach:**
 * Exit 2 if missing (blocks response)
 * Exit 0 if present (allows)
 *
 * NO ESCAPE HATCHES. Every response needs the format. The format keeps
 * Claude grounded in design thinking framing at all times.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Required markers in response (the teaching format)
const REQUIRED_MARKERS = [
  { pattern: /\*\*Lens:\*\*/i, name: 'Lens' },
  { pattern: /\*\*Refine:\*\*/i, name: 'Refine' },
  { pattern: /\*\*Phase:\*\*/i, name: 'Phase' },
  { pattern: /\*\*Teach:\*\*/i, name: 'Teach' }
];

// Read hook input from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', async () => {
  try {
    const data = JSON.parse(input);
    await handleHook(data);
  } catch (e) {
    process.exit(0);
  }
});

async function handleHook(data) {
  const { transcript_path, stop_hook_active } = data;

  if (!stop_hook_active || !transcript_path) {
    process.exit(0);
  }

  // Read transcript to find last assistant response
  const lastResponse = await getLastAssistantResponse(transcript_path);

  if (!lastResponse) {
    process.exit(0);
  }

  // Check for required markers - NO ESCAPE HATCHES
  const missingMarkers = [];

  for (const marker of REQUIRED_MARKERS) {
    if (!marker.pattern.test(lastResponse)) {
      missingMarkers.push(marker.name);
    }
  }

  if (missingMarkers.length > 0) {
    console.error('\n[BLOCKED] Response missing required teaching format.');
    console.error('\nRequired structure (start every response with):');
    console.error('  **Lens:** [practitioner perspective]');
    console.error('  **Refine:** [prompt restated in discipline vocabulary]');
    console.error('  **Phase:** [design thinking phase]');
    console.error('  **Teach:** [concept + mechanism + discipline framings + usage examples]');
    console.error('\nMissing: ' + missingMarkers.join(', '));
    console.error('\nRegenerate your response with the teaching format.\n');
    process.exit(2); // BLOCK - enforce the format
  }

  process.exit(0);
}

async function getLastAssistantResponse(transcriptPath) {
  if (!fs.existsSync(transcriptPath)) {
    return null;
  }

  let lastAssistantText = '';

  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const entry = JSON.parse(line);
      if (entry.type === 'assistant' && entry.message?.content) {
        // Extract text from content
        let text = '';
        if (typeof entry.message.content === 'string') {
          text = entry.message.content;
        } else if (Array.isArray(entry.message.content)) {
          for (const block of entry.message.content) {
            if (block.type === 'text' && block.text) {
              text += block.text + '\n';
            }
          }
        }
        if (text) {
          lastAssistantText = text;
        }
      }
    } catch (e) {}
  }

  return lastAssistantText;
}
