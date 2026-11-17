/* Hero-Grafik per Zufall: Globus oder Buchstaben „D ⇄ Д“.
   Setzt nur ein Merkmal am <html>-Element, die Darstellung kommt aus style.css.
   Zum Vergleichen erzwingen: ?art=globe oder ?art=glyph */
(function () {
  var art = Math.random() < 0.5 ? "globe" : "glyph";
  var m = /[?&]art=(globe|glyph)\b/.exec(location.search);
  if (m) { art = m[1]; }
  document.documentElement.setAttribute("data-art", art);
})();
