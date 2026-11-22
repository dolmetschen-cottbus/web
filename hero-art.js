/* Hero-Grafiken im Startbereich.
   Normale Tage: feste Reihenfolge Begrüßung → Globus → Buchstaben → Begrüßung …, je 10 s;
   bei jeder Begrüßung erscheint das nächste Wortpaar (data-pair).
   Besondere Tage (deutscher Kalender) zeigen NUR ihre eigenen Animationen:
     Übersetzertag 30.9.                  Feder schreibt „EM“, „Internationaler Übersetzertag“ (Schleife)
     Halloween 31.10.                     Kürbis mit „Happy Halloween“
     1. Advent bis 23.12.                 Adventskranz, 1–4 Kerzen brennen, „1. Advent“ … „4. Advent“
     24.–26.12.                           Adventskranz, alle Kerzen, Weihnachtsstern, „Frohe Weihnachten“
     31.12. und 1.1.                      Sektgläser stoßen an, Raketen schreiben die neue Jahreszahl (Schleife)
     Ostern (Palmsonntag bis Ostermontag) Zarenei, darin „Frohe Ostern!“ → „Светлой Пасхи!“ (Schleife)
   Klick auf die Grafik springt zur nächsten bzw. spielt eine einzelne Feiertags-Grafik neu ab;
   Grafiken mit „loop“ starten nach Ablauf von selbst neu.
   Bei „Bewegung reduzieren“ bleibt die erste Grafik stehen.
   Zum Testen: ?fest=transl|halloween|advent|xmas|newyear|easter (bei advent zusätzlich &advent=1..4),
               ?halloween, ?silvester, ?ostern, ?art=greet|globe|glyph|egg|quill|pumpkin|wreath|toast */
