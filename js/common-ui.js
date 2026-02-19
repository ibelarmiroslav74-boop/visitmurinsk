function normalizePath(path) {
  if (!path) {
    return '/';
  }

  const cleanPath = path.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (cleanPath === '') {
    return '/';
  }

  return cleanPath.endsWith('/') && cleanPath !== '/' ? cleanPath.slice(0, -1) : cleanPath;
}

function highlightActiveMenuItem() {
  const currentPath = normalizePath(window.location.pathname);
  document.querySelectorAll('#menu a').forEach((link) => {
    const linkPath = normalizePath(new URL(link.getAttribute('href'), window.location.origin).pathname);
    link.classList.toggle('active', linkPath === currentPath);
  });
}

function initThemeToggle(themeButton) {
  const savedTheme = sessionStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.body.classList.remove('dark');
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark');
  }

  themeButton.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    sessionStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

function createLanguageController(langButton, onChange) {
  let lang = 'ru';

  const updateLang = () => {
    langButton.textContent = lang.toUpperCase();
    document.querySelectorAll('[data-ru]').forEach((element) => {
      element.style.display = lang === 'ru' ? 'block' : 'none';
    });
    document.querySelectorAll('[data-en]').forEach((element) => {
      element.style.display = lang === 'en' ? 'block' : 'none';
    });

    if (typeof onChange === 'function') {
      onChange(lang);
    }
  };

  langButton.addEventListener('click', () => {
    lang = lang === 'ru' ? 'en' : 'ru';
    langButton.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }],
      { duration: 200 }
    );
    updateLang();
  });

  updateLang();

  return {
    getLang: () => lang,
    setLang: (value) => {
      lang = value;
      updateLang();
    },
  };
}

function initMenuUI(options = {}) {
  const menuButton = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  const themeButton = document.getElementById('themeBtn');
  const langButton = document.getElementById('langBtn');

  if (!menuButton || !menu || !themeButton || !langButton) {
    return;
  }

  menuButton.addEventListener('click', () => {
    menuButton.classList.toggle('open');
    menu.classList.toggle('show');
  });

  highlightActiveMenuItem();
  initThemeToggle(themeButton);

  return createLanguageController(langButton, options.onLanguageChange);
}

function loadMenu(containerId = 'menu-container') {
  return fetch('menu.html')
    .then((response) => response.text())
    .then((html) => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = html;
      }
      return html;
    });
}
