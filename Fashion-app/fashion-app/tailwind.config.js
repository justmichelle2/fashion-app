module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7a5c01",
        teal: "#006D5B",
        accent: "#b04c05",
        background: "#FDFDFD",
        textPrimary: "#111827",
        textSecondary: "#4B5563",
        success: "#10B981",
        error: "#EF4444",
      },
      keyframes: {
        logoSpinFade: {
          '0%': { opacity: 0, transform: 'rotate(-180deg) scale(0.9)' },
          '100%': { opacity: 1, transform: 'rotate(360deg) scale(1)' },
        },
      },
      animation: {
        logoSpinFade: 'logoSpinFade 1.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};