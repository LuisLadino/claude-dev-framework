#!/bin/bash
# Decodes the encoded session start file back to literal angle brackets
# Usage: ./decode-session-start.sh

INPUT_FILE="$(dirname "$0")/session-start-4.6-encoded.md"
OUTPUT_FILE="$(dirname "$0")/session-start-4.6-decoded.md"

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: $INPUT_FILE not found"
    exit 1
fi

# Replace « with < and » with >
sed 's/«/</g; s/»/>/g' "$INPUT_FILE" > "$OUTPUT_FILE"

echo "Decoded file written to: $OUTPUT_FILE"
echo "Character count: $(wc -c < "$OUTPUT_FILE")"
