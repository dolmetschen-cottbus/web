/* Saisonale Easter Eggs. Setzt data-season am <html>-Element; Aussehen und Bewegung kommen aus style.css.
   - Winter (Dezember, Januar): fünf feine Eiskristalle schweben über die Seite.   Test: ?winter
   - Halloween (25. Oktober – 1. November): Spinnennetz oben rechts, mit Fäden an der schwebenden
     Kopfleiste befestigt; eine kleine, freundliche Spinne seilt sich ab und zu ab.   Test: ?halloween
   - Ostern (Palmsonntag bis Ostermontag, westliches UND orthodoxes Datum): Gold-Ei am Monogramm und
     Eiersuche – drei winzige goldene Eier sind auf der Seite versteckt; wer alle findet, bekommt einen
     Gruß. (Zarenei und Ostergruß in der Hero-Grafik steuert hero-art.js.)   Test: ?ostern
   Bei „Bewegung reduzieren“ bleibt alles aus. */
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }

  /* Osterdaten (gleiche Formeln wie in hero-art.js) */
  function easterWest(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, dd = Math.floor(b / 4), e = b % 4,
        f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - dd - g + 15) % 30,
        i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, mm = Math.floor((a + 11 * h + 22 * l) / 451),
        n = h + l - 7 * mm + 114;
    return new Date(y, Math.floor(n / 31) - 1, (n % 31) + 1);
  }
  function easterOrthodox(y) {
    var a = y % 4, b = y % 7, c = y % 19, dd = (19 * c + 15) % 30, e = (2 * a + 4 * b - dd + 34) % 7, n = dd + e + 114;
    var dt = new Date(y, Math.floor(n / 31) - 1, (n % 31) + 1);
    dt.setDate(dt.getDate() + 13);
    return dt;
  }
  function isEaster(dt) {
    var t = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime(), DAY = 86400000;
    var list = [easterWest(dt.getFullYear()), easterOrthodox(dt.getFullYear())];
    for (var j = 0; j < list.length; j++) {
      var e = list[j].getTime();
      if (t >= e - 7 * DAY && t <= e + DAY) { return true; }
    }
    return false;
  }

  var now = new Date(), m = now.getMonth(), d = now.getDate();
  var q = location.search;
  var season = null;
  if (/[?&]halloween\b/.test(q)) { season = "halloween"; }
  else if (/[?&]winter\b/.test(q)) { season = "winter"; }
  else if (/[?&]ostern\b/.test(q)) { season = "easter"; }
  else if (m === 11 || m === 0) { season = "winter"; }
  else if ((m === 9 && d >= 25) || (m === 10 && d === 1)) { season = "halloween"; }
  else if (isEaster(now)) { season = "easter"; }
  if (!season) { return; }

  document.documentElement.setAttribute("data-season", season);

  /* Eiersuche: drei winzige goldene Linien-Eier an wechselnden Stellen der jeweiligen Seite */
  function easter() {
    var ru = document.documentElement.lang === "ru";
    /* Orthodoxe Osterzeit (oder Test ?fest=easterru): traditioneller Gruß „Христос воскресе!“ */
    var oe = easterOrthodox(now.getFullYear()).getTime(), today = new Date(now.getFullYear(), m, d).getTime();
    var orthodox = /[?&]fest=easterru\b/.test(q) || (today >= oe - 7 * 86400000 && today <= oe + 86400000);
    var rusGreet = orthodox ? "Христос воскресе!" : "Светлой Пасхи!";
    var EGG = '<svg viewBox="0 0 24 28" aria-hidden="true" focusable="false">' +
              '<path class="egg-hunt-shell" d="M12 2C17 2 20 10 20 16 20 22 16.4 26 12 26S4 22 4 16C4 10 7 2 12 2Z"/>' +
              '<path class="egg-hunt-deco" d="M4.6 14.5H19.4M5.4 18.5H18.6M8 14.5l2 4 2-4 2 4 2-4"/></svg>';
    /* Mögliche Verstecke (Startbereich und Kopfleiste bewusst nicht). Bei jedem Aufruf werden drei
       zufällig gezogen – aus verschiedenen Bereichen, jeweils in eine zufällige Ecke. */
    var SPOTS = ".fact, .card, .portrait, .principles li, .steps li, .contact-cards li, .facts-list > div, " +
                ".page-hero-inner, .offer li, .for-whom, .check-list li, .cta, .legal h2, .site-footer p";
    var all = Array.prototype.slice.call(document.querySelectorAll(SPOTS)), i, j, tmp;
    for (i = all.length - 1; i > 0; i--) {                    /* mischen (Fisher-Yates) */
      j = Math.floor(Math.random() * (i + 1));
      tmp = all[i]; all[i] = all[j]; all[j] = tmp;
    }
    function area(el) { return el.closest(".facts, .facts-list, .contact-cards, section, footer") || el.parentNode; }
    var hosts = [], areas = [];
    for (i = 0; i < all.length && hosts.length < 3; i++) {    /* nie zwei Eier im selben Bereich */
      var a = area(all[i]);
      if (areas.indexOf(a) === -1) { areas.push(a); hosts.push(all[i]); }
    }
    for (i = 0; i < all.length && hosts.length < 3; i++) {    /* zu wenige Bereiche (kurze Seite): auffüllen */
      if (hosts.indexOf(all[i]) === -1) { hosts.push(all[i]); }
    }
    var CORNERS = ["egg-hunt--tl", "egg-hunt--tr", "egg-hunt--bl", "egg-hunt--br"];
    var found = 0;

    function toast() {
      var t = document.createElement("div");
      t.className = "egg-toast";
      t.setAttribute("role", "status");
      t.innerHTML = ru
        ? '<strong>Все пасхальные яйца найдены!</strong><span>' + rusGreet + ' · <span lang="de">Frohe Ostern!</span></span>'
        : '<strong>Alle Ostereier gefunden!</strong><span>Frohe Ostern! · <span lang="ru">' + rusGreet + '</span></span>';
      document.body.appendChild(t);
      setTimeout(function () { t.classList.add("is-out"); }, 6500);
      setTimeout(function () { if (t.parentNode) { t.parentNode.removeChild(t); } }, 7500);
    }

    for (i = 0; i < hosts.length; i++) {
      (function (host) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "egg-hunt";
        btn.setAttribute("aria-label", ru ? "Пасхальное яйцо" : "Osterei");
        btn.innerHTML = EGG;
        if (host.closest(".site-footer")) {
          btn.classList.add("egg-hunt--inline");               /* im Fuß: im Textfluss */
        } else {
          if (window.getComputedStyle(host).position === "static") { host.style.position = "relative"; }
          btn.classList.add("egg-hunt--corner", CORNERS[Math.floor(Math.random() * CORNERS.length)]);
        }
        btn.addEventListener("click", function () {
          if (btn.classList.contains("is-found")) { return; }
          btn.classList.add("is-found");
          found++;
          if (found === hosts.length) { toast(); }
        });
        host.appendChild(btn);
      })(hosts[i]);
    }
  }

  function winter() {
    var snow = document.createElement("div");
    snow.className = "snow";
    snow.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 5; i++) { snow.appendChild(document.createElement("i")); }
    document.body.appendChild(snow);
  }

  function halloween() {
    var NS = "http://www.w3.org/2000/svg";
    var bar = document.querySelector(".header-bar");
    if (!bar) { return; }

    /* Netz + Haltefäden: ein Overlay über dem ganzen Fenster, Koordinaten = Pixel */
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "hw-web");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    document.body.appendChild(svg);

    /* Spinne am Faden: Rahmen schneidet den Faden oben an der Kopfleiste ab */
    var drop = document.createElement("div");
    drop.className = "hw-drop";
    drop.setAttribute("aria-hidden", "true");
    drop.innerHTML =
      '<div class="hw-spider"><svg viewBox="0 0 30 34" focusable="false">' +
      '<path class="hw-legs" d="M11 16C6 12 3 14 1 18M10 19C5 18 2 21 1 25M10 22C6 23 4 27 3 31M11 24C9 27 8 30 8 33' +
      'M19 16C24 12 27 14 29 18M20 19C25 18 28 21 29 25M20 22C24 23 26 27 27 31M19 24C21 27 22 30 22 33"/>' +
      '<ellipse class="hw-body" cx="15" cy="22" rx="6" ry="7"/>' +
      '<circle class="hw-body" cx="15" cy="13" r="5"/>' +
      '<circle class="hw-eye" cx="13" cy="12.5" r="1.9"/><circle class="hw-eye" cx="17" cy="12.5" r="1.9"/>' +
      '<circle class="hw-pupil" cx="13.4" cy="13" r="0.9"/><circle class="hw-pupil" cx="17.4" cy="13" r="0.9"/>' +
      '<path class="hw-smile" d="M13.3 15.6Q15 16.8 16.7 15.6"/>' +
      '</svg></div>';
    document.body.appendChild(drop);

    function f(n) { return n.toFixed(1); }
    function P(p) { return f(p[0]) + " " + f(p[1]); }

    /* ---------- Eckennetz ----------
       Nach natürlichem Vorbild, gespiegelt in die obere rechte Ecke. Koordinaten im „Ecken-System“:
       u = Abstand vom rechten Rand, v = Abstand von oben (oben = Fensterrand; bei schmalen Fenstern die
       Unterkante der Kopfleiste). Grundform (Einheit 1 = s px), bei jedem Seitenaufruf leicht zufällig variiert:
         Mitte (55, 55) · Rahmenfaden K1 (370, 85) – K2 (85, 370), symmetrisch zur Eck-Diagonalen
         kurze, durchhängende Haltefäden K1 → (300, 0) und K2 → (0, 300)
         lange, gerade Haltefäden K1 → (600, 0) und K2 → (0, 600)
       Speichen enden an Wand, Rahmen oder Haltefaden. Fangfäden laufen über Speichen, die aus dem Bild
       gehen, bis an den Rand weiter und werden dort abgeschnitten.
       Flattern: Fährt die Maus über das Netz (oder klickt), verformen sich die Fäden wellenförmig und
       klingen ab; Punkte an den Wänden bleiben fest. */
    var G = null, amp = 0, phase = 0, flutterOn = false, lastT = 0;
    var netSeed = 1 + Math.floor(Math.random() * 2147483000);  /* jedes Mal ein etwas anderes Netz */

    function build() {
      var W = document.documentElement.clientWidth, H = window.innerHeight;
      var b = bar.getBoundingClientRect();
      var phone = W < 640;
      var D = phone ? Math.max(58, W * 0.16) : Math.max(76, Math.min(125, W * 0.06));   /* Abstand Mitte → Rahmen */
      var s = D / 256;
      var probe = 380 * s;                                       /* so weit reicht das Netz nach links */
      var wide = (W - b.right) > probe;
      var top = wide ? 0 : b.bottom;

      var seed = netSeed;
      function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      function jit(a) { return (rnd() - 0.5) * 2 * a; }
      function X(u, v) { return [W - u * s, top + v * s]; }
      function lerp(p, q, t) { return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; }

      var hub = X(55 + jit(6), 55 + jit(6));
      var K1 = X(370 + jit(18), 85 + jit(14)), K2 = X(85 + jit(14), 370 + jit(18));
      var T1 = X(300 + jit(20), 0), L1 = X(0, 300 + jit(20));
      var F1 = X(600 + jit(40), 0), F2 = X(0, 600 + jit(40));

      function sagged(p, q, bend, m) {                           /* durchhängender Faden als Polylinie */
        var mid = lerp(p, q, 0.5), c = [mid[0] + (hub[0] - mid[0]) * bend, mid[1] + (hub[1] - mid[1]) * bend], pts = [], t;
        for (t = 0; t <= m; t++) {
          var w = t / m;
          pts.push([(1 - w) * (1 - w) * p[0] + 2 * (1 - w) * w * c[0] + w * w * q[0],
                    (1 - w) * (1 - w) * p[1] + 2 * (1 - w) * w * c[1] + w * w * q[1]]);
        }
        return pts;
      }
      var arcT = sagged(K1, T1, 0.1 + jit(0.04), 16), arcL = sagged(K2, L1, 0.1 + jit(0.04), 16);

      /* Netzgrenze; Wände merken, damit Fangfäden dort weiterlaufen dürfen */
      var edges = [[K1, K2, false], [[W, top], T1, true], [L1, [W, top], true]], e2;
      for (e2 = 1; e2 < arcT.length; e2++) { edges.push([arcT[e2 - 1], arcT[e2], false]); }
      for (e2 = 1; e2 < arcL.length; e2++) { edges.push([arcL[e2 - 1], arcL[e2], false]); }
      function hit(dx, dy) {
        var best = Infinity, wall = false, j;
        for (j = 0; j < edges.length; j++) {
          var p = edges[j][0], q = edges[j][1], ex = q[0] - p[0], ey = q[1] - p[1], den = dx * ey - dy * ex;
          if (Math.abs(den) < 1e-9) { continue; }
          var t = ((p[0] - hub[0]) * ey - (p[1] - hub[1]) * ex) / den;
          var w = ((p[0] - hub[0]) * dy - (p[1] - hub[1]) * dx) / den;
          if (t > 0 && w >= -0.001 && w <= 1.001 && t < best) { best = t; wall = edges[j][2]; }
        }
        return [best, wall];
      }

      var n = 17, i, k, ang = [], len = [], toWall = [], spokes = [];
      for (i = 0; i < n; i++) {
        ang[i] = (i / n) * 2 * Math.PI + jit(0.14);
        var h = hit(Math.cos(ang[i]), Math.sin(ang[i]));
        len[i] = h[0]; toWall[i] = h[1];
        spokes.push([hub, [hub[0] + len[i] * Math.cos(ang[i]), hub[1] + len[i] * Math.sin(ang[i])]]);
      }

      /* Fangfäden: Ringe mit leicht unregelmäßigem Abstand und Durchhang */
      var rings = [], r = 0, gap = 24 * s;
      for (k = 0; k < 24; k++) {
        r += gap * (0.82 + rnd() * 0.36);
        if (r > 420 * s) { break; }
        for (i = 0; i < n; i++) {
          var j2 = (i + 1) % n;
          var lim = Math.min(toWall[i] ? Infinity : len[i], toWall[j2] ? Infinity : len[j2]);
          if (toWall[i] && toWall[j2] && r > Math.max(len[i], len[j2]) * 1.6) { continue; }  /* ganz außerhalb */
          if (r > lim * 0.96) { continue; }                                                  /* endet am Rahmen */
          var r1 = r * (1 + jit(0.035)), r2 = r * (1 + jit(0.035));
          var p1 = [hub[0] + r1 * Math.cos(ang[i]), hub[1] + r1 * Math.sin(ang[i])];
          var p2 = [hub[0] + r2 * Math.cos(ang[j2]), hub[1] + r2 * Math.sin(ang[j2])];
          var sag = lerp(hub, lerp(p1, p2, 0.5), 0.965 + jit(0.015));
          rings.push([p1, sag, p2]);
        }
      }

      G = { W: W, H: H, top: top, s: s, hub: hub, spokes: spokes, rings: rings,
            lines: [[K1, K2], [K1, F1], [K2, F2]], arcs: [arcT, arcL],
            b: b, wide: wide, probe: probe };
    }

    /* Verformung beim Flattern: Welle, die zu den Wänden hin auf null abklingt */
    function off(p) {
      if (amp < 0.05) { return p; }
      var u = G.W - p[0], v = p[1] - G.top;
      var fade = Math.max(0, Math.min(1, Math.min(u, v) / (90 * G.s)));
      return [p[0] + amp * fade * Math.sin(p[1] * 0.045 + phase),
              p[1] + amp * fade * Math.cos(p[0] * 0.05 + phase * 1.3)];
    }

    /* SVG einmal anlegen: Pfade in einer Gruppe, die oben (Fensterrand bzw. Kopfleiste) abgeschnitten wird */
    var NSV = "http://www.w3.org/2000/svg";
    var clip = document.createElementNS(NSV, "clipPath"), clipRect = document.createElementNS(NSV, "rect");
    clip.setAttribute("id", "hw-clip"); clip.appendChild(clipRect);
    var defs = document.createElementNS(NSV, "defs"); defs.appendChild(clip); svg.appendChild(defs);
    var grp = document.createElementNS(NSV, "g"); grp.setAttribute("clip-path", "url(#hw-clip)"); svg.appendChild(grp);
    var pathWeb = document.createElementNS(NSV, "path"), pathThr = document.createElementNS(NSV, "path");
    pathWeb.setAttribute("class", "hw-silk"); pathThr.setAttribute("class", "hw-silk hw-thread");
    grp.appendChild(pathWeb); grp.appendChild(pathThr);

    function render() {
      var web = "", thr = "", i, j;
      for (i = 0; i < G.spokes.length; i++) { web += "M" + P(off(G.spokes[i][0])) + "L" + P(off(G.spokes[i][1])); }
      var hc = off(G.hub), hr = 9 * G.s;                                    /* Ring in der Mitte */
      web += "M" + f(hc[0] - hr) + " " + f(hc[1]) + "a" + f(hr) + " " + f(hr) + " 0 1 0 " + f(2 * hr) + " 0" +
             "a" + f(hr) + " " + f(hr) + " 0 1 0 " + f(-2 * hr) + " 0";
      for (i = 0; i < G.rings.length; i++) {
        var g = G.rings[i];
        web += "M" + P(off(g[0])) + "Q" + P(off(g[1])) + " " + P(off(g[2]));
      }
      for (i = 0; i < G.lines.length; i++) { thr += "M" + P(off(G.lines[i][0])) + "L" + P(off(G.lines[i][1])); }
      for (i = 0; i < G.arcs.length; i++) {
        thr += "M" + P(off(G.arcs[i][0]));
        for (j = 1; j < G.arcs[i].length; j++) { thr += "L" + P(off(G.arcs[i][j])); }
      }
      pathWeb.setAttribute("d", web);
      pathThr.setAttribute("d", thr);
    }

    function flutterLoop(t) {
      var dt = Math.min(0.05, (t - lastT) / 1000 || 0.016);
      lastT = t;
      phase += dt * 22;
      amp *= Math.pow(0.12, dt);                                 /* klingt in gut einer Sekunde ab */
      render();
      if (amp > 0.05) { requestAnimationFrame(flutterLoop); } else { amp = 0; render(); flutterOn = false; }
    }
    function flutter(strength) {
      amp = Math.max(amp, strength);
      if (!flutterOn) { flutterOn = true; lastT = performance.now(); requestAnimationFrame(flutterLoop); }
    }
    function overWeb(x, y) {                                     /* liegt der Zeiger im Netz? */
      if (!G) { return false; }
      var u = G.W - x, v = y - G.top;
      return u >= 0 && v >= 0 && (u + v) < 470 * G.s;
    }
    window.addEventListener("pointermove", function (e) { if (overWeb(e.clientX, e.clientY)) { flutter(5); } }, { passive: true });
    window.addEventListener("pointerdown", function (e) { if (overWeb(e.clientX, e.clientY)) { flutter(11); } }, { passive: true });

    function draw() {
      build();
      var W = G.W, H = G.H, b = G.b, wide = G.wide, probe = G.probe;
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      clipRect.setAttribute("x", "0"); clipRect.setAttribute("y", f(G.top));
      clipRect.setAttribute("width", String(W)); clipRect.setAttribute("height", f(H - G.top));
      render();

      /* Abseil-Spinne: Bereiche im linken bzw. rechten Viertel der Kopfleiste merken
         (mit Abstand zur runden Spitze; rechts nicht dort, wo das Netz unter der Leiste hängt) */
      var dropPx = Math.round(H * 0.26);
      var edge = b.height / 2;
      var rightMax = wide ? b.right - edge : Math.min(b.right - edge, W - probe - 20);
      zones = [[b.left + edge, b.left + b.width * 0.25], [b.right - b.width * 0.25, rightMax]];
      drop.style.top = Math.round(b.bottom - 2) + "px";
      drop.style.height = (dropPx + 50) + "px";
      drop.style.setProperty("--drop", dropPx + "px");
      placeSpider();
    }

    /* Zufälliger Platz zum Abseilen: links oder rechts, irgendwo im äußeren Viertel der Kopfleiste.
       Gewechselt wird, während die Spinne unsichtbar oben unter der Leiste wartet. */
    var zones = [], side = Math.random() < 0.5 ? 0 : 1, spot = Math.random();
    function placeSpider() {
      var z = zones[side];
      if (!z || z[1] <= z[0]) { z = zones[0]; }                 /* rechts kein Platz → links */
      if (!z) { return; }
      drop.style.left = Math.round(z[0] + (z[1] - z[0]) * spot - 15) + "px";
    }
    drop.firstChild.addEventListener("animationiteration", function (ev) {
      if (ev.animationName !== "hw-drop") { return; }
      side = Math.random() < 0.5 ? 0 : 1;
      spot = Math.random();
      placeSpider();
    });

    draw();
    window.addEventListener("resize", draw);
    var toggle = document.getElementById("nav-toggle");
    if (toggle) { toggle.addEventListener("change", draw); }
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(draw); }

    setTimeout(crawler, 3000);
  }

  /* Zweite Spinne: krabbelt in zufälligen Bögen über den Bildschirm (Stop-and-go)
     und flitzt davon, sobald Mauszeiger oder Finger näher als ~150 px kommen.
     Klicks gehen durch sie hindurch – fangen lässt sie sich nie. */
  function crawler() {
    var el = document.createElement("div");
    el.className = "hw-crawler";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML =
      '<svg viewBox="-16 -16 32 32" focusable="false">' +
      '<g class="hw-legs-a"><path d="M-3-3-9-9-12-8M3 1 10 4 12 9M-3 4-9 8-10 13M3-6 8-11 9-14"/></g>' +
      '<g class="hw-legs-b"><path d="M3-3 9-9 12-8M-3 1-10 4-12 9M3 4 9 8 10 13M-3-6-8-11-9-14"/></g>' +
      '<ellipse class="hw-body" cx="0" cy="4" rx="4.6" ry="6"/>' +
      '<circle class="hw-body" cx="0" cy="-4.5" r="3.4"/>' +
      '<circle class="hw-eye" cx="-1.3" cy="-6" r="1.1"/><circle class="hw-eye" cx="1.3" cy="-6" r="1.1"/>' +
      '</svg>';
    document.body.appendChild(el);

    var x = -24, y = window.innerHeight * (0.35 + Math.random() * 0.4);
    var heading = 0, want = 0, speed = 0;
    var mx = -1e4, my = -1e4;
    var walking = true, phase = 2 + Math.random() * 2, flee = 0, last = performance.now();
    var WALK = 46, RUN = 280, NEAR = 150;

    function pointer(e) { mx = e.clientX; my = e.clientY; }
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("pointerdown", pointer, { passive: true });
    document.addEventListener("pointerleave", function () { mx = my = -1e4; });

    function turn(cur, target, max) {
      var dlt = Math.atan2(Math.sin(target - cur), Math.cos(target - cur));
      return cur + Math.max(-max, Math.min(max, dlt));
    }

    function step(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      var W = document.documentElement.clientWidth, H = window.innerHeight, m = 24;
      var dist = Math.hypot(x - mx, y - my);

      if (dist < NEAR) {                                  /* Flucht! */
        flee = 0.7;
        want = Math.atan2(y - my, x - mx) + (Math.random() - 0.5) * 0.6;
      }

      if (flee > 0) {
        flee -= dt;
        speed += (RUN - speed) * Math.min(1, dt * 10);
        heading = turn(heading, want, 16 * dt);
      } else {
        phase -= dt;
        if (phase <= 0) {                                 /* Stop-and-go */
          walking = !walking;
          phase = walking ? 1.5 + Math.random() * 3 : 0.5 + Math.random() * 1.6;
        }
        if (walking) {
          want += (Math.random() - 0.5) * 3 * dt;         /* zufällige Bögen */
          if (x < m || x > W - m || y < m || y > H - m) { want = Math.atan2(H / 2 - y, W / 2 - x); }
          heading = turn(heading, want, 4 * dt);
        }
        speed += ((walking ? WALK : 0) - speed) * Math.min(1, dt * 6);
      }

      x += Math.cos(heading) * speed * dt;
      y += Math.sin(heading) * speed * dt;
      if (x > -30 || flee > 0) {                          /* am Rand halten (nach dem Hereinkrabbeln) */
        x = Math.max(m - 40, Math.min(W - m + 40, x));
        y = Math.max(m - 40, Math.min(H - m + 40, y));
      }

      el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) rotate(" + (heading + Math.PI / 2).toFixed(3) + "rad)";
      el.classList.toggle("is-moving", speed > 6);
      el.classList.toggle("is-running", speed > 120);
      requestAnimationFrame(step);
    }

    document.addEventListener("visibilitychange", function () { last = performance.now(); });
    requestAnimationFrame(step);
  }

  document.addEventListener("DOMContentLoaded", { winter: winter, halloween: halloween, easter: easter }[season]);
})();
