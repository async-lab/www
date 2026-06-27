import { defineStore } from "pinia";

type Theme = "dark" | "light";

const THEME_KEY = "lab-theme";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(THEME_KEY, theme);
}

export const useAppStore = defineStore("app", {
  state: () => ({
    theme: "dark" as Theme,
    menuOpen: false,
  }),
  actions: {
    initTheme() {
      this.theme = getPreferredTheme();
      applyTheme(this.theme);
    },
    setTheme(theme: Theme) {
      this.theme = theme;
      applyTheme(theme);
    },
    toggleTheme() {
      this.setTheme(this.theme === "dark" ? "light" : "dark");
    },
    setMenuOpen(open: boolean) {
      this.menuOpen = open;
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  },
});
