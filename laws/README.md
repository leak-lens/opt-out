# How to add a law or a country

One law = one file: `laws/<id>.json`. The format is defined in `schema/law.schema.json`. Validate with `npm run build`.

## Rules (important)

1. **Verify every article number and deadline against the official text** (parliament, regulator, or official legal portal) and put the link in `sources`. Wikipedia and blogs are not sources.
2. Not sure about an article number? Write `cite` without it (for example `the Law on Personal Data`) and set `status: "needs-review"`.
3. Not sure about a deadline? Set `deadline.days` to `null` and write "see the law" in the text.
4. Only add request types the law actually grants. No portability right means no `portability` block.
5. The English letter (`en`) is mandatory. Add a local-language letter only if the language is allowed by `letterLangs` in the schema and you are confident in its quality.
6. `status`: `official` only if everything is verified against `sources`; `needs-review` if in doubt; `generic` for countries without a data protection law.
7. `authorities` (where to complain) must come from the regulator's official website.

## Minimal example

```json
{
  "id": "xx-example",
  "name": "Example Act (Exampleland)",
  "law": "Example Data Protection Act 2020",
  "jurisdictions": ["XX"],
  "letterLangs": ["en"],
  "deadline": { "days": 30, "text": "30 days", "citation": "Section 12" },
  "authorities": { "XX": { "name": "Example DPA", "url": "https://dpa.example.org" } },
  "types": {
    "access": {
      "cite": { "en": "Section 8 of the Example Data Protection Act 2020" },
      "text": { "en": "Please confirm whether you process my personal data and provide me with a copy of it." }
    }
  },
  "sources": [{ "title": "Official text", "url": "https://example.org/act.pdf" }],
  "status": "official",
  "checkedOn": "2026-11-10"
}
```
