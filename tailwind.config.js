/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        serif: ["var(--font-instrument-serif)", "serif"],
      },
      colors: {
        bg: {
          canvas: "var(--bg-canvas)",
          surface: "var(--bg-surface)",
          wash: {
            violet: "var(--bg-wash-violet)",
            mint: "var(--bg-wash-mint)",
          },
        },
        border: {
          hairline: "var(--border-hairline)",
          strong: "var(--border-strong)",
        },
        accent: {
          violet: "var(--accent-violet)",
          "violet-hover": "var(--accent-violet-hover)",
          mint: "var(--accent-mint)",
          "mint-hover": "var(--accent-mint-hover)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          inverse: "var(--text-inverse)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
      },
      animation: {
      },
      keyframes: {
      },
      boxShadow: {
        sm: "none",
        DEFAULT: "none",
        md: "none",
        lg: "none",
        card: "none",
        "card-hover": "none",
        glow: "0 0 24px rgba(124, 58, 237, 0.25)",
      },
      backgroundImage: {
      },
      borderRadius: {
        sm: "4px",
        md: "4px",
        lg: "6px",
        xl: "6px",
        "2xl": "6px",
      },
    },
  },
  plugins: [],
};
