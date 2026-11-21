/* Dezentes Einblenden beim Scrollen – funktioniert in allen Browsern.
   Elemente, die beim Laden schon sichtbar sind, bleiben unangetastet (kein Flackern).
   Elemente weiter unten bekommen die Klasse „reveal“ und gleiten beim Hineinscrollen
   leicht von unten ein; Nachbarn (z. B. Karten) leicht versetzt nacheinander.
   Ohne JavaScript, bei „Bewegung reduzieren“ und im Druck ist alles sofort sichtbar. */
(function () {
  if (!("IntersectionObserver" in window)) { return; }
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }

  var SELECTOR = ".fact, .card, .section-title, .about-grid, .exp, .principles li, .contact-cards li, " +
                 ".steps li, .facts-list > div, .offer li, .cta, .tags--about";

  function start() {
    var els = document.querySelectorAll(SELECTOR);
    var limit = window.innerHeight * 0.92;
    var root = document.documentElement;

    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          var t = entries[i].target;
          t.classList.add("is-in");
          io.unobserve(t);
          // Versatz nur fürs Einblenden – danach sollen Hover-Effekte sofort reagieren
          setTimeout(function (el) { el.style.transitionDelay = ""; }, 1100, t);
        }
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    root.classList.add("reveal-on");

    for (var j = 0; j < els.length; j++) {
      var el = els[j];
      if (el.getBoundingClientRect().top < limit) { continue; }   // schon sichtbar: nicht verstecken

      // Nachbarn im selben Elternelement leicht versetzt (0, 80, 160, 240 ms)
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = (idx % 4) * 80 + "ms";

      el.classList.add("reveal");
      io.observe(el);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
