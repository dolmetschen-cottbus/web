(function () {
    const supported = ["de", "en", "ru"];
    let storedLang = localStorage.getItem("lang");

    if (storedLang && supported.includes(storedLang)) {
        window.location.replace(`/web/${storedLang}/`);
        return;
    }

    // Alle bevorzugten Sprachen des Browsers prüfen
    const browserLangs = navigator.languages || [navigator.language] || ['de'];
    let lang = "de"; // default fallback

    for (let l of browserLangs) {
        l = l.slice(0,2).toLowerCase();
        if (supported.includes(l)) {
            lang = l;
            break;
        }
    }

    localStorage.setItem("lang", lang);
    window.location.replace(`/web/${lang}/`);
})();
