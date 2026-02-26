import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#f4f4f5",
        gold: {
          DEFAULT: "#C9A84C",
          light: "#D4BC6A",
          dark: "#A88A3D",
          50: "#fdf8e8",
          100: "#f5ecc5",
          200: "#e8d68e",
          300: "#d4bc6a",
          400: "#C9A84C",
          500: "#a88a3d",
          600: "#856c2f",
          700: "#635022",
          800: "#423516",
          900: "#2a220e",
        },
        surface: {
          DEFAULT: "#111113",
          light: "#18181b",
          lighter: "#27272a",
          border: "#3f3f46",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A84C, #D4BC6A, #e8d68e)",
        "gold-gradient-r": "linear-gradient(135deg, #A88A3D, #C9A84C)",
        "dark-gradient": "linear-gradient(180deg, #111113 0%, #09090b 100%)",
        "card-gradient": "linear-gradient(180deg, transparent 0%, rgba(9,9,11,0.9) 100%)",
        "hero-glow": "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%)",
      },
      boxShadow: {
        "gold-sm": "0 1px 3px rgba(201, 168, 76, 0.1)",
        "gold-md": "0 4px 14px rgba(201, 168, 76, 0.12)",
        "gold-lg": "0 8px 30px rgba(201, 168, 76, 0.15)",
        "card": "0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)",
        "card-hover": "0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
