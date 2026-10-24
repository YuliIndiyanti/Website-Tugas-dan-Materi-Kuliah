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
        pastel: {
          lavender: {
            DEFAULT: "#E0E7FF",
            dark: "#312E81",
            text: "#3730A3",
            textDark: "#E0E7FF",
          },
          sakura: {
            DEFAULT: "#FCE7F3",
            dark: "#831843",
            text: "#9D174D",
            textDark: "#FCE7F3",
          },
          mint: {
            DEFAULT: "#D1FAE5",
            dark: "#064E3B",
            text: "#065F46",
            textDark: "#D1FAE5",
          },
          sky: {
            DEFAULT: "#E0F2FE",
            dark: "#075985",
            text: "#075985",
            textDark: "#BAE6FD",
          },
          rose: {
            DEFAULT: "#FFE4E6",
            dark: "#9F1239",
            text: "#9F1239",
            textDark: "#FECDD3",
          },
          apricot: {
            DEFAULT: "#FEF3C7",
            dark: "#92400E",
            text: "#92400E",
            textDark: "#FDE68A",
          },
          lilac: {
            DEFAULT: "#F3E8FF",
            dark: "#6B21A8",
            text: "#6B21A8",
            textDark: "#E9D5FF",
          },
          peach: {
            DEFAULT: "#FFEDD5",
            dark: "#9A3412",
            text: "#9A3412",
            textDark: "#FED7AA",
          },
          butter: {
            DEFAULT: "#FEF9C3",
            dark: "#854D0E",
            text: "#854D0E",
            textDark: "#FEF08A",
          },
          stone: {
            DEFAULT: "#F1F5F9",
            dark: "#334155",
            text: "#475569",
            textDark: "#E2E8F0",
          },
          cream: {
            DEFAULT: "#FDFBF7",
            card: "#FFFFFF",
            dark: "#0F172A",
            darkCard: "#1E293B",
          },
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)",
        "soft-hover": "0 10px 25px -3px rgba(0, 0, 0, 0.07), 0 4px 10px -2px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
