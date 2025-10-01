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
        "orange-third": "#f76200",
        "nav-overlay-color": "rgba(0, 0, 0, 0.7)",
      },
      scale: {
        "scale-102": "1.02",
      },
      fontFamily: {
        Montserrat: ["Montserrat", "Arial", "sans-serif"],
        Bai_Jamjuree: ["Bai Jamjuree", "Arial", "sans-serif"],
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
      keyframes: {
        spin: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
