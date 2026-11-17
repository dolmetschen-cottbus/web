/* Navigation auf dem One-Pager:
   - markiert im Kopf den Abschnitt, der gerade im Bild ist (aria-current)
   - schließt das Handy-Menü nach einem Klick auf einen Menüpunkt */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var links = document.querySelectorAll('.site-nav a[href^="#"]');
    var toggle = document.getElementById("nav-toggle");
    var byId = {};
    var i;

    for (i = 0; i < links.length; i++) {
      byId[links[i].getAttribute("href").slice(1)] = links[i];
      links[i].addEventListener("click", function () {
        if (toggle) { toggle.checked = false; }
      });
    }

    function mark(id) {
      if (!byId[id]) { return; }
      for (var k in byId) { byId[k].removeAttribute("aria-current"); }
      byId[id].setAttribute("aria-current", "true");
    }

    if (!("IntersectionObserver" in window)) { return; }

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
