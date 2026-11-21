/* Saisonale Easter Eggs. Setzt data-season am <html>-Element; Aussehen und Bewegung kommen aus style.css.
   - Winter (Dezember, Januar): fünf feine Eiskristalle schweben über die Seite.   Test: ?winter
   - Halloween (25. Oktober – 1. November): Spinnennetz oben rechts, mit Fäden an der schwebenden
     Kopfleiste befestigt; eine kleine, freundliche Spinne seilt sich ab und zu ab.   Test: ?halloween
   Bei „Bewegung reduzieren“ bleibt alles aus. */
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }

  var now = new Date(), m = now.getMonth(), d = now.getDate();
  var q = location.search;
  var season = null;
  if (/[?&]halloween\b/.test(q)) { season = "halloween"; }
  else if (/[?&]winter\b/.test(q)) { season = "winter"; }
  else if (m === 11 || m === 0) { season = "winter"; }
  else if ((m === 9 && d >= 25) || (m === 10 && d === 1)) { season = "halloween"; }
  if (!season) { return; }

  document.documentElement.setAttribute("data-season", season);

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

    function draw() {
      /* Eckennetz nach natürlichem Vorbild, gespiegelt in die obere rechte Ecke.
         Koordinaten im „Ecken-System“: u = Abstand vom rechten Rand, v = Abstand von oben
         (oben = Fensterrand; bei schmalen Fenstern die Unterkante der Kopfleiste, dort ist das Netz
         zwischen Kopfleiste und rechtem Fensterrand gespannt). Proportionen aus einem Beispielbild (Einheit 1 = s px):
           Mitte (55, 55) · Rahmenfaden K1 (370, 85) – K2 (85, 370), symmetrisch zur Eck-Diagonalen
           kurze, gebogene Haltefäden K1 → (300, 0) und K2 → (0, 300)
           lange, gerade Haltefäden K1 → (600, 0) und K2 → (0, 600)
         Speichen enden an den Rändern bzw. am Rahmen, die Fangspirale besteht aus Ringen um die Mitte.
         Breite ohne Scrollleiste, sonst verschwindet das Netz rechts darunter. */
      var W = document.documentElement.clientWidth, H = window.innerHeight;
      var b = bar.getBoundingClientRect();
      var phone = W < 640;
      var D = phone ? Math.max(58, W * 0.16) : Math.max(76, Math.min(125, W * 0.06));   /* Abstand Mitte → Rahmen */
      var s = D / 256;
      var probe = 380 * s;                                       /* so weit reicht das Netz nach links */
      var wide = (W - b.right) > probe;                          /* rechts neben der Kopfleiste ist Platz */
      var top = wide ? 0 : b.bottom;

      function X(u, v) { return [W - u * s, top + v * s]; }
      /* symmetrisch zur Eck-Diagonalen: der untere Teil ist das Spiegelbild des oberen */
      var hub = X(55, 55), K1 = X(370, 85), K2 = X(85, 370);
      var T1 = X(300, 0), L1 = X(0, 300), F1 = X(600, 0), F2 = X(0, 600);

      function lerp(p, q, t) { return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; }
      /* Kurze Haltefäden hängen leicht durch: als feine Polylinie berechnet, damit die Speichen
         genau auf dem gezeichneten Faden enden (und nicht knapp daneben in der Luft) */
      function sagged(p, q, bend, m) {
        var mid = lerp(p, q, 0.5), c = [mid[0] + (hub[0] - mid[0]) * bend, mid[1] + (hub[1] - mid[1]) * bend], pts = [], t;
        for (t = 0; t <= m; t++) {
          var u = t / m;
          pts.push([(1 - u) * (1 - u) * p[0] + 2 * (1 - u) * u * c[0] + u * u * q[0],
                    (1 - u) * (1 - u) * p[1] + 2 * (1 - u) * u * c[1] + u * u * q[1]]);
        }
        return pts;
      }
      var arcT = sagged(K1, T1, 0.12, 16), arcL = sagged(K2, L1, 0.12, 16);

      /* Grenze des Netzes: oberer Rand, Bogen K1–T1, Rahmen K1–K2, Bogen K2–L1, rechter Rand */
      var edges = [[K1, K2], [[W, top], T1], [L1, [W, top]]], e2;
      for (e2 = 1; e2 < arcT.length; e2++) { edges.push([arcT[e2 - 1], arcT[e2]]); }
      for (e2 = 1; e2 < arcL.length; e2++) { edges.push([arcL[e2 - 1], arcL[e2]]); }
      function hit(dx, dy) {
        var best = Infinity, j;
        for (j = 0; j < edges.length; j++) {
          var p = edges[j][0], q = edges[j][1];
          var ex = q[0] - p[0], ey = q[1] - p[1];
          var den = dx * ey - dy * ex;
          if (Math.abs(den) < 1e-9) { continue; }
          var t = ((p[0] - hub[0]) * ey - (p[1] - hub[1]) * ex) / den;   /* Strahl-Länge */
          var w = ((p[0] - hub[0]) * dy - (p[1] - hub[1]) * dx) / den;   /* Lage auf der Kante */
          if (t > 0 && w >= -0.001 && w <= 1.001 && t < best) { best = t; }
        }
        return best;
      }

      var seed = 5, n = 17, i, k, ang = [], len = [], ends = [];
      function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      for (i = 0; i < n; i++) {
        ang[i] = (i / n) * 2 * Math.PI + (rnd() - 0.5) * 0.18;
        len[i] = hit(Math.cos(ang[i]), Math.sin(ang[i]));
        ends[i] = [hub[0] + len[i] * Math.cos(ang[i]), hub[1] + len[i] * Math.sin(ang[i])];
      }
      var web = "";
      for (i = 0; i < n; i++) { web += "M" + P(hub) + "L" + P(ends[i]); }                     /* Speichen */
      var hr = 9 * s;                                                                        /* Ring in der Mitte */
      web += "M" + f(hub[0] - hr) + " " + f(hub[1]) + "a" + f(hr) + " " + f(hr) + " 0 1 0 " + f(2 * hr) + " 0" +
             "a" + f(hr) + " " + f(hr) + " 0 1 0 " + f(-2 * hr) + " 0";
      var gap = 24 * s;                                                                      /* Fangspirale: Ringe */
      for (k = 1; k * gap < 420 * s; k++) {
        var r = (k + 0.6) * gap;
        for (i = 0; i < n; i++) {
          var j2 = (i + 1) % n;
          if (r > Math.min(len[i], len[j2]) * 0.97) { continue; }                           /* endet am Rahmen */
          var p1 = [hub[0] + r * Math.cos(ang[i]), hub[1] + r * Math.sin(ang[i])];
          var p2 = [hub[0] + r * Math.cos(ang[j2]), hub[1] + r * Math.sin(ang[j2])];
          var sag = lerp(hub, lerp(p1, p2, 0.5), 0.975);
          web += "M" + P(p1) + "Q" + P(sag) + " " + P(p2);
        }
      }

      /* Rahmen und Haltefäden – die kurzen exakt entlang derselben Punkte wie oben berechnet */
      function poly(pts) { var d = "M" + P(pts[0]), q; for (q = 1; q < pts.length; q++) { d += "L" + P(pts[q]); } return d; }
      var threads = "M" + P(K1) + "L" + P(K2) +                                              /* Rahmenfaden */
                    poly(arcT) + poly(arcL) +                                                /* kurze Haltefäden */
                    "M" + P(K1) + "L" + P(F1) + "M" + P(K2) + "L" + P(F2);                   /* lange Haltefäden */
      var cx = hub[0], cy = hub[1];

      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      svg.innerHTML = '<g class="hw-sway"><path class="hw-silk" d="' + web + '"/></g>' +
                      '<path class="hw-silk hw-thread" d="' + threads + '"/>';
      svg.firstChild.style.transformOrigin = f(cx) + "px " + f(cy) + "px";   /* Netz wiegt sich um seine Mitte */

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

  document.addEventListener("DOMContentLoaded", season === "winter" ? winter : halloween);
})();
