#!/usr/bin/env node
// Smoke test: every law x request type x language must produce a clean letter.
const fs = require("fs");
const path = require("path");
const Letter = require("../web/letter.js");

const lawsDir = path.join(__dirname, "..", "laws");
const laws = fs.readdirSync(lawsDir).filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(lawsDir, f), "utf8")));

let count = 0;
const problems = [];
for (const law of laws) {
  for (const type of Object.keys(law.types)) {
    const langs = Letter.availableLangs(law, type);
    if (!langs.includes("en")) problems.push(`${law.id}/${type}: no English letter`);
    for (const lang of langs) {
      const filled = Letter.buildLetter({ law, type, lang, name: "Test User", email: "t@example.com", company: "Example Ltd", accountId: "u123", details: "extra", date: "2026-11-10" });
      const empty = Letter.buildLetter({ law, type, lang, date: "2026-11-10" });
      count++;
      if (/undefined|null|\[object/.test(filled)) problems.push(`${law.id}/${type}/${lang}: bad token in letter`);
      if (!filled.includes("Test User") || !filled.includes("Example Ltd")) problems.push(`${law.id}/${type}/${lang}: name/company missing`);
      if (!/\[.+\]/.test(empty)) problems.push(`${law.id}/${type}/${lang}: placeholders missing when fields are empty`);
    }
  }
}
console.log(`Generated ${count} letters from ${laws.length} laws.`);
if (problems.length) {
  console.log(problems.join("\n"));
  process.exit(1);
}
console.log("All good.");
