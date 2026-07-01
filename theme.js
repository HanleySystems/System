const THEME_STORAGE_KEY = 'hanley-theme';
const root = document.documentElement;

function preferredTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    const dark = theme === 'dark';
    button.textContent = dark ? '☀' : '☾';
    button.setAttribute('aria-label', dark ? 'Use light mode' : 'Use dark mode');
    button.title = dark ? 'Use light mode' : 'Use dark mode';
    button.setAttribute('aria-pressed', String(dark));
  });
}

applyTheme(preferredTheme());

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(root.dataset.theme || preferredTheme());

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
    });
  });
});
