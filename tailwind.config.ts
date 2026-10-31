import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          main: "var(--bg-main)",
          secondary: "var(--bg-secondary)",
          card: "var(--bg-card)",
          elevated: "var(--bg-elevated)",
        },
        content: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        accent: {
          primary: "var(--accent-primary)",
          "primary-fill": "var(--accent-primary-fill)",
          secondary: "var(--accent-secondary)",
          "secondary-fill": "var(--accent-secondary-fill)",
        },
        border: {
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
        // Athletic split indicators
        brand: {
          push: "#f97316", // Amber-Orange
          pull: "#0ea5e9", // Sky-Cyan
          legs: "#10b981", // Emerald
          gold: "#eab308",
          volt: "#B7FF4A", // Athletic Volt
          teal: "#36D6B0", // Biomechanics Teal
          dark: "#090B0F",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-push": "glowPush 2s ease-in-out infinite alternate",
        "float": "float 4s ease-in-out infinite",
      },
      keyframes: {
        glowPush: {
          "0%": { boxShadow: "0 0 10px rgba(249, 115, 22, 0.2)" },
          "100%": { boxShadow: "0 0 25px rgba(249, 115, 22, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
