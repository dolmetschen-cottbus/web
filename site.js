/* Kleine Helfer für alle Seiten:
   - One-Pager: markiert im Kopf den Abschnitt, der gerade im Bild ist (aria-current),
     und schließt das Handy-Menü nach einem Klick auf einen Menüpunkt
   - Sprachwechsel DE/RU behält den aktuellen Abschnitt (#kontakt usw.)
   - Sanfter Hinweis auf die russische Fassung, wenn der Browser auf Russisch steht (einmal wegklickbar)
   - E-Mail-Klick öffnet die vorformulierte Mail UND kopiert die Adresse;
     Telefon-Klick kopiert am Desktop (Maus) die Nummer, am Handy wird gewählt
   - Easter Egg „Dolmetsch-Modus“: dreimal schnell aufs Monogramm (Startseite) oder die Tasten R, U
     (auf Russisch: D, E) – die Texte drehen sich wie Karten und zeigen für 15 Sekunden die andere
     Sprache (ganze Seite; wo DE/RU abweichend aufgebaut sind, nur Überschriften und Menü). Die Übersetzung kommt aus der Schwesterseite (gleiche Struktur DE/RU).
   - Gruß in der Entwickler-Konsole (mit Hinweis auf das Easter Egg)
   Zum Testen: ?sprachhinweis zeigt den Hinweis immer */
