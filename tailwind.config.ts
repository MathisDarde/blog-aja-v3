import { Bai_Jamjuree, Montserrat } from "next/font/google";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "aja-blue": "#3c77b4",
        "nav-overlay-color": "rgba(0, 0, 0, 0.7)",
      },
      scale: {
        "scale-102": "1.02",
      },
      fontFamily: {
        Montserrat: ["Montserrat", "Arial", "sans-serif"],
        Bai_Jamjuree: ["Bai Jamjuree", "Arial", "sans-serif"],
      },
      fontSize: {
        "maxi-xl": "15rem",
      },
      width: {
        "w-600": "600px",
      },
      maxWidth: {
        "max-w-pitch": "37.5rem",
      },
      height: {
        "h-0.25": "1px",
      },
      backgroundImage: {
        "pitch-bg": "url('/assets/terrains/demiterrain.png')",
      },
    },
  },
  plugins: [],
} satisfies Config;
