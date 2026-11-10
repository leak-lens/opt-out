/* Letter builder. Works in the browser (window.Letter) and in Node (require). */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Letter = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var REQUEST_TYPES = {
    access: "Access to my data",
    erasure: "Erasure of my data",
    rectification: "Correction of my data",
    portability: "Data portability (a copy in a reusable format)",
    objection: "Objection to processing / marketing",
    withdraw: "Withdrawal of consent",
  };

  /* Wording that frames the letter in each supported language. */
  var PHRASES = {
    en: {
      to: "To",
      companyPlaceholder: "[company name]",
      namePlaceholder: "[your full name]",
      subject: function (t) { return "Data subject request: " + t; },
      typeLabels: {
        access: "access to personal data",
        erasure: "erasure of personal data",
        rectification: "rectification of personal data",
        portability: "data portability",
        objection: "objection to processing",
        withdraw: "withdrawal of consent",
      },
      greeting: "Dear Data Protection Officer / Privacy Team,",
      intro: function (name, cite) {
        return "I am writing as the data subject, " + name + ", exercising my rights under " + cite + ".";
      },
      account: function (id) { return "Account / identifier: " + id; },
      details: "Additional details:",
      deadline: function (citation) {
        return "Please respond within the period set by law" + (citation ? " (" + citation + ")" : "") +
          ". If you need to verify my identity, please tell me what is strictly necessary rather than requesting more than needed.";
      },
      refuse: "If you refuse any part of this request, please explain the legal grounds and tell me how to complain to the supervisory authority.",
      close: "Sincerely,",
      contact: function (email) { return "Contact: " + email; },
    },
    ru: {
      to: "Кому",
      companyPlaceholder: "[название компании]",
      namePlaceholder: "[ваше полное имя]",
      subject: function (t) { return "Запрос субъекта персональных данных: " + t; },
      typeLabels: {
        access: "предоставление информации об обработке данных",
        erasure: "уничтожение персональных данных",
        rectification: "уточнение персональных данных",
        portability: "переносимость данных",
        objection: "возражение против обработки",
        withdraw: "отзыв согласия на обработку",
      },
      greeting: "Уважаемые коллеги,",
      intro: function (name, cite) {
        return "Я, " + name + ", как субъект персональных данных обращаюсь к вам на основании " + cite + ".";
      },
      account: function (id) { return "Учётная запись / идентификатор: " + id; },
      details: "Дополнительные сведения:",
      deadline: function () {
        return "Прошу ответить в сроки, установленные законом. Для подтверждения личности прошу запрашивать только действительно необходимые сведения.";
      },
      refuse: "В случае отказа в удовлетворении запроса, полностью или частично, прошу указать правовые основания и порядок обжалования.",
      close: "С уважением,",
      contact: function (email) { return "Контакт: " + email; },
    },
    az: {
      to: "Kimə",
      companyPlaceholder: "[şirkətin adı]",
      namePlaceholder: "[tam adınız]",
      subject: function (t) { return "Fərdi məlumat subyektinin müraciəti: " + t; },
      typeLabels: {
        access: "fərdi məlumatlara çıxış",
        erasure: "fərdi məlumatların məhv edilməsi",
        rectification: "fərdi məlumatların düzəldilməsi",
        portability: "məlumatların daşınması",
        objection: "emala etiraz",
        withdraw: "razılığın geri götürülməsi",
      },
      greeting: "Hörmətli həmkarlar,",
      intro: function (name, cite) {
        return "Mən, " + name + ", fərdi məlumat subyekti kimi " + cite + " əsasən sizə müraciət edirəm.";
      },
      account: function (id) { return "Hesab / identifikator: " + id; },
      details: "Əlavə məlumat:",
      deadline: function () {
        return "Xahiş edirəm, qanunla müəyyən edilmiş müddətdə cavab verəsiniz. Şəxsiyyətimi təsdiq etmək üçün yalnız həqiqətən zəruri məlumatları tələb edin.";
      },
      refuse: "Müraciətin tam və ya qismən rədd edilməsi halında, xahiş edirəm, hüquqi əsasları və şikayət qaydasını bildirəsiniz.",
      close: "Hörmətlə,",
      contact: function (email) { return "Əlaqə: " + email; },
    },
    tr: {
      to: "Kime",
      companyPlaceholder: "[şirket adı]",
      namePlaceholder: "[tam adınız]",
      subject: function (t) { return "Kişisel veri sahibi başvurusu: " + t; },
      typeLabels: {
        access: "kişisel verilere erişim",
        erasure: "kişisel verilerin silinmesi",
        rectification: "kişisel verilerin düzeltilmesi",
        portability: "veri taşınabilirliği",
        objection: "işlemeye itiraz",
        withdraw: "rızanın geri alınması",
      },
      greeting: "Sayın Yetkili,",
      intro: function (name, cite) {
        return "Ben, " + name + ", ilgili kişi olarak " + cite + " kapsamındaki haklarımı kullanarak başvuruda bulunuyorum.";
      },
      account: function (id) { return "Hesap / tanımlayıcı: " + id; },
      details: "Ek bilgiler:",
      deadline: function () {
        return "Lütfen kanunda öngörülen süre içinde yanıt veriniz. Kimliğimi doğrulamanız gerekiyorsa yalnızca kesinlikle gerekli bilgileri isteyiniz.";
      },
      refuse: "Talebin tamamen veya kısmen reddedilmesi halinde, lütfen hukuki dayanağı ve denetim otoritesine şikâyet yolunu bildiriniz.",
      close: "Saygılarımla,",
      contact: function (email) { return "İletişim: " + email; },
    },
    uk: {
      to: "Кому",
      companyPlaceholder: "[назва компанії]",
      namePlaceholder: "[ваше повне ім'я]",
      subject: function (t) { return "Запит суб'єкта персональних даних: " + t; },
      typeLabels: {
        access: "доступ до персональних даних",
        erasure: "видалення персональних даних",
        rectification: "виправлення персональних даних",
        portability: "переносимість даних",
        objection: "заперечення проти обробки",
        withdraw: "відкликання згоди",
      },
      greeting: "Шановні колеги,",
      intro: function (name, cite) {
        return "Я, " + name + ", як суб'єкт персональних даних звертаюся до вас на підставі " + cite + ".";
      },
      account: function (id) { return "Обліковий запис / ідентифікатор: " + id; },
      details: "Додаткові відомості:",
      deadline: function () {
        return "Прошу відповісти у строки, встановлені законом. Для підтвердження особи прошу запитувати лише справді необхідні відомості.";
      },
      refuse: "У разі відмови в задоволенні запиту, повністю або частково, прошу вказати правові підстави та порядок оскарження.",
      close: "З повагою,",
      contact: function (email) { return "Контакт: " + email; },
    },
  };

  /* Languages in which a given law + request type can be written. */
  function availableLangs(law, type) {
    var t = law.types[type];
    if (!t) return [];
    return (law.letterLangs || ["en"]).filter(function (lang) {
      return t.cite && t.cite[lang] && t.text && t.text[lang] && PHRASES[lang];
    });
  }

  /**
   * Build the plain-text letter.
   * opts: { law, type, lang, name, email, company, accountId, details, date }
   */
  function buildLetter(opts) {
    var law = opts.law;
    var t = law && law.types && law.types[opts.type];
    if (!t) throw new Error('Request type "' + opts.type + '" is not supported by ' + (law && law.id));
    var langs = availableLangs(law, opts.type);
    var lang = langs.indexOf(opts.lang) !== -1 ? opts.lang : "en";
    var p = PHRASES[lang];
    var date = opts.date || new Date().toISOString().slice(0, 10);

    var lines = [];
    lines.push(p.to + ": " + (opts.company || p.companyPlaceholder));
    lines.push(date);
    lines.push("");
    lines.push(p.subject(p.typeLabels[opts.type]));
    lines.push("");
    lines.push(p.greeting);
    lines.push("");
    lines.push(p.intro(opts.name || p.namePlaceholder, t.cite[lang]));
    lines.push("");
    lines.push(t.text[lang]);
    if (opts.accountId) { lines.push(""); lines.push(p.account(opts.accountId)); }
    if (opts.details) { lines.push(""); lines.push(p.details); lines.push(opts.details); }
    lines.push("");
    lines.push(p.deadline(lang === "en" ? law.deadline && law.deadline.citation : ""));
    lines.push("");
    lines.push(p.refuse);
    lines.push("");
    lines.push(p.close);
    lines.push(opts.name || p.namePlaceholder);
    if (opts.email) lines.push(p.contact(opts.email));
    return lines.join("\n");
  }

  return { REQUEST_TYPES: REQUEST_TYPES, PHRASES: PHRASES, availableLangs: availableLangs, buildLetter: buildLetter };
});
