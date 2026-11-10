<div align="center">

# 🛡️ opt-out

**Take back control of your personal data, in minutes.**

Generate ready-to-send GDPR and local-law requests to delete, access, or restrict your data.

[Website](https://leaklens.org) · [Registry](https://github.com/leak-lens/Registry) · [Organization](https://github.com/leak-lens)

![License](https://img.shields.io/badge/license-Apache--2.0-blue)

</div>

---

## ✨ Why opt-out

| | |
|---|---|
|  **Legally grounded** | Every template cites the statute it relies on. |
|  **Multi-jurisdiction** | GDPR, plus regional laws for local enforcement. |
|  **Zero legal knowledge needed** | Pick a region, pick an action, send. |
|  **Private by design** | Runs on your device. Your details never reach a server. |



Open `templates/`, choose your region and action (e.g. **erasure under GDPR Art. 17**), fill in your details, and send.

## 🗂️ Structure

```text
opt-out/
├── templates/
│   ├── global/   # general privacy templates
│   ├── eu/       # GDPR: erasure, access, portability
│   └── local/    # country-specific equivalents
├── src/          # generator core and UI
└── tests/        # template and form validation
```

## 🤝 Contributing

- **Templates:** link to the official law or article they rely on.
- **Code:** follow the existing lint rules and module layout in `src/`.

## 📄 License

[Apache-2.0](LICENSE) · Part of the [`leak-lens`](https://leaklens.org) civic-tech initiative.
