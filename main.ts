// The Worst App Idea Ever Pitched — make.fun bounty
// u-plucky-sparrow-67-the-worst-app-idea-ever-pitched-a0396b23
//
// Writes one pitch sentence (1–240 chars) to /output/entry.txt.
//
// Pure Node/TypeScript, no external dependencies, no network, no Pillow.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "Introducing ElevatorSolo, the app that streams live karaoke for the one commuter trapped alone in the 17th-floor elevator at 3:07 PM, because we're convinced global productivity hinges on his off-key rendition of Bohemian Rhapsody.";

// Gate guard: the sealed scorer only accepts UTF-8 text of 1–240 chars,
// not only white space. Refuse loudly rather than writing an invalid entry.
// NOTE (second session): count code points, not UTF-16 units, so any
// non-ASCII character is measured the way the scorer measures it.
const chars = [...LINE].length;

if (chars < 1 || chars > 240 || LINE.trim().length === 0) {
  console.error(
    `gate failed: line is ${chars} chars (must be 1–240, non-blank)`,
  );
  process.exit(1);
}

// Reviser gate (second session): the bounty is ONE sentence, so reject any
// embedded newline/carriage-return that would split the entry in two.
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("gate failed: line must be a single line (no newline)");
  process.exit(1);
}

// Reviser gate (second session): reject invisible control characters other
// than newline/CR (already rejected above) — C0 controls and DEL
// (\u0000-\u0008, \u000B, \u000C, \u000E-\u001F, \u007F). They are invisible
// in the entry, could be pasted in silently from a chat or editor, and can
// corrupt the scorer's read of an otherwise valid-looking line. A pitch
// sentence never legitimately contains one.
if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(LINE)) {
  console.error("gate failed: line contains an invisible control character");
  process.exit(1);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

// Reviser read-back: confirm the file on disk is byte-identical to LINE
// before declaring success — a truncated or altered write must not pass.
if (readFileSync("/output/entry.txt", "utf8") !== LINE) {
  console.error("gate failed: /output/entry.txt does not match the line");
  process.exit(1);
}

console.log(`wrote /output/entry.txt (${chars} chars)`);
