#!/usr/bin/env node
// Validates law files against schema/law.schema.json plus a few cross-field rules.
// Usage: node scripts/validate.js [file ...]   (no args = all files in laws/)
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const root = path.join(__dirname, "..");
const lawsDir = path.join(root, "laws");
const schema = JSON.parse(fs.readFileSync(path.join(root, "schema", "law.schema.json"), "utf8"));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

function checkFile(file) {
  const errors = [];
  const full = path.resolve(file);
  let law;
  try {
    law = JSON.parse(fs.readFileSync(full, "utf8"));
  } catch (e) {
    return ["invalid JSON: " + e.message];
  }
  if (!validate(law)) {
    for (const err of validate.errors) errors.push(`${err.instancePath || "/"} ${err.message}`);
  }
  if (law && law.id && law.id !== path.basename(full, ".json")) {
    errors.push(`id "${law.id}" must equal the file name "${path.basename(full, ".json")}"`);
  }
  if (law && law.authorities && Array.isArray(law.jurisdictions)) {
    for (const k of Object.keys(law.authorities)) {
      if (!law.jurisdictions.includes(k)) errors.push(`authority key "${k}" is not listed in jurisdictions`);
    }
  }
  if (law && Array.isArray(law.letterLangs) && law.types) {
    if (!law.letterLangs.includes("en")) errors.push('letterLangs must include "en"');
    for (const [type, t] of Object.entries(law.types)) {
      for (const lang of law.letterLangs) {
        const hasCite = t.cite && t.cite[lang];
        const hasText = t.text && t.text[lang];
        if (lang === "en" && (!hasCite || !hasText)) errors.push(`types.${type} is missing English cite/text`);
        if (lang !== "en" && (hasCite !== undefined) !== (hasText !== undefined)) {
          errors.push(`types.${type} has "${lang}" cite without text (or vice versa)`);
        }
      }
    }
  }
  return errors;
}

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(lawsDir).filter((f) => f.endsWith(".json")).map((f) => path.join(lawsDir, f));

let failed = 0;
for (const f of files) {
  const errs = checkFile(f);
  if (errs.length) {
    failed++;
    console.log(`FAIL ${path.relative(root, path.resolve(f))}`);
    errs.forEach((e) => console.log("  - " + e));
  } else {
    console.log(`ok   ${path.relative(root, path.resolve(f))}`);
  }
}
if (failed) process.exit(1);
