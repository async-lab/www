import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  theme: {
    extend: {
      colors: {
        lab: {
          bg: "var(--color-bg)",
          surface: "var(--color-surface)",
          elevated: "var(--color-elevated)",
          border: "var(--color-border)",
          text: "var(--color-text)",
          muted: "var(--color-muted)",
          primary: "var(--color-primary)",
          primaryDark: "var(--color-primary-dark)",
          primaryLight: "var(--color-primary-light)",
        },
        direction: {
          frontend: "#00D4FF",
          backend: "#00FF88",
          mobile: "#FF00FF",
          embedded: "#FFB800",
        },
      },
      fontFamily: {
        display: ["Exo", "Inter", "SF Pro Display", "Microsoft YaHei", "sans-serif"],
        sans: ["Inter", "HarmonyOS Sans", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        mono: ["Roboto Mono", "Fira Code", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 102, 255, 0.28)",
        "glow-strong": "0 0 72px rgba(0, 102, 255, 0.42)",
      },
      keyframes: {
        caret: {
          "0%, 45%": { opacity: "1" },
          "46%, 100%": { opacity: "0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        caret: "caret 1s steps(1) infinite",
        scan: "scan 7s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
