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
        background: "#050506",
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
          DEFAULT: "#0a0a0c",
          light: "#131316",
          lighter: "#1c1c21",
          border: "#2a2a30",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #A88A3D 0%, #C9A84C 30%, #e8d68e 60%, #D4BC6A 100%)",
        "gold-gradient-r": "linear-gradient(135deg, #A88A3D, #C9A84C)",
        "gold-shimmer": "linear-gradient(110deg, transparent 25%, rgba(201,168,76,0.08) 50%, transparent 75%)",
        "dark-gradient": "linear-gradient(180deg, #0a0a0c 0%, #050506 100%)",
        "card-gradient": "linear-gradient(180deg, transparent 0%, rgba(5,5,6,0.95) 100%)",
        "hero-glow": "radial-gradient(ellipse at 50% -20%, rgba(201,168,76,0.12) 0%, transparent 55%)",
        "hero-glow-2": "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)",
        "glass-border": "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(201,168,76,0.06) 100%)",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        "gold-sm": "0 1px 3px rgba(201, 168, 76, 0.08)",
        "gold-md": "0 4px 20px rgba(201, 168, 76, 0.1)",
        "gold-lg": "0 8px 40px rgba(201, 168, 76, 0.12)",
        "gold-glow": "0 0 60px rgba(201, 168, 76, 0.08)",
        "card": "0 2px 8px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.05)",
        "card-hover": "0 20px 60px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.15), 0 0 40px rgba(201,168,76,0.04)",
        "glass": "inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.3)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-up-delayed": "slideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s forwards",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "glow-pulse": "glowPulse 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "gradient-x": "gradientX 8s ease infinite",
        "reveal": "reveal 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        reveal: {
          "0%": { opacity: "0", transform: "translateY(30px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
