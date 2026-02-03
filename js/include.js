async function include(selector, url) {
    const el = document.querySelector(selector);
    if(!el) return;
    const res = await fetch(url);
    el.innerHTML = await res.text();
}

function setLang(lang) {
    localStorage.setItem("lang", lang);
}