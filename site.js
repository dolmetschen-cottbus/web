/* Kleine Helfer für alle Seiten:
   - One-Pager: markiert im Kopf den Abschnitt, der gerade im Bild ist (aria-current),
     und schließt das Handy-Menü nach einem Klick auf einen Menüpunkt
   - Sprachwechsel DE/RU behält den aktuellen Abschnitt (#kontakt usw.)
   - Sanfter Hinweis auf die russische Fassung, wenn der Browser auf Russisch steht (einmal wegklickbar)
   - E-Mail-Klick öffnet die vorformulierte Mail UND kopiert die Adresse;
     Telefon-Klick kopiert am Desktop (Maus) die Nummer, am Handy wird gewählt
   Zum Testen: ?sprachhinweis zeigt den Hinweis immer */
(function () {
  var RU = document.documentElement.lang === "ru";
  var T = RU
    ? { mail: "Адрес скопирован", tel: "Номер скопирован", copyTel: "Скопировать номер: ", close: "Закрыть" }
    : { mail: "Adresse kopiert", tel: "Nummer kopiert", copyTel: "Nummer kopieren: ", close: "Schließen" };
  var KEY = "lang-hint-done";

  function store(set) {
    try { if (set) { localStorage.setItem(KEY, "1"); return true; } return localStorage.getItem(KEY) === "1"; }
    catch (e) { return false; }
  }

  /* ---------- kurze Bestätigung unten in der Mitte ---------- */
  var toast = null, toastTimer = null;
  function say(text) {
    if (!toast) {
      toast = document.createElement("p");
      toast.className = "copy-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = text + " ✓";
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 2200);
  }

  function copy(text, done) {
    if (!navigator.clipboard || !window.isSecureContext) { return false; }
    navigator.clipboard.writeText(text).then(done, function () {});
    return true;
  }

  /* +4917632295300 → 0176 32295300 */
  function telText(href) {
    var n = href.replace(/^tel:/, "").replace(/^\+49/, "0");
    return n.slice(0, 4) + " " + n.slice(4);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var i;

    /* ---------- One-Pager-Navigation ---------- */
    var links = document.querySelectorAll('.site-nav a[href^="#"]');
    var toggle = document.getElementById("nav-toggle");
    var switches = document.querySelectorAll(".lang-switch a:not([aria-current])");
    var byId = {}, current = "";

    for (i = 0; i < switches.length; i++) {
      switches[i].setAttribute("data-base", switches[i].getAttribute("href").split("#")[0]);
      switches[i].addEventListener("click", function () { store(true); });   /* Sprache bewusst gewählt */
    }

    /* Sprachwechsel-Links zeigen auf denselben Abschnitt der anderen Sprache */
    function syncSwitch() {
      for (var s = 0; s < switches.length; s++) {
        var base = switches[s].getAttribute("data-base");
        switches[s].setAttribute("href", current && current !== "start" ? base + "#" + current : base);
      }
      if (hintLink) { hintLink.setAttribute("href", switches.length ? switches[0].getAttribute("href") : hintLink.getAttribute("href")); }
    }

    function mark(id) {
      if (!byId[id]) { return; }
      for (var k in byId) { byId[k].removeAttribute("aria-current"); }
      byId[id].setAttribute("aria-current", "true");
      current = id;
      syncSwitch();
    }

    for (i = 0; i < links.length; i++) {
      byId[links[i].getAttribute("href").slice(1)] = links[i];
      links[i].addEventListener("click", function () {
        if (toggle) { toggle.checked = false; }
      });
    }

    /* ---------- Hinweis auf die russische Fassung ---------- */
    var hintLink = null;
    var langs = navigator.languages || [navigator.language || ""];
    var wantsRu = /^ru\b/i.test(langs[0] || "");
    if (!RU && switches.length && (wantsRu && !store(false) || /[?&]sprachhinweis\b/.test(location.search))) {
      var hint = document.createElement("div");
      hint.className = "lang-hint";
      hint.setAttribute("lang", "ru");
      hintLink = document.createElement("a");
      hintLink.setAttribute("hreflang", "ru");
      hintLink.setAttribute("href", switches[0].getAttribute("href"));
      hintLink.innerHTML = '<span class="lang-hint-flag" aria-hidden="true">RU</span>Сайт есть и на русском языке<span aria-hidden="true"> →</span>';
      hintLink.addEventListener("click", function () { store(true); });
      var close = document.createElement("button");
      close.type = "button";
      close.className = "lang-hint-close";
      close.setAttribute("aria-label", T.close);
      close.setAttribute("lang", RU ? "ru" : "de");
      close.textContent = "×";
      close.addEventListener("click", function () {
        store(true);
        hint.classList.remove("is-on");
        setTimeout(function () { hint.remove(); }, 400);
      });
      hint.appendChild(hintLink);
      hint.appendChild(close);
      document.body.appendChild(hint);
      setTimeout(function () { hint.classList.add("is-on"); }, 1200);
    }

    /* ---------- Kopieren von E-Mail und Telefon ---------- */
    var desktop = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var mails = document.querySelectorAll('a[href^="mailto:"]');
    for (i = 0; i < mails.length; i++) {
      mails[i].addEventListener("click", function () {
        /* kein preventDefault: das Mailprogramm öffnet sich wie gewohnt */
        copy(this.getAttribute("href").replace(/^mailto:/, "").split("?")[0], function () { say(T.mail); });
      });
    }
    if (desktop) {
      var tels = document.querySelectorAll('a[href^="tel:"]');
      for (i = 0; i < tels.length; i++) {
        if (tels[i].hasAttribute("title")) { tels[i].setAttribute("title", T.copyTel + telText(tels[i].getAttribute("href"))); }
        tels[i].addEventListener("click", function (e) {
          var nr = telText(this.getAttribute("href"));
          if (copy(nr, function () { say(T.tel + ": " + nr); })) { e.preventDefault(); }
        });
      }
    }

    /* ---------- Scroll-Spy (nur One-Pager) ---------- */
    if (!links.length) { return; }
    if (!("IntersectionObserver" in window)) {
      current = location.hash.slice(1);
      syncSwitch();
      return;
    }

    /* Aktiv ist der Abschnitt, der die Mitte des Bildschirms kreuzt */
    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].isIntersecting) { mark(entries[j].target.id); }
      }
    }, { rootMargin: "-45% 0px -50% 0px" });

    for (var id in byId) {
      var el = document.getElementById(id);
      if (el) { io.observe(el); }
    }
  });
})();
