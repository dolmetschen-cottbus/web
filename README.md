# Elena Mieck – Dolmetscherin Deutsch–Russisch in Cottbus

Webseite: **https://dolmetschen-cottbus.github.io/web/** (Deutsch: [`/de/`](https://dolmetschen-cottbus.github.io/web/de/), Russisch: [`/ru/`](https://dolmetschen-cottbus.github.io/web/ru/))

Statische Seite auf GitHub Pages: dunkles Design mit schwebender Glas-Kopfleiste und Startseite als One-Pager, dazu drei Leistungsseiten, Impressum und Datenschutz, alles auf Deutsch und Russisch.

---

## Technik

| Thema | Umsetzung |
|---|---|
| Aufbau | reines HTML + CSS, kein Framework, kein Build-Schritt, kein npm |
| JavaScript | nur eigene Dateien, die Seite funktioniert auch ohne JS: `site.js`, `hero-art.js`, `season.js`, `reveal.js` |
| Datenschutz | keine externen Ressourcen, keine Tracker, keine Cookies; Schriften liegen lokal in `fonts/` |
| Sicherheit | Content-Security-Policy per `<meta>`: `script-src 'self'` plus Hash für JSON-LD, kein Inline-JS |
| SEO | canonical, hreflang DE/RU, Open Graph mit Vorschaubildern, JSON-LD, `sitemap.xml`, `robots.txt` |
| Barrierefreiheit | Sprunglink, Fokus-Ringe, `lang`-Attribute; bei „Bewegung reduzieren“ sind alle Animationen und Easter Eggs aus |
| Schriften | Jost (Überschriften) und Source Sans 3 (Text), jeweils als Teilmenge Latein + Kyrillisch |

### Struktur

```
index.html            Weiterleitung auf de/
de/, ru/              index.html (One-Pager: #start, #leistungen, #ueber-mich, #kontakt),
                      wirtschaft-forschung, behoerden-justiz, technik-ausbildung, impressum, datenschutz
                      about.html / contact.html = Weiterleitungen auf #ueber-mich / #kontakt
404.html              eigene Fehlerseite (absolute /web/-Pfade)
style.css             gesamtes Design inkl. Druckansicht und Easter Eggs
site.js               Navigation, Sprachwechsel, Kopieren, Dolmetsch-Modus, Konsolengruß
hero-art.js           wechselnde Grafiken im Startbereich, Festtagsgrüße
season.js             saisonale Easter Eggs
reveal.js             sanftes Einblenden beim Scrollen
site.webmanifest      App-Symbol für den Startbildschirm (icon-*.png, apple-touch-icon.png)
elena-mieck.vcf       Kontakt zum Speichern (vCard)
img/                  Porträt, Vorschaubilder (og-de.jpg, og-ru.jpg)
fonts/                Schriften + LICENSE.md
```

### Lokal testen

```bash
# im Elternordner des Repos (damit der Pfad /web/ stimmt)
python -m http.server 8000
```

Dann `http://localhost:8000/web/de/` aufrufen. Nach Änderungen immer **Strg+F5** drücken, damit der Browser-Cache nicht die alte Fassung zeigt. Kopieren in die Zwischenablage funktioniert nur über `localhost` oder https.

---

## Funktionen

### Startseite
- **Hero-Grafiken** wechseln alle 10 Sekunden: Begrüßung (Wortpaare DE ⇄ RU) → Globus → Buchstaben. Ein Klick auf die Grafik springt zur nächsten.
- **One-Pager:** Das Menü markiert den Abschnitt, der gerade im Bild ist. Am Desktop rasten die Abschnitte sanft ein.
- **Seitenübergänge** (View Transitions) und **Einblenden beim Scrollen**.

### Helfer auf allen Seiten
- **Sprachwechsel behält die Stelle:** Wer auf der Startseite bei „Kontakt“ auf RU klickt, landet auf `ru/index.html#kontakt`.
- **Sprachhinweis:** Ist der Browser auf Russisch eingestellt, erscheint einmalig eine Glas-Pille „Сайт есть и на русском языке →“. Sie lässt sich wegklicken und kommt dann nicht wieder.
- **E-Mail:** Ein Klick öffnet eine vorformulierte Anfrage und kopiert zusätzlich die Adresse („Adresse kopiert ✓“).
- **Telefon:** Am Handy wird gewählt, am Desktop wird die Nummer kopiert („Nummer kopiert ✓“).
- **Kontakt speichern:** vCard-Download im Kontaktbereich.
- **App-Symbol:** Über „Zum Startbildschirm hinzufügen“ erscheint das EM-Monogramm als App.
- **Druckansicht:** helles, sauberes Layout ohne Animationen.

---

## Easter Eggs

Die saisonalen Easter Eggs schalten sich nach Datum von selbst ein. Mit einem Parameter an der Adresse lassen sie sich jederzeit ansehen. Die Parameter funktionieren auf jeder Seite, die Beispiele nutzen die deutsche Startseite. Bei „Bewegung reduzieren“ (Betriebssystem-Einstellung) sind alle aus.

### Saisonal

