// scripts/generate_til.js

const LOG_DIR = "../logs";

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dayName(d) {
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

// ISO week number
function isoWeekNumber(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

const today = new Date();
const dateStr = formatDate(today);
const fileName = `${dateStr}.md`;
const filePath = `${LOG_DIR}/${fileName}`;

await Deno.mkdir(LOG_DIR, { recursive: true });

try {
  await Deno.stat(filePath);
  console.log(`TIL for today already exists: ${filePath}`);
  Deno.exit(0);
} catch {
  // File does not exist → continue
}

const template = `---
date: ${dateStr}
day: ${dayName(today)}
week: ${isoWeekNumber(today)}
tags:
  - javascript
  - til
  - learning
topics:
  - 
mood: 
---

# Today I Learned

Write **1–3 concrete things** you understood better today.

- What *clicked* today?
- What changed in your understanding?
- What would you explain differently now?

---

# Still Confusing

List **up to 3 things** that are still unclear.

- What almost makes sense but doesn’t fully?
- What would you like to see one more example of?
- What feels fragile in your understanding?

---

# Questions to Chase

Write **2–5 questions** worth pursuing later.

Rules:
- Questions must be specific
- Avoid yes/no questions

- “Why does X behave differently when Y?”
- “What breaks if I remove Z?”
- “How does this scale / fail / degrade?”

---

# Tiny Experiments (Optional)

Small things you want to try tomorrow or later.

- A REPL experiment
- A minimal snippet
- A variation of today’s code

---

# One-Sentence Summary

Finish this sentence:

> Today was useful because **______**.
`;

await Deno.writeTextFile(filePath, template);

console.log(`Created TIL log: ${filePath}`);