(function () {
  var NORMAL = { order: ["greet", "globe", "glyph"], pairs: ["1", "2", "3"] };
  var SPECIAL = {
    transl:    { order: ["quill"], loop: 9500 },
    halloween: { order: ["pumpkin"] },
    advent:    { order: ["wreath"] },
    xmas:      { order: ["wreath"] },
    newyear:   { order: ["toast"], loop: 9000 },
    easter:    { order: ["egg"], loop: 12500 }
  };
  var duration = 10000;
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DAY = 86400000;

  function day0(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }

  /* Ostersonntag nach gregorianischem Kalender (Meeus/Jones/Butcher) */
  function easterSunday(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
        f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
        i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
        n = h + l - 7 * m + 114;
    return new Date(y, Math.floor(n / 31) - 1, (n % 31) + 1);
  }
  /* 1. Advent = vierter Sonntag vor dem 25. Dezember */
  function firstAdvent(y) {
    var xmasEve = new Date(y, 11, 24);
    return new Date(y, 11, 24 - xmasEve.getDay() - 21);
  }

  function festive(d) {
    var mo = d.getMonth(), day = d.getDate(), t = day0(d);
    if (mo === 8 && day === 30) { return "transl"; }
    if (mo === 9 && day === 31) { return "halloween"; }
    if ((mo === 11 && day === 31) || (mo === 0 && day === 1)) { return "newyear"; }
    if (mo === 11 && day >= 24 && day <= 26) { return "xmas"; }
    if (t >= firstAdvent(d.getFullYear()).getTime() && (mo === 10 || (mo === 11 && day <= 23))) { return "advent"; }
    var e = easterSunday(d.getFullYear()).getTime();
    if (t >= e - 7 * DAY && t <= e + DAY) { return "easter"; }
    return null;
  }

  var q = location.search, now = new Date();
  var f = /[?&]fest=(transl|halloween|advent|xmas|newyear|easter)\b/.exec(q);
  var fest = f ? f[1]
           : /[?&]halloween\b/.test(q) ? "halloween"
           : /[?&]silvester\b/.test(q) ? "newyear"
           : /[?&]ostern\b/.test(q) ? "easter"
           : festive(now);
  var plan = SPECIAL[fest] || NORMAL;
  var order = plan.order.slice(), pairs = plan.pairs || NORMAL.pairs;

  /* Adventskranz: wie viele Kerzen brennen, Beschriftung */
  /* Silvester: neue Jahreszahl – im Januar das laufende, sonst das kommende Jahr */
  var newYear = now.getMonth() === 0 ? now.getFullYear() : now.getFullYear() + 1;
  /* Silvester-Kombi: Raketen steigen vom Anstoßpunkt auf und schreiben die Jahreszahl aus Funkenpunkten */
  var DIGITS = {
    "0": "M14 0C30 0 30 44 14 44C-2 44-2 0 14 0Z",
    "1": "M6 10L16 0V44",
    "2": "M2 10C4 0 26-2 26 12C26 24 2 34 2 44H28",
    "3": "M3 6C10-2 26 0 25 11C24 20 14 21 11 21C26 21 28 32 26 37C22 46 6 46 2 39",
    "4": "M20 44V0L1 30H28",
    "5": "M25 0H6L4 19C12 14 27 16 27 29C27 42 10 46 2 39",
    "6": "M24 3C12-3 2 8 2 26C2 40 10 44 15 44C24 44 27 37 27 30C27 22 21 17 15 17C8 17 3 22 2 28",
    "7": "M1 0H27L10 44",
    "8": "M14 21C4 21 3 13 3 10C3 3 8 0 14 0C20 0 25 3 25 10C25 15 22 21 14 21C5 21 2 28 2 32C2 40 8 44 14 44C21 44 26 40 26 32C26 27 23 21 14 21Z",
    "9": "M4 41C16 47 26 36 26 18C26 4 18 0 13 0C4 0 1 7 1 14C1 22 7 27 13 27C20 27 25 22 26 16"
  };
  var sky = document.querySelector(".tw-sky");
  if (sky) {
    var NS = "http://www.w3.org/2000/svg", txt = String(newYear), W = 38, x0 = 180 - (W * (txt.length - 1) + 32) / 2;
    var mk = function (tag, attrs, parent) {
      var el = document.createElementNS(NS, tag);
      for (var a in attrs) { if (attrs.hasOwnProperty(a)) { el.setAttribute(a, attrs[a]); } }
      parent.appendChild(el);
      return el;
    };
    for (var k = 0; k < txt.length; k++) {
      var dx = x0 + k * W, dy = 44, cx = dx + 16, cy = dy + 25, t0 = 1.2 + k * 0.2;
      var rocket = mk("circle", { "class": "tw-rocket", cx: 180, cy: 180, r: 2.2 }, sky);
      rocket.style.setProperty("--tx", (cx - 180) + "px");
      rocket.style.setProperty("--ty", (cy - 180) + "px");
      rocket.style.animationDelay = t0 + "s";
      var rays = "";
      for (var r = 0; r < 10; r++) {
        var an = r * Math.PI / 5;
        rays += "M" + (cx + 20 * Math.cos(an)).toFixed(1) + " " + (cy + 20 * Math.sin(an)).toFixed(1) +
                "L" + (cx + 31 * Math.cos(an)).toFixed(1) + " " + (cy + 31 * Math.sin(an)).toFixed(1);
      }
      mk("path", { "class": "tw-burst", d: rays }, sky).style.animationDelay = (t0 + 0.68) + "s";
      var g = mk("g", { transform: "translate(" + dx + " " + dy + ") scale(1.15)" }, sky);
      mk("path", { "class": "tw-digit", d: DIGITS[txt.charAt(k)] }, g).style.animationDelay = (t0 + 0.68) + "s, " + (t0 + 1.4) + "s";
    }
  }

  var i = 0, p = 0, timer = null;
  var m = /[?&]art=(greet|globe|glyph|egg|quill|pumpkin|wreath|toast)\b/.exec(q);
  if (m) {
    if (order.indexOf(m[1]) === -1) { order = [m[1]].concat(NORMAL.order); }   /* Sondergrafik gezielt ansehen */
    i = order.indexOf(m[1]);
  }

  function schedule() {
    clearTimeout(timer);
    if (reduce || document.hidden) { return; }
    if (order.length < 2) {                                       /* einzelne Grafik: ggf. in Schleife */
      if (plan.loop) { timer = setTimeout(function () { show(i); }, plan.loop); }
      return;
    }
    timer = setTimeout(function () { show((i + 1) % order.length); }, duration);
  }

  function show(n) {
    i = n;
    if (order[i] === "greet") {
      root.setAttribute("data-pair", pairs[p]);
      p = (p + 1) % pairs.length;
    }
    if (root.getAttribute("data-art") === order[i]) {          /* gleiche Grafik: Animation neu starten */
      root.removeAttribute("data-art");
      void root.offsetWidth;
    }
    root.setAttribute("data-art", order[i]);
    schedule();
  }

  /* Adventskranz: liegt als eigene Datei vor (img/adventskranz.svg) und wird nur geladen, wenn er gebraucht wird */
  function prepareWreath(done) {
    var box = document.querySelector(".art.wreath");
    var am = /[?&]advent=([1-4])\b/.exec(q);
    var n = fest === "xmas" ? 4
          : am ? +am[1]
          : fest === "advent" ? Math.max(1, Math.min(4, 1 + Math.floor((day0(now) - firstAdvent(now.getFullYear()).getTime()) / (7 * DAY))))
          : 4;
    root.setAttribute("data-advent", String(n));
    function caption() {
      var cap = box && box.querySelector(".wr-cap");
      var xmas = !(fest === "advent" || am);                        /* Weihnachten: „Frohe Weihnachten“ + Stern */
      if (cap) { cap.textContent = xmas ? "Frohe Weihnachten" : n + ". Advent"; }
      if (xmas) { root.setAttribute("data-xmas", ""); }
      done();
    }
    if (!box || box.querySelector("svg") || !window.fetch) { caption(); return; }
    fetch(box.getAttribute("data-src")).then(function (r) { return r.ok ? r.text() : ""; }).then(function (t) {
      if (t) { box.insertAdjacentHTML("beforeend", t); }
      caption();
    }, caption);
  }

  show(i);
  if (order.indexOf("wreath") !== -1) { prepareWreath(function () { if (order[i] === "wreath") { show(i); } }); }   /* nach dem Laden neu abspielen */

  document.addEventListener("visibilitychange", schedule);
  document.addEventListener("DOMContentLoaded", function () {
    var box = document.querySelector(".hero-art");
    if (box) { box.addEventListener("click", function () { show((i + 1) % order.length); }); }
  });
})();
