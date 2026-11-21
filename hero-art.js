/* Hero-Grafiken in fester Reihenfolge: Begrüßung → Globus → Buchstaben → Begrüßung …
   Bei jeder Begrüßung erscheint das nächste Wortpaar (data-pair).
   Festtage: Im Dezember, zu Neujahr und zum russischen Weihnachten (7. Januar)
   kommt zuerst ein Festtagsgruß, danach die normalen Paare.
   Ostern (Palmsonntag bis Ostermontag, westliches UND orthodoxes Datum): zuerst das Zarenei,
   danach die Begrüßung mit „Frohe Ostern!“ – „Светлой Пасхи!“, dann wie gewohnt.
   Klick auf die Grafik springt sofort zur nächsten (Easter Egg).
   Bei „Bewegung reduzieren“ bleibt die erste Grafik stehen.
   Zum Testen: ?art=greet|globe|glyph|egg, ?fest=xmas|ny|xmasru|easter|easterru, ?ostern */
(function () {
  var order = ["greet", "globe", "glyph"];
  var duration = { egg: 10000, greet: 10000, globe: 10000, glyph: 10000 };
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Ostersonntag nach gregorianischem Kalender (Meeus/Jones/Butcher) */
  function easterWest(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
        f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
        i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
        n = h + l - 7 * m + 114;
    return new Date(y, Math.floor(n / 31) - 1, (n % 31) + 1);
  }
  /* Orthodoxes Ostern: julianische Berechnung + 13 Tage (gilt 1900–2099) */
  function easterOrthodox(y) {
    var a = y % 4, b = y % 7, c = y % 19, d = (19 * c + 15) % 30, e = (2 * a + 4 * b - d + 34) % 7, n = d + e + 114;
    var dt = new Date(y, Math.floor(n / 31) - 1, (n % 31) + 1);
    dt.setDate(dt.getDate() + 13);
    return dt;
  }
  /* Osterzeit = Palmsonntag bis Ostermontag. Ergebnis: "easterru" (orthodox, hat Vorrang,
     wenn beide Daten zusammenfallen), "easter" (westlich) oder null */
  function easterKind(d) {
    var t = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(), DAY = 86400000;
    function within(e) { e = e.getTime(); return t >= e - 7 * DAY && t <= e + DAY; }
    if (within(easterOrthodox(d.getFullYear()))) { return "easterru"; }
    if (within(easterWest(d.getFullYear()))) { return "easter"; }
    return null;
  }

  /* Festtagsgruß nach Datum:
     1.–26.12.   „Frohe Weihnachten!“ – „С наступающим!“ (das russische Fest kommt noch)
     27.12.–5.1. „Frohes neues Jahr!“ – „С Новым годом!“
     6.–8.1.     „Frohe Weihnachten!“ – „С Рождеством!“ (russisches Weihnachten am 7. Januar)
     Osterzeit   „Frohe Ostern!“ – „Светлой Пасхи!“ (westlich) bzw. „Христос воскресе!“ (orthodox) */
  function festive(d) {
    var mo = d.getMonth(), day = d.getDate();
    if (mo === 11 && day <= 26) { return "xmas"; }
    if ((mo === 11 && day >= 27) || (mo === 0 && day <= 5)) { return "ny"; }
    if (mo === 0 && day >= 6 && day <= 8) { return "xmasru"; }
    return easterKind(d);
  }

  var q = location.search;
  var f = /[?&]fest=(xmas|ny|xmasru|easter|easterru)\b/.exec(q);
  var fest = f ? f[1] : (/[?&]ostern\b/.test(q) ? "easter" : festive(new Date()));
  var pairs = fest ? [fest, "1", "2", "3"] : ["1", "2", "3"];
  if (fest === "easter" || fest === "easterru") { order = ["egg", "greet", "globe", "glyph"]; }   /* Zarenei zuerst */

  var i = 0, p = 0, timer = null;
  var m = /[?&]art=(greet|globe|glyph|egg)\b/.exec(q);
  if (m) {
    if (m[1] === "egg" && order[0] !== "egg") { order = ["egg", "greet", "globe", "glyph"]; }
    i = order.indexOf(m[1]);
  }

  function schedule() {
    clearTimeout(timer);
    if (reduce || document.hidden) { return; }
    timer = setTimeout(function () { show((i + 1) % order.length); }, duration[order[i]]);
  }

  function show(n) {
    i = n;
    if (order[i] === "greet") {
      root.setAttribute("data-pair", pairs[p]);
      p = (p + 1) % pairs.length;
    }
    root.setAttribute("data-art", order[i]);
    schedule();
  }

  show(i);

  document.addEventListener("visibilitychange", schedule);
  document.addEventListener("DOMContentLoaded", function () {
    var box = document.querySelector(".hero-art");
    if (box) { box.addEventListener("click", function () { show((i + 1) % order.length); }); }
  });
})();