| Easter Egg | Zeitraum | Ansehen |
|---|---|---|
| **Winter:** 7 Eiskristalle schweben über die Seite, gläserne Eiszapfen hängen an der Kopfleiste (jedes Mal anders gewachsen, ab und zu tropft einer), Goldkristall am Monogramm | 1. Dezember – 31. Januar | [`de/?winter`](https://dolmetschen-cottbus.github.io/web/de/?winter) |
| **Weihnachtsmütze:** Hover auf Elenas Foto (bei „Über mich“), am Handy antippen | 24.–26.12., 31.12., 1.1. | [`de/?winter`](https://dolmetschen-cottbus.github.io/web/de/?winter#ueber-mich) |
| **Festtagsgruß** in der Begrüßungsgrafik: „Frohe Weihnachten!“ / „Frohes neues Jahr!“ / russisches Weihnachten „С Рождеством!“ | 1.–26.12. / 27.12.–5.1. / 6.–8.1. | [`?fest=xmas`](https://dolmetschen-cottbus.github.io/web/de/?fest=xmas) · [`?fest=ny`](https://dolmetschen-cottbus.github.io/web/de/?fest=ny) · [`?fest=xmasru`](https://dolmetschen-cottbus.github.io/web/de/?fest=xmasru) |
| **Silvester:** Goldfeuerwerk links und rechts im Startbereich, eine Rakete bei jedem Klick auf freie Fläche, Eiszapfen ja, Schnee nein | 31.12. und 1.1. | [`de/?silvester`](https://dolmetschen-cottbus.github.io/web/de/?silvester) |
| **Frauentag:** Ein Mimosenzweig wächst am Monogramm | 8. März | [`de/?frauentag`](https://dolmetschen-cottbus.github.io/web/de/?frauentag) |
| **Ostern:** Zarenei als erste Grafik (der Deckel öffnet sich, innen leuchtet „EM“), Gruß „Frohe Ostern!“ – „Светлой Пасхи!“, Gold-Ei am Monogramm, **Eiersuche** mit drei versteckten Eiern an zufälligen Stellen (alle gefunden → Gruß) | Palmsonntag – Ostermontag, westlich **und** orthodox | [`de/?ostern`](https://dolmetschen-cottbus.github.io/web/de/?ostern) |
| **Orthodoxes Ostern:** wie oben, mit dem Gruß „Христос воскресе!“ | orthodoxe Osterzeit | [`de/?ostern&fest=easterru`](https://dolmetschen-cottbus.github.io/web/de/?ostern&fest=easterru) |
| **Übersetzertag:** Eine Feder schreibt „EM“ in Schreibschrift, danach „Frohen Übersetzertag!“ – „С Днём переводчика!“ | 30. September | [`de/?fest=transl`](https://dolmetschen-cottbus.github.io/web/de/?fest=transl) |
| **Halloween:** Spinnennetz oben rechts (flattert bei Berührung), Abseil-Spinne an der Kopfleiste, Krabbelspinne, die vor der Maus flieht, neugierige Spinne nach dem Wackeln am Netz; **„Grusel-Lena“** beim Hover aufs Foto (Mondlicht, Hexenhut, Fledermäuse); Fledermäuse auch beim Hover übers Monogramm | 25. Oktober – 1. November | [`de/?halloween`](https://dolmetschen-cottbus.github.io/web/de/?halloween) |

### Immer da

| Easter Egg | Auslösen |
|---|---|
| **Nächste Grafik** im Startbereich | Klick auf die Grafik |
| **Dolmetsch-Modus:** Die Texte drehen sich wie Karten und zeigen 15 Sekunden lang die andere Sprache. Erneutes Auslösen dreht zurück. | dreimal schnell aufs Monogramm „EM“ klicken, oder die Tasten **R**, **U** tippen (auf den russischen Seiten **D**, **E**) |
| **Gruß in der Konsole** mit Geheimtipp | Entwicklertools öffnen (F12) → Konsole |

### Weitere Testadressen

| Adresse | Wirkung |
|---|---|
| [`de/?art=greet`](https://dolmetschen-cottbus.github.io/web/de/?art=greet) · [`?art=globe`](https://dolmetschen-cottbus.github.io/web/de/?art=globe) · [`?art=glyph`](https://dolmetschen-cottbus.github.io/web/de/?art=glyph) | Startgrafik direkt wählen |
| [`de/?art=egg`](https://dolmetschen-cottbus.github.io/web/de/?art=egg) · [`?art=quill`](https://dolmetschen-cottbus.github.io/web/de/?art=quill) | Zarenei bzw. schreibende Feder direkt zeigen |
| [`de/?sprachhinweis`](https://dolmetschen-cottbus.github.io/web/de/?sprachhinweis) | Sprachhinweis auf die russische Fassung erzwingen |
| [`gibtsnicht`](https://dolmetschen-cottbus.github.io/web/gibtsnicht) | eigene 404-Seite |

Alle Parameter gehen auch auf den russischen Seiten, zum Beispiel [`ru/?halloween`](https://dolmetschen-cottbus.github.io/web/ru/?halloween).

---

## Prüfung

- [W3C HTML](https://validator.w3.org/nu/?doc=https%3A%2F%2Fdolmetschen-cottbus.github.io%2Fweb%2Fde%2F) (DE-Startseite) · [W3C CSS](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fdolmetschen-cottbus.github.io%2Fweb%2Fstyle.css&profile=css3svg&usermedium=all&warning=1)
  Bekannte, harmlose Meldungen:
  - CSS: `@view-transition` (der Validator kennt es noch nicht)
  - HTML: Hinweis zum JSON-LD-Block
- [PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fdolmetschen-cottbus.github.io%2Fweb%2Fde%2F)

---

## Lizenzen

- Jost, Source Sans 3: SIL Open Font License 1.1
- Great Vibes: SIL Open Font License 1.1, nur die Umrisse von „E“ und „M“ als SVG-Pfad in der Übersetzertag-Grafik, keine Schriftdatei

Details in [`fonts/LICENSE.md`](fonts/LICENSE.md).

Texte, Fotos und Inhalte © Elena Mieck.
