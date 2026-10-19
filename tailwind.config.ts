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
        zinc: {
          850: "#1b1b1f",
          950: "#09090b",
        },
        brand: {
          push: "#f97316", // Amber-Orange
          pull: "#0ea5e9", // Sky-Cyan
          legs: "#10b981", // Emerald
          gold: "#eab308",
          dark: "#09090b",
        },
      },
      fontFamily: {
        sans: ["var(--font-barlow)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-barlow-condensed)", "Impact", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
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
