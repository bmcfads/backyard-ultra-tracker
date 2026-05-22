import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "ping-slow": "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-atkinson)", "sans-serif"],
        heading: ["var(--font-barlow)", "sans-serif"],
      },
      colors: {
        bg: "#0a0a0a",
        surface: "#111111",
        border: "#2a2a2a",
        muted: "#999999",
        text: "#e5e5e5",
        accent: "#a3e635",
        brand: "#00C1D5",
      },
    },
  },
  plugins: [],
};

export default config;
