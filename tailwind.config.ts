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
      },
      fontFamily: {
        display: ["Exo", "Inter", "SF Pro Display", "Microsoft YaHei", "sans-serif"],
        sans: ["Inter", "HarmonyOS Sans", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        mono: ["Roboto Mono", "Fira Code", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 16px 48px rgba(0, 102, 255, 0.14)",
        "glow-strong": "0 24px 80px rgba(0, 102, 255, 0.16)",
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
