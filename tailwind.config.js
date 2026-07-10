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
      },
      colors: {
        bg: {
          DEFAULT: "#0a0a0f",
          secondary: "#111118",
          card: "#16161e",
          hover: "#1c1c28",
        },
        border: {
          DEFAULT: "#2a2a3a",
          subtle: "#1e1e2e",
          focus: "#3b82f6",
        },
        accent: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
          muted: "#1d4ed8",
          subtle: "#1e3a5f",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#64748b",
          disabled: "#475569",
        },
        success: {
          DEFAULT: "#22c55e",
          hover: "#16a34a",
          subtle: "rgba(34, 197, 94, 0.1)",
        },
        warning: {
          DEFAULT: "#f59e0b",
          subtle: "rgba(245, 158, 11, 0.1)",
        },
        danger: {
          DEFAULT: "#ef4444",
          subtle: "rgba(239, 68, 68, 0.1)",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      boxShadow: {
        card: "0 0 0 1px rgba(42,42,58,0.8), 0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 0 0 1px rgba(59,130,246,0.5), 0 8px 32px rgba(0,0,0,0.6)",
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.5)",
        glow: "0 0 20px rgba(59, 130, 246, 0.5)",
        "glow-sm": "0 0 10px rgba(59, 130, 246, 0.3)",
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at top, rgba(29, 78, 216, 0.15), transparent 80%)',
        'text-gradient': 'linear-gradient(to right, #60a5fa, #93c5fd, #c084fc)',
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
