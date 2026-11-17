/* Hero-Grafiken in fester Reihenfolge: Begrüßung → Globus → Buchstaben → Begrüßung …
   Bei jeder Begrüßung erscheint das nächste Wortpaar (data-pair).
   Festtage: Im Dezember, zu Neujahr und zum russischen Weihnachten (7. Januar)
   kommt zuerst ein Festtagsgruß, danach die normalen Paare.
   Klick auf die Grafik springt sofort zur nächsten (Easter Egg).
   Bei „Bewegung reduzieren“ bleibt die Begrüßung stehen.
   Zum Testen: ?art=greet|globe|glyph und ?fest=xmas|ny|xmasru */
(function () {
  var order = ["greet", "globe", "glyph"];
  var duration = { greet: 10000, globe: 10000, glyph: 10000 };
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Festtagsgruß nach Datum:
     1.–26.12.   „Frohe Weihnachten!“ – „С наступающим!“ (das russische Fest kommt noch)
     27.12.–5.1. „Frohes neues Jahr!“ – „С Новым годом!“
     6.–8.1.     „Frohe Weihnachten!“ – „С Рождеством!“ (russisches Weihnachten am 7. Januar) */
  function festive(d) {
    var mo = d.getMonth(), day = d.getDate();
    if (mo === 11 && day <= 26) { return "xmas"; }
    if ((mo === 11 && day >= 27) || (mo === 0 && day <= 5)) { return "ny"; }
    if (mo === 0 && day >= 6 && day <= 8) { return "xmasru"; }
    return null;
  }

  var q = location.search;
  var f = /[?&]fest=(xmas|ny|xmasru)\b/.exec(q);
  var fest = f ? f[1] : festive(new Date());
  var pairs = fest ? [fest, "1", "2", "3"] : ["1", "2", "3"];

  var i = 0, p = 0, timer = null;
  var m = /[?&]art=(greet|globe|glyph)\b/.exec(q);
  if (m) { i = order.indexOf(m[1]); }

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
