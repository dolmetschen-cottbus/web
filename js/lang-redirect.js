(function () {
    const supported = ["de", "en", "ru"];
    const storedLang = localStorage.getItem("lang");

    // Basisverzeichnis der aktuellen Datei ermitteln
    const basePath = window.location.pathname.replace(/\/[^\/]*$/, "");

    function redirect(lang) {
        window.location.replace(`${basePath}/${lang}/`);
    }

    if (storedLang && supported.includes(storedLang)) {
        redirect(storedLang);
        return;
    }

    const browserLangs = navigator.languages || [navigator.language] || ["de"];
    let lang = "de";

    for (let l of browserLangs) {
        l = l.slice(0, 2).toLowerCase();
        if (supported.includes(l)) {
            lang = l;
            break;
        }
    }

    localStorage.setItem("lang", lang);
    redirect(lang);
})();
