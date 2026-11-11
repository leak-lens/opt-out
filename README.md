<div align="center">

# 🛡️ opt-out

**Take back control of your personal data, in minutes.**

Generate ready-to-send GDPR and local-law requests to delete, access, or restrict your data.

[Website](https://leaklens.org) · [Registry](https://github.com/leak-lens/Registry) · [Organization](https://github.com/leak-lens)

![License](https://img.shields.io/badge/license-Apache--2.0-blue)

</div>

---

## About

opt-out generates data protection requests based on existing legislation.

| Aspect | Description |
|---|---|
| **Legal basis** | Each template references the specific statute or article it is based on (e.g. GDPR Art. 15, 17, 20). |
| **Jurisdictions** | GDPR (EU/EEA) and selected national laws. Coverage is listed in `templates/`. |
| **Request types** | Access, erasure, portability, and opt-out requests. |
| **Data handling** | The generator runs locally. Entered data is not sent to any server. |

> This project provides templates, not legal advice. Check the cited law for your situation.


Open `templates/`, choose your region and action (e.g. **erasure under GDPR Art. 17**), fill in your details, and send.

## Structure

```text
opt-out/
├── laws/       # JSON datasets for privacy laws across jurisdictions
├── schema/     # JSON Schema definitions (law.schema.json)
├── scripts/    # validation, build, and test scripts
└── web/        # static web generator UI and letter assembly
```

## Contributing

- **Templates:** link to the official law or article they rely on.
- **Code:** follow the existing lint rules and module layout in `src/`.

## 📄 License

[Apache-2.0](LICENSE) · Part of the [`leak-lens`](https://leaklens.org) civic-tech initiative.
