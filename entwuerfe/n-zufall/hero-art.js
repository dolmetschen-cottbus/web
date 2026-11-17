/* Hero-Grafiken in fester Reihenfolge: Begrüßung → Globus → Buchstaben → Begrüßung …
   Bei jeder Begrüßung erscheint das nächste Wortpaar (data-pair 1–3).
   Klick auf die Grafik springt sofort zur nächsten (Easter Egg).
   Bei „Bewegung reduzieren“ bleibt die Begrüßung stehen.
   Zum Vergleichen starten mit: ?art=greet, ?art=globe oder ?art=glyph */
(function () {
  var order = ["greet", "globe", "glyph"];
  var duration = { greet: 10000, globe: 10000, glyph: 10000 };
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var i = 0, pair = 1, timer = null;

  var m = /[?&]art=(greet|globe|glyph)\b/.exec(location.search);
  if (m) { i = order.indexOf(m[1]); }

  function schedule() {
    clearTimeout(timer);
    if (reduce || document.hidden) { return; }
    timer = setTimeout(function () { show((i + 1) % order.length); }, duration[order[i]]);
  }

  function show(n) {
    i = n;
    if (order[i] === "greet") {
      root.setAttribute("data-pair", String(pair));
      pair = pair % 3 + 1;
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
