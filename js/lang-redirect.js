(function () {
    const supported = ["de", "en", "ru"];

    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const currentLang = pathParts[pathParts.length - 1];

    // 1. Wenn wir bereits in einem Sprachordner sind → abbrechen
    if (supported.includes(currentLang)) {
        localStorage.setItem("lang", currentLang);
        return;
    }

    // 2. LocalStorage bevorzugen
    const storedLang = localStorage.getItem("lang");
    if (storedLang && supported.includes(storedLang)) {
        window.location.replace(`./${storedLang}/`);
        return;
    }

    // 3. Browser-Sprache ermitteln
    const browserLangs = navigator.languages || [navigator.language] || [];
    let lang = "de";

    for (let l of browserLangs) {
        l = l.slice(0, 2).toLowerCase();
        if (supported.includes(l)) {
            lang = l;
            break;
        }
    }

    localStorage.setItem("lang", lang);
    window.location.replace(`./${lang}/`);
})();
