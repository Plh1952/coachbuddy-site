(function(){
  var SUPPORTED = ['en','fr','es','vi','zh'];
  var LABELS = { en:'EN', fr:'FR', es:'ES', vi:'VI', zh:'中文' };
  var NAMES = { en:'English', fr:'Français', es:'Español', vi:'Tiếng Việt', zh:'中文' };

  function getLang(){
    var saved = localStorage.getItem('cb_lang');
    return SUPPORTED.indexOf(saved) !== -1 ? saved : 'en';
  }

  function applyLang(lang){
    if (SUPPORTED.indexOf(lang) === -1) lang = 'en';
    var dict = (window.CB_TRANSLATIONS && window.CB_TRANSLATIONS[lang]) || {};
    var fallback = (window.CB_TRANSLATIONS && window.CB_TRANSLATIONS.en) || {};
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      var text = dict[key] || fallback[key];
      if (text) el.textContent = text;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
      var key = el.getAttribute('data-i18n-placeholder');
      var text = dict[key] || fallback[key];
      if (text) el.setAttribute('placeholder', text);
    });
    document.documentElement.lang = lang;
    localStorage.setItem('cb_lang', lang);
    var curBtn = document.getElementById('cbLangCurrent');
    if (curBtn) curBtn.textContent = LABELS[lang] + ' ▾';
    document.querySelectorAll('.cb-lang-option').forEach(function(a){
      a.classList.toggle('active', a.getAttribute('data-lang') === lang);
    });
    document.dispatchEvent(new CustomEvent('cblangchange', { detail: { lang: lang } }));
  }

  // Global helper so inline/dynamic JS (e.g. the order builder) can fetch a
  // translated string for the currently active language, with fallback to English.
  window.cbT = function(key){
    var lang = getLang();
    var dict = (window.CB_TRANSLATIONS && window.CB_TRANSLATIONS[lang]) || {};
    var fallback = (window.CB_TRANSLATIONS && window.CB_TRANSLATIONS.en) || {};
    return dict[key] || fallback[key] || key;
  };

  window.cbGetLang = getLang;

  window.cbSetLang = function(lang){
    applyLang(lang);
    var menu = document.getElementById('cbLangMenu');
    if (menu) menu.style.display = 'none';
  };

  window.cbToggleLangMenu = function(){
    var menu = document.getElementById('cbLangMenu');
    if (!menu) return;
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
  };

  document.addEventListener('click', function(e){
    var switcher = document.getElementById('cbLangSwitcher');
    var menu = document.getElementById('cbLangMenu');
    if (menu && switcher && !switcher.contains(e.target)) menu.style.display = 'none';
  });

  document.addEventListener('DOMContentLoaded', function(){
    applyLang(getLang());
  });
})();
