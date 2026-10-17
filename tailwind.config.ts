import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        canvas: {
          light: "#FBF9F5",
          dark: "#0E1712",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
          border: "var(--card-border)",
        },
        farm: {
          50: "#F2F7F4",
          100: "#E3EFE8",
          200: "#C6DFCE",
          300: "#9ECAA9",
          400: "#6FAF7D",
          500: "#449255",
          600: "#317442",
          700: "#265A35",
          800: "#1C3D26",
          900: "#16301E",
          950: "#0B1A10",
        },
        primary: {
          DEFAULT: "#173426",
          hover: "#1F4332",
          foreground: "#FFFFFF",
        },
        amber: {
          accent: "#E7AC38",
          hover: "#D69B2A",
          light: "#FEF7E6",
        },
        coral: {
          DEFAULT: "#DF5D52",
          light: "#FDEEEC",
        },
        mint: {
          DEFAULT: "#10B981",
          light: "#E6F6ED",
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(24, 39, 30, 0.05), 0 1px 3px 0 rgba(24, 39, 30, 0.03)',
        'card': '0 4px 20px -2px rgba(24, 39, 30, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
