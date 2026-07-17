import { defineStore } from "pinia";

// 目前仅支持 light 主题；预留 dark 分支以便后续接入深色模式。
type Theme = "dark" | "light";

const THEME_KEY = "lab-theme";

/**
 * 获取初始主题。当前固定返回 "light"（尚未开放深色模式切换给用户），
 * 后续若要支持跟随系统或读取本地存储，只需修改这一处。
 */
function getPreferredTheme(): Theme {
  return "light";
}

/** 把主题写入 <html> 的 class / data-theme，并持久化到 localStorage。 */
function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(THEME_KEY, theme);
}

/**
 * 全局应用状态：当前只管理两件事——
 * 1. 主题（theme，目前恒为 light）；
 * 2. 移动端导航菜单的展开状态（menuOpen），由 SiteHeader 的汉堡按钮控制。
 */
export const useAppStore = defineStore("app", {
  state: () => ({
    theme: "light" as Theme,
    menuOpen: false,
  }),
  actions: {
    // 应用挂载时调用一次，恢复主题偏好并应用到 DOM。
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
