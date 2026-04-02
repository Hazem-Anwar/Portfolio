import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        text: "var(--text)",
        accent: "var(--accent)",
        "accent-light": "var(--accent-light, #3b82f6)",
        muted: "var(--muted)",
        border: "var(--border)",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-epilogue)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
        space: ["var(--font-space-grotesk)", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        "fluid-hero": "clamp(5rem, 18vw, 22rem)",
        "fluid-h1": "clamp(3rem, 8vw, 9rem)",
        "fluid-h2": "clamp(2rem, 5vw, 5rem)",
        "fluid-h3": "clamp(1.5rem, 3vw, 3rem)",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};

export default config;
