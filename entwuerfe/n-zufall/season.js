/* Winter-Easter-Egg: im Dezember und Januar schweben wenige feine Eiskristalle über die Seite.
   Setzt data-season="winter" am <html>-Element und hängt fünf leere Elemente an – Aussehen und
   Bewegung kommen aus style.css. Zum Testen außerhalb der Saison: ?winter an die Adresse hängen.
   Bei „Bewegung reduzieren“ bleibt es aus. */
(function () {
  var month = new Date().getMonth();
  var forced = /[?&]winter\b/.test(location.search);
  if (!(month === 11 || month === 0 || forced)) { return; }
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }

  document.documentElement.setAttribute("data-season", "winter");

  document.addEventListener("DOMContentLoaded", function () {
    var snow = document.createElement("div");
    snow.className = "snow";
    snow.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 5; i++) { snow.appendChild(document.createElement("i")); }
    document.body.appendChild(snow);
  });
})();
