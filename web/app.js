(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var LAWS = window.LAWS_DATA || [];
  var Letter = window.Letter;

  var LANG_NAMES = {
    en: "English",
    az: "Azərbaycan dili",
    kk: "Қазақша",
    uz: "O'zbekcha",
    tr: "Türkçe",
    ru: "Русский",
    uk: "Українська",
    ka: "ქართული",
    hy: "Հայերեն",
    be: "Беларуская",
    de: "Deutsch",
    fr: "Français",
    es: "Español",
    pt: "Português",
    ja: "日本語",
    ko: "한국어"
  };
  var SUBNATIONAL = {
    "US-CA": "California (US)", "US-VA": "Virginia (US)", "US-CO": "Colorado (US)",
    "US-CT": "Connecticut (US)", "US-TX": "Texas (US)",
  };
  var regionNames = null;
  try { regionNames = new Intl.DisplayNames(["en"], { type: "region" }); } catch (e) { /* old browser */ }

  function regionLabel(code) {
    if (SUBNATIONAL[code]) return SUBNATIONAL[code];
    try { return (regionNames && regionNames.of(code)) || code; } catch (e) { return code; }
  }

  /* One option per (jurisdiction, law) pair. */
  var options = [];
  LAWS.forEach(function (law) {
    law.jurisdictions.forEach(function (code) {
      options.push({ code: code, law: law, key: code + "::" + law.id });
    });
  });
  var perCode = {};
  options.forEach(function (o) { perCode[o.code] = (perCode[o.code] || 0) + 1; });
  options.forEach(function (o) {
    o.label = regionLabel(o.code) + (perCode[o.code] > 1 ? " - " + o.law.name : "");
  });
  options.sort(function (a, b) { return a.label.localeCompare(b.label); });

  var els = {
    country: $("country"), type: $("type"), lang: $("lang"), langRow: $("langRow"),
    out: $("output"), warn: $("warn"), info: $("lawInfo"),
  };
  var fields = ["company", "name", "email", "accountId", "details"];

  function current() {
    return options.filter(function (o) { return o.key === els.country.value; })[0];
  }

  function fillCountries(preferredCode) {
    els.country.textContent = "";
    options.forEach(function (o) {
      var opt = document.createElement("option");
      opt.value = o.key;
      opt.textContent = o.label;
      els.country.appendChild(opt);
    });
    var pick = options.filter(function (o) { return o.code === preferredCode; })[0];
    if (pick) els.country.value = pick.key;
  }

  function fillTypes(preferredType) {
    var law = current().law;
    var prev = preferredType || els.type.value;
    els.type.textContent = "";
    Object.keys(law.types).forEach(function (t) {
      var opt = document.createElement("option");
      opt.value = t;
      opt.textContent = Letter.REQUEST_TYPES[t] || t;
      els.type.appendChild(opt);
    });
    if (law.types[prev]) els.type.value = prev;
    fillLangs();
  }

  function fillLangs() {
    var langs = Letter.availableLangs(current().law, els.type.value);
    var prev = els.lang.value;
    els.lang.textContent = "";
    langs.forEach(function (l) {
      var opt = document.createElement("option");
      opt.value = l;
      opt.textContent = LANG_NAMES[l] || l;
      els.lang.appendChild(opt);
    });
    if (langs.indexOf(prev) !== -1) els.lang.value = prev;
    els.langRow.hidden = langs.length < 2;
  }

  function row(dl, label, node) {
    var dt = document.createElement("dt");
    dt.textContent = label;
    var dd = document.createElement("dd");
    if (typeof node === "string") dd.textContent = node; else dd.appendChild(node);
    dl.appendChild(dt);
    dl.appendChild(dd);
  }

  function link(url, text) {
    var a = document.createElement("a");
    a.href = url;
    a.textContent = text || url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }

  function renderInfo() {
    var o = current();
    var law = o.law;
    var dl = document.createElement("dl");

    var badge = document.createElement("span");
    badge.className = "badge " + law.status;
    badge.textContent = { official: "verified", "needs-review": "needs review", generic: "generic" }[law.status] || law.status;
    row(dl, "Law", law.law);
    row(dl, "Status", badge);
    row(dl, "Response time", law.deadline.text);
    var auth = law.authorities[o.code];
    if (auth) row(dl, "Complain to", link(auth.url, auth.name));
    if (law.notes) row(dl, "Notes", law.notes);
    var srcs = document.createElement("span");
    law.sources.forEach(function (s, i) {
      if (i) srcs.appendChild(document.createTextNode(" · "));
      srcs.appendChild(link(s.url, s.title));
    });
    row(dl, "Sources", srcs);
    row(dl, "Checked", law.checkedOn);
    els.info.textContent = "";
    els.info.appendChild(dl);
  }

  function values() {
    var v = { law: current().law, type: els.type.value, lang: els.lang.value };
    fields.forEach(function (f) { v[f] = $(f).value.trim(); });
    return v;
  }

  function render() {
    var v = values();
    els.out.value = Letter.buildLetter(v);
    var msgs = [];
    if (v.law.status === "needs-review") {
      msgs.push("This template has not been fully verified against the official text. Re-read it and check the article numbers before sending.");
    }
    if (!v.name || !v.company) {
      msgs.push("Fill in your name and the company, otherwise placeholders in square brackets stay in the letter.");
    }
    els.warn.hidden = msgs.length === 0;
    els.warn.textContent = msgs.join(" ");
    var lines = els.out.value.split("\n");
    $("mailto").href = "mailto:?subject=" + encodeURIComponent(lines[3] || "") + "&body=" + encodeURIComponent(els.out.value);
  }

  $("copy").addEventListener("click", function () {
    var btn = $("copy");
    function done() { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy"; }, 1500); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(els.out.value).then(done, function () { els.out.select(); document.execCommand("copy"); done(); });
    } else { els.out.select(); document.execCommand("copy"); done(); }
  });

  $("download").addEventListener("click", function () {
    var blob = new Blob([els.out.value], { type: "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data-request-" + current().law.id + "-" + els.type.value + ".txt";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });

  els.country.addEventListener("change", function () { renderInfo(); fillTypes(); render(); });
  els.type.addEventListener("change", function () { fillLangs(); render(); });
  els.lang.addEventListener("change", render);
  fields.forEach(function (f) { $(f).addEventListener("input", render); });

  /* Deep links, used by the LeakLens "Your rights" block:
     ?c=AZ&t=erasure&company=Example%20Ltd&details=... */
  var q = new URLSearchParams(location.search);
  var startCode = (q.get("c") || "").toUpperCase();
  if (!startCode) {
    try { startCode = ((navigator.language || "").split("-")[1] || "").toUpperCase(); } catch (e) { /* ignore */ }
  }
  fillCountries(startCode);
  renderInfo();
  fillTypes(q.get("t"));
  if (q.get("company")) $("company").value = q.get("company").slice(0, 200);
  if (q.get("details")) $("details").value = q.get("details").slice(0, 1000);
  render();
})();
