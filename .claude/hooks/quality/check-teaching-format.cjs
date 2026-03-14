#!/usr/bin/env node

/**
 * Check Teaching Format Hook
 *
 * Event: Stop
 * Purpose: Check if response followed the Required Response Format
 *
 * Post-hoc notification - flags violations after they happen.
 * Reads transcript, checks for [Design Thinking:] and [Concept:] markers.
 * If missing, outputs a warning for awareness.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Required markers in response
const REQUIRED_MARKERS = [
  /\[Design Thinking:/i,
  /\[Concept:/i
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

  // Check for required markers
  const missingMarkers = [];

  for (const marker of REQUIRED_MARKERS) {
    if (!marker.test(lastResponse)) {
      missingMarkers.push(marker.source);
    }
  }

  if (missingMarkers.length > 0) {
    console.log('\n[FORMAT CHECK] Response missing required teaching structure:');
    if (!/\[Design Thinking:/i.test(lastResponse)) {
      console.log('  - Missing [Design Thinking: PHASE] - Where are we in the cycle?');
    }
    if (!/\[Concept:/i.test(lastResponse)) {
      console.log('  - Missing [Concept: NAME] - What discipline/concept applies?');
    }
    console.log('\nNext response: Apply the Required Response Format before executing.\n');
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
