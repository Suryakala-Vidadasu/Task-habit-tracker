/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0A0E17",
          900: "#0F1420",
          800: "#161D2E",
          700: "#1F293D",
        },
        violet: {
          50: "#F4F2FF",
          100: "#EAE5FF",
          400: "#9A85FF",
          500: "#7C5CFC",
          600: "#6540E8",
          700: "#5230C4",
        },
        cyan: {
          400: "#3FE3D6",
          500: "#22D3C4",
        },
        ember: {
          400: "#FF9D5C",
          500: "#FB7A3B",
          600: "#E85F1F",
        },
        surface: {
          light: "#F7F7FB",
          card: "#FFFFFF",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "aurora-light":
          "radial-gradient(60% 50% at 20% 0%, #EAE5FF 0%, transparent 60%), radial-gradient(50% 40% at 90% 10%, #D9FBF7 0%, transparent 55%)",
        "aurora-dark":
          "radial-gradient(60% 50% at 20% 0%, rgba(124,92,252,0.25) 0%, transparent 60%), radial-gradient(50% 40% at 90% 10%, rgba(63,227,214,0.15) 0%, transparent 55%)",
        "brand-gradient": "linear-gradient(135deg, #7C5CFC 0%, #3FE3D6 100%)",
        "ember-gradient": "linear-gradient(135deg, #FF9D5C 0%, #FB7A3B 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(31, 41, 61, 0.08)",
        "glass-dark": "0 8px 32px rgba(0, 0, 0, 0.4)",
        glow: "0 0 0 1px rgba(124,92,252,0.15), 0 8px 24px rgba(124,92,252,0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: 0, transform: "scale(0.96)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "pop-in": "pop-in 0.25s ease-out both",
        shimmer: "shimmer 1.6s infinite linear",
      },
    },
  },
  plugins: [],
};
