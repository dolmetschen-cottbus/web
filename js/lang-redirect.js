(function () {
    const supported = ["de", "en", "ru"];
    let storedLang = localStorage.getItem("lang");

    if(storedLang && supported.includes(storedLang)){
        window.location.replace(`/${storedLang}/`);
        return;
    }

    const browserLang = navigator.language ? navigator.language.slice(0,2) : 'de';

    if(supported.includes(browserLang)){
        localStorage.setItem("lang", browserLang);
        window.location.replace(`/${browserLang}/`);
    } else {
        localStorage.setItem("lang", "de");
        window.location.replace("/de/");
    }
})();