/*
 * LeakLens "Your rights" block.
 *
 * Drop this on a breach page. It shows which data protection law applies to the
 * affected country, the response time, the regulator, and a button that opens
 * the letter generator with the company already filled in.
 *
 *   <div id="rights"></div>
 *   <script src="laws-data.js"></script>
 *   <script src="widget.js"></script>
 *   <script>
 *     LeakLensRights.mount("#rights", {
 *       country: "AZ",                       // ISO 3166-1 alpha-2 (or US-CA style)
 *       company: record.institution,         // from Registry `institution`
 *       generatorUrl: "https://example.org/rights/",
 *       details: "Data breach: " + record.title,
 *     });
 *   </script>
 *
 * No dependencies. Uses textContent only, so company names cannot inject HTML.
 */
(function (root) {
  "use strict";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function findLaws(country) {
    var code = String(country || "").toUpperCase();
    var all = root.LAWS_DATA || [];
    var hits = all.filter(function (l) { return l.jurisdictions.indexOf(code) !== -1; });
    if (!hits.length && code.indexOf("-") !== -1) {
      var parent = code.split("-")[0];
      hits = all.filter(function (l) { return l.jurisdictions.indexOf(parent) !== -1; });
    }
    return hits;
  }

  function mount(target, opts) {
    var host = typeof target === "string" ? document.querySelector(target) : target;
    if (!host) return;
    opts = opts || {};
    var generator = opts.generatorUrl || "./";
    host.textContent = "";
    var box = el("section", "ll-rights");
    box.setAttribute("aria-label", "Your rights under data protection law");
    box.appendChild(el("h3", "ll-rights-title", "Your rights"));

    var laws = findLaws(opts.country);
    if (!laws.length) {
      box.appendChild(el("p", "ll-rights-text",
        "We do not have a data protection law entry for this country yet. You can still send a general request to the company."));
    }
    laws.forEach(function (law) {
      var item = el("div", "ll-rights-law");
      item.appendChild(el("strong", "", law.name));
      var status = el("span", "ll-rights-status ll-" + law.status,
        law.status === "official" ? "verified" : law.status === "needs-review" ? "needs review" : "generic");
      item.appendChild(document.createTextNode(" "));
      item.appendChild(status);
      item.appendChild(el("p", "ll-rights-text",
        "You can ask: " + Object.keys(law.types).join(", ") + ". Response time: " + law.deadline.text));
      var code = String(opts.country || "").toUpperCase();
      var auth = law.authorities[code] || law.authorities[Object.keys(law.authorities)[0]];
      if (auth) {
        var p = el("p", "ll-rights-text", "If the company ignores you, complain to ");
        var a = el("a", "", auth.name);
        a.href = auth.url; a.target = "_blank"; a.rel = "noopener noreferrer";
        p.appendChild(a);
        item.appendChild(p);
      }
      box.appendChild(item);
    });

    var params = new URLSearchParams();
    if (opts.country) params.set("c", String(opts.country).toUpperCase());
    if (opts.company) params.set("company", opts.company);
    if (opts.details) params.set("details", opts.details);
    var cta = el("a", "ll-rights-button", "Draft a request to " + (opts.company || "the company"));
    cta.href = generator + (generator.indexOf("?") === -1 ? "?" : "&") + params.toString();
    box.appendChild(cta);
    host.appendChild(box);
  }

  root.LeakLensRights = { mount: mount, findLaws: findLaws };
})(typeof window !== "undefined" ? window : this);
