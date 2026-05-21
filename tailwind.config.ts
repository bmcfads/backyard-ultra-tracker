import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      colors: {
        bg: "#0a0a0a",
        surface: "#111111",
        border: "#2a2a2a",
        muted: "#555555",
        text: "#e5e5e5",
        accent: "#a3e635",
      },
    },
  },
  plugins: [],
};

export default config;
