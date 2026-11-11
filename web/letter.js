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
    kk: {
      to: "Кімге",
      companyPlaceholder: "[ұйымның атауы]",
      namePlaceholder: "[толық аты-жөніңіз]",
      subject: function (t) { return "Дербес деректер субъектісінің өтініші: " + t; },
      typeLabels: {
        access: "дербес деректерге қол жеткізу",
        erasure: "дербес деректерді жою",
        rectification: "дербес деректерді өзгерту және толықтыру",
        portability: "деректердің тасымалдануы",
        objection: "деректерді өңдеуге қарсылық",
        withdraw: "келісімді кері қайтарып алу",
      },
      greeting: "Құрметті әріптестер,",
      intro: function (name, cite) {
        return "Мен, " + name + ", дербес деректер субъектісі ретінде " + cite + " негізінде сіздерге жүгінемін.";
      },
      account: function (id) { return "Есептік жазба / сәйкестендіргіш: " + id; },
      details: "Қосымша мәліметтер:",
      deadline: function () {
        return "Заңда белгіленген мерзімде жауап беруіңізді сұраймын. Жеке басымды растау үшін тек қажетті мәліметтерді ғана сұрауыңызды өтінемін.";
      },
      refuse: "Өтінішті толық немесе ішінара орындаудан бас тартқан жағдайда, оның заңды негіздерін және шағымдану тәртібін көрсетуіңізді сұраймын.",
      close: "Құрметпен,",
      contact: function (email) { return "Байланыс дерегі: " + email; },
    },
    uz: {
      to: "Kimga",
      companyPlaceholder: "[tashkilot nomi]",
      namePlaceholder: "[to'liq ismingiz]",
      subject: function (t) { return "Shaxsga doir ma'lumotlar subyektining murojaati: " + t; },
      typeLabels: {
        access: "shaxsga doir ma'lumotlardan foydalanish",
        erasure: "shaxsga doir ma'lumotlarni yo'q qilish",
        rectification: "shaxsga doir ma'lumotlarni tuzatish",
        portability: "ma'lumotlar ko'chirilishi",
        objection: "ishlov berishga e'tiroz bildirish",
        withdraw: "rozilikni qaytarib olish",
      },
      greeting: "Hurmatli mutasaddilar,",
      intro: function (name, cite) {
        return "Men, " + name + ", shaxsga doir ma'lumotlar subyekti sifatida " + cite + " asosida sizga murojaat qilmoqdaman.";
      },
      account: function (id) { return "Hisob yozuvi / identifikator: " + id; },
      details: "Qo'shimcha ma'lumotlar:",
      deadline: function () {
        return "Qonunda belgilangan muddatda javob berishingizni so'rayman. Shaxsimni tasdiqlash uchun faqat eng zarur ma'lumotlarni talab qilishingizni so'rayman.";
      },
      refuse: "Murojaatni qanoatlantirish to'liq yoki qisman rad etilgan taqdirda, iltimos, huquqiy asoslarni va shikoyat qilish tartibini ko'rsating.",
      close: "Hurmat bilan,",
      contact: function (email) { return "Aloqa: " + email; },
    },
    ka: {
      to: "ვის",
      companyPlaceholder: "[ორგანიზაციის დასახელება]",
      namePlaceholder: "[თქვენი სრული სახელი]",
      subject: function (t) { return "მონაცემთა სუბიექტის მოთხოვნა: " + t; },
      typeLabels: {
        access: "პერსონალურ მონაცემებზე წვდომა",
        erasure: "პერსონალურ მონაცემთა წაშლა",
        rectification: "პერსონალურ მონაცემთა გასწორება",
        portability: "მონაცემთა გადატანა",
        objection: "მონაცემთა დამუშავების გასაჩივრება",
        withdraw: "თანხმობის გამოხმობა",
      },
      greeting: "პატივცემულო კოლეგებო,",
      intro: function (name, cite) {
        return "მე, " + name + ", როგორც პერსონალურ მონაცემთა სუბიექტი, მოგმართავთ " + cite + " საფუძველზე.";
      },
      account: function (id) { return "ანგარიში / იდენტიფიკატორი: " + id; },
      details: "დამატებითი დეტალები:",
      deadline: function () {
        return "გთხოვთ მიპასუხოთ კანონით დადგენილ ვადაში. იდენტურობის დასადასტურებლად გთხოვთ მოითხოვოთ მხოლოდ აუცილებელი ინფორმაცია.";
      },
      refuse: "მოთხოვნის დაკმაყოფილებაზე სრული ან ნაწილობრივი უარის შემთხვევაში, გთხოვთ მიუთითოთ სამართლებრივი საფუძვლები და გასაჩივრების წესი.",
      close: "პატივისცემით,",
      contact: function (email) { return "კონტაქტი: " + email; },
    },
    hy: {
      to: "Ում",
      companyPlaceholder: "[կազմակերպության անվանումը]",
      namePlaceholder: "[ձեր ամբողջական անունը]",
      subject: function (t) { return "Անձնական տվյալների սուբյեկտի հարցում. " + t; },
      typeLabels: {
        access: "անձնական տվյալների հասանելիություն",
        erasure: "անձնական տվյալների ոչնչացում",
        rectification: "անձնական տվյալների ուղղում",
        portability: "տվյալների փոխանցելիություն",
        objection: "տվյալների մշակման դեմ առարկություն",
        withdraw: "համաձայնության հետկանչ",
      },
      greeting: "Հարգելի գործընկերներ,",
      intro: function (name, cite) {
        return "Ես՝ " + name + "ս, որպես անձնական տվյալների սուբյեկտ, դիմում եմ ձեզ " + cite + " հիման վրա:";
      },
      account: function (id) { return "Հաշիվ / նույնացուցիչ. " + id; },
      details: "Լրացուցիչ տեղեկություններ.",
      deadline: function () {
        return "Խնդրում եմ պատասխանել օրենքով սահմանված ժամկետում: Ինքնությունը հաստատելու համար խնդրում եմ պահանջել միայն խիստ անհրաժեշտ տեղեկություններ:";
      },
      refuse: "Հարցումը լրիվ կամ մասնակի մերժելու դեպքում խնդրում եմ նշել իրավական հիմքերը և բողոքարկման կարգը:",
      close: "Հարգանքով՝",
      contact: function (email) { return "Կոնտակտ. " + email; },
    },
    be: {
      to: "Каму",
      companyPlaceholder: "[назва арганізацыі]",
      namePlaceholder: "[ваша поўнае імя]",
      subject: function (t) { return "Запыт суб'екта персанальных даных: " + t; },
      typeLabels: {
        access: "азнаямленне з персанальнымі данымі",
        erasure: "выдаленне персанальных даных",
        rectification: "змяненне персанальных даных",
        portability: "пераноснасць даных",
        objection: "пярэчанне супраць апрацоўкі",
        withdraw: "адкліканне згоды",
      },
      greeting: "Паважаныя калегі,",
      intro: function (name, cite) {
        return "Я, " + name + ", як суб'ект персанальных даных звяртаюся да вас на падставе " + cite + ".";
      },
      account: function (id) { return "Уліковы запіс / ідэнтыфікатар: " + id; },
      details: "Дадатковыя звесткі:",
      deadline: function () {
        return "Прашу адказаць у тэрміны, устаноўленыя заканадаўствам. Для пацвярджэння асобы прашу запытваць толькі сапраўды неабходныя звесткі.";
      },
      refuse: "У выпадку адмовы ў задавальненні запыту, цалкам або часткова, прашу пазначыць прававыя падставы і парадак абскарджання.",
      close: "З павагай,",
      contact: function (email) { return "Кантакт: " + email; },
    },
    de: {
      to: "An",
      companyPlaceholder: "[Name des Unternehmens]",
      namePlaceholder: "[Ihr vollständiger Name]",
      subject: function (t) { return "Antrag der betroffenen Person: " + t; },
      typeLabels: {
        access: "Auskunft über personenbezogene Daten",
        erasure: "Löschung personenbezogener Daten",
        rectification: "Berichtigung personenbezogener Daten",
        portability: "Datenübertragbarkeit",
        objection: "Widerspruch gegen die Verarbeitung",
        withdraw: "Widerruf der Einwilligung",
      },
      greeting: "Sehr geehrte Damen und Herren,",
      intro: function (name, cite) {
        return "Ich schreibe Ihnen als betroffene Person, " + name + ", und mache meine Rechte gemäß " + cite + " geltend.";
      },
      account: function (id) { return "Konto / Kennung: " + id; },
      details: "Zusätzliche Angaben:",
      deadline: function () {
        return "Bitte antworten Sie innerhalb der gesetzlich vorgeschriebenen Frist. Falls Sie meine Identität überprüfen müssen, fordern Sie bitte nur die unbedingt erforderlichen Angaben an.";
      },
      refuse: "Sollten Sie diesen Antrag ganz oder teilweise ablehnen, begründen Sie dies bitte rechtlich und informieren Sie mich über Beschwerdemöglichkeiten bei der Aufsichtsbehörde.",
      close: "Mit freundlichen Grüßen",
      contact: function (email) { return "Kontakt: " + email; },
    },
    fr: {
      to: "À",
      companyPlaceholder: "[nom de l'entreprise]",
      namePlaceholder: "[votre nom complet]",
      subject: function (t) { return "Demande de la personne concernée : " + t; },
      typeLabels: {
        access: "accès aux données personnelles",
        erasure: "effacement des données personnelles",
        rectification: "rectification des données personnelles",
        portability: "portabilité des données",
        objection: "opposition au traitement",
        withdraw: "retrait du consentement",
      },
      greeting: "Madame, Monsieur,",
      intro: function (name, cite) {
        return "En tant que personne concernée, je soussigné(e), " + name + ", exerce mes droits en vertu de " + cite + ".";
      },
      account: function (id) { return "Compte / identifiant : " + id; },
      details: "Détails supplémentaires :",
      deadline: function () {
        return "Je vous prie de bien vouloir répondre dans le délai légal imparti. Si vous devez vérifier mon identité, merci de ne demander que les éléments strictement nécessaires.";
      },
      refuse: "En cas de refus total ou partiel de cette demande, veuillez en préciser les motifs juridiques ainsi que les voies de recours auprès de l'autorité de contrôle compétente.",
      close: "Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées,",
      contact: function (email) { return "Contact : " + email; },
    },
    es: {
      to: "Para",
      companyPlaceholder: "[nombre de la empresa]",
      namePlaceholder: "[su nombre completo]",
      subject: function (t) { return "Solicitud de la persona interesada: " + t; },
      typeLabels: {
        access: "acceso a los datos personales",
        erasure: "supresión de los datos personales",
        rectification: "rectificación de los datos personales",
        portability: "portabilidad de los datos",
        objection: "oposición al tratamiento",
        withdraw: "retirada del consentimiento",
      },
      greeting: "Estimado/a Delegado/a de Protección de Datos / Equipo de Privacidad:",
      intro: function (name, cite) {
        return "Me dirijo a ustedes como titular de los datos, " + name + ", para ejercer mis derechos en virtud de " + cite + ".";
      },
      account: function (id) { return "Cuenta / identificador: " + id; },
      details: "Detalles adicionales:",
      deadline: function () {
        return "Les solicito que respondan dentro del plazo establecido por la ley. Si necesitan verificar mi identidad, les pido que soliciten únicamente la información estrictamente necesaria.";
      },
      refuse: "En caso de denegación total o parcial de esta solicitud, les ruego que indiquen los motivos jurídicos y los cauces para reclamar ante la autoridad de control.",
      close: "Atentamente,",
      contact: function (email) { return "Contacto: " + email; },
    },
    pt: {
      to: "Para",
      companyPlaceholder: "[nome da organização/empresa]",
      namePlaceholder: "[seu nome completo]",
      subject: function (t) { return "Requerimento do titular dos dados: " + t; },
      typeLabels: {
        access: "acesso aos dados pessoais",
        erasure: "eliminação dos dados pessoais",
        rectification: "retificação dos dados pessoais",
        portability: "portabilidade dos dados",
        objection: "oposição ao tratamento",
        withdraw: "revogação do consentimento",
      },
      greeting: "Prezado(a) Encarregado(a) de Proteção de Dados / Equipe de Privacidade,",
      intro: function (name, cite) {
        return "Eu, " + name + ", na qualidade de titular dos dados pessoais, venho por meio desta exercer meus direitos com base em " + cite + ".";
      },
      account: function (id) { return "Conta / identificador: " + id; },
      details: "Informações adicionais:",
      deadline: function () {
        return "Solicito resposta dentro do prazo estabelecido por lei. Caso seja necessária a confirmação da minha identidade, peço que solicitem apenas os dados estritamente necessários.";
      },
      refuse: "Em caso de recusa total ou parcial deste requerimento, solicito a apresentação das justificativas legais e a indicação dos procedimentos para peticionamento junto à autoridade competente.",
      close: "Atenciosamente,",
      contact: function (email) { return "Contato: " + email; },
    },
    ja: {
      to: "宛先",
      companyPlaceholder: "[事業者名・会社名]",
      namePlaceholder: "[ご氏名]",
      subject: function (t) { return "保有個人データに関する開示等の請求: " + t; },
      typeLabels: {
        access: "個人データの開示請求",
        erasure: "個人データの利用停止・消去請求",
        rectification: "個人データの訂正・追加・削除請求",
        portability: "データポータビリティ請求",
        objection: "個人データの第三者提供等の停止請求",
        withdraw: "同意の撤回",
      },
      greeting: "個人情報保護ご担当者様",
      intro: function (name, cite) {
        return "私（" + name + "）は、本人として、" + cite + "に基づき本請求を行います。";
      },
      account: function (id) { return "アカウント / 識別番号: " + id; },
      details: "追加の詳細情報:",
      deadline: function () {
        return "法令で定められた期間内にご回答いただけますようお願いいたします。本人確認が必要な場合は、過度な情報ではなく真に必要な事項のみをご指定ください。";
      },
      refuse: "本請求の全部または一部に応じられない場合は、その法令上の理由および異議申立て・監督機関への相談手順をご教示ください。",
      close: "敬具",
      contact: function (email) { return "連絡先: " + email; },
    },
    ko: {
      to: "수신",
      companyPlaceholder: "[회사/기관명]",
      namePlaceholder: "[성명/성함]",
      subject: function (t) { return "개인정보 열람 등 요구서: " + t; },
      typeLabels: {
        access: "개인정보 열람 요구",
        erasure: "개인정보 파기 요구",
        rectification: "개인정보 정정 요구",
        portability: "개인정보 전송 요구",
        objection: "개인정보 처리정지 요구",
        withdraw: "개인정보 처리 동의 철회",
      },
      greeting: "개인정보 보호책임자 및 담당자 귀하,",
      intro: function (name, cite) {
        return "정보주체 본인 " + name + "은(는) " + cite + "에 따라 다음과 같이 권리를 행사합니다.";
      },
      account: function (id) { return "계정 / 식별자: " + id; },
      details: "추가 세부사항:",
      deadline: function () {
        return "법령에서 정한 기한 내에 답변해 주시기 바랍니다. 본인 확인이 필요한 경우, 과도한 정보가 아닌 최소한의 필수 정보만을 요청해 주시기 바랍니다.";
      },
      refuse: "본 요구를 전부 또는 일부 거부하는 경우, 법적 근거와 감독기관에 대한 이의제기 절차를 안내해 주시기 바랍니다.",
      close: "감사합니다.",
      contact: function (email) { return "연락처: " + email; },
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
