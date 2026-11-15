/* Winter-Easter-Egg: im Dezember und Januar Schnee im Kopf und Mützchen am Namen.
   Setzt nur ein Merkmal am <html>-Element – die Darstellung kommt aus style.css. */
(function () {
  var m = new Date().getMonth();
  if (m === 11 || m === 0) {
    document.documentElement.setAttribute("data-season", "winter");
  }
})();