(function () {
  var RU = document.documentElement.lang === "ru";
  var T = RU
    ? { mail: "Адрес скопирован", tel: "Номер скопирован", copyTel: "Скопировать номер: ", close: "Закрыть",
        dm: "Режим переводчика · Deutsch" }
    : { mail: "Adresse kopiert", tel: "Nummer kopiert", copyTel: "Nummer kopieren: ", close: "Schließen",
        dm: "Dolmetsch-Modus · Русский" };

  /* ---------- Gruß in der Entwickler-Konsole ---------- */
  try {
    console.log(
      "%cEM%c\n\nПривет! Hallo!\n\n" +
      "Schön, dass Sie hier hineinschauen. Diese Seite ist von Hand gebaut: HTML, CSS und ein wenig JavaScript, ohne Tracking.\n" +
      "Как приятно, что вы заглянули сюда. Этот сайт сделан вручную: HTML, CSS и немного JavaScript, без отслеживания.\n\n" +
      "Geheimtipp: dreimal schnell auf das Monogramm „EM“ klicken.\n" +
      "Секрет: трижды быстро щёлкните по монограмме «EM».",
      "font: italic 300 42px Georgia, serif; color: #d8c59c; letter-spacing: .15em;",
      "font: 13px/1.5 system-ui, sans-serif; color: inherit;"
    );
  } catch (e) {}

  var KEY = "lang-hint-done";

  function store(set) {
    try { if (set) { localStorage.setItem(KEY, "1"); return true; } return localStorage.getItem(KEY) === "1"; }
    catch (e) { return false; }
  }

  /* ---------- kurze Bestätigung unten in der Mitte ---------- */
  var toast = null, toastTimer = null;
  function say(text, plain) {
    if (!toast) {
      toast = document.createElement("p");
      toast.className = "copy-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = plain ? text : text + " ✓";
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
    if (desktop) {
      var tels = document.querySelectorAll('a[href^="tel:"][title]');
      for (i = 0; i < tels.length; i++) { tels[i].setAttribute("title", T.copyTel + telText(tels[i].getAttribute("href"))); }
    }
    /* ein zentraler Klick-Handler – funktioniert auch für Links, die der Dolmetsch-Modus neu einsetzt */
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="mailto:"], a[href^="tel:"]');
      if (!a || e.button !== 0) { return; }
      var href = a.getAttribute("href");
      if (href.indexOf("mailto:") === 0) {
        /* kein preventDefault: das Mailprogramm öffnet sich wie gewohnt */
        copy(href.replace(/^mailto:/, "").split("?")[0], function () { say(T.mail); });
      } else if (desktop) {
        var nr = telText(href);
        if (copy(nr, function () { say(T.tel + ": " + nr); })) { e.preventDefault(); }
      }
    });

    /* ---------- Dolmetsch-Modus (Easter Egg) ---------- */
    /* Ganze Seite (alle Textblöcke), wenn DE und RU gleich aufgebaut sind – sonst nur Überschriften + Menü */
    var DM_FULL = "main h1, main h2, main h3, main h4, main p, main li, main dt, main dd, main figcaption, " +
                  "main a.card-link, footer p, footer li, .site-nav ul a";
    var DM_HEAD = "main h1, main h2, main h3, .site-nav ul a";
    var otherUrl = switches.length ? switches[0].getAttribute("data-base") : null;
    var other = null, dmOn = false, dmTimer = null, clicks = [], keys = [];

    function loadOther(cb) {
      if (other) { cb(other); return; }
      if (!otherUrl || !window.fetch || !window.DOMParser) { return; }
      fetch(otherUrl).then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); }).then(function (t) {
        other = new DOMParser().parseFromString(t, "text/html");
        cb(other);
      }, function () {});
    }

    /* nur die äußersten Treffer (ein <p> in einem <li> wird mit dem <li> getauscht) */
    function pick(root, sel) {
      var all = Array.prototype.slice.call(root.querySelectorAll(sel));
      return all.filter(function (el) {
        for (var a = el.parentElement; a; a = a.parentElement) { if (all.indexOf(a) !== -1) { return false; } }
        return true;
      });
    }
    function visible(el) {
      var r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
    }

    function flip(toOther) {
      loadOther(function (doc) {
        var mine = pick(document, DM_FULL), theirs = pick(doc, DM_FULL);
        if (mine.length !== theirs.length) { mine = pick(document, DM_HEAD); theirs = pick(doc, DM_HEAD); }
        if (mine.length !== theirs.length) { return; }               /* Struktur weicht ab: lieber nichts tun */
        dmOn = toOther;
        clearTimeout(dmTimer);
        var k = 0;
        for (var j = 0; j < mine.length; j++) {
          (function (el, alt) {
            if (el.dmOrig === undefined) { el.dmOrig = el.innerHTML; }
            function swap() {
              el.innerHTML = toOther ? alt.innerHTML : el.dmOrig;
              if (toOther) { el.setAttribute("lang", RU ? "de" : "ru"); } else { el.removeAttribute("lang"); }
            }
            if (!visible(el)) { swap(); return; }                     /* außerhalb des Bildes: still tauschen */
            setTimeout(function () {
              el.classList.add("dm-flip");
              setTimeout(swap, 230);                                   /* Wechsel, wenn die Karte hochkant steht */
              setTimeout(function () { el.classList.remove("dm-flip"); }, 480);
            }, (k++) * 40);
          })(mine[j], theirs[j]);
        }
        if (toOther) {
          say(T.dm, true);
          dmTimer = setTimeout(function () { flip(false); }, 15000);
        }
      });
    }
    function toggleDm() { flip(!dmOn); }

    /* Monogramm/Name: dreimal schnell = Dolmetsch-Modus.
       Ein einzelner Klick wirkt erst 0,2 s nach dem letzten Klick – kommt ein weiterer, wird gezählt statt
       gesprungen: auf der Startseite nach oben (statt neu zu laden), auf Unterseiten zur Startseite. */
    var brand = document.querySelector(".site-header .brand"), navTimer = null;
    if (brand) {
      brand.addEventListener("click", function (e) {
        if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) { return; }
        e.preventDefault();
        var now = Date.now();
        clicks = clicks.filter(function (t) { return now - t < 1500; });
        clicks.push(now);
        clearTimeout(navTimer);
        if (clicks.length >= 3) { clicks = []; toggleDm(); return; }
        var href = brand.href;                       /* nach 1 oder 2 Klicks ohne weiteren: ganz normal reagieren */
        navTimer = setTimeout(function () {
          clicks = [];
          if (links.length) { window.scrollTo({ top: 0 }); } else { location.href = href; }
        }, 200);
      });
    }
    /* Tastatur: R, U (auf der russischen Seite D, E) – nach Tastenposition, also auch mit kyrillischem Layout */
    var SEQ = RU ? ["KeyD", "KeyE"] : ["KeyR", "KeyU"];
    document.addEventListener("keydown", function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) { return; }
      var now = Date.now();
      keys = keys.filter(function (k) { return now - k.t < 1000; });
      keys.push({ c: e.code, t: now });
      if (keys.length >= 2 && keys[keys.length - 2].c === SEQ[0] && keys[keys.length - 1].c === SEQ[1]) {
        keys = [];
        toggleDm();
      }
    });

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
