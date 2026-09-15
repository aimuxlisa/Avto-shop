/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#060B19",
        card: "rgba(15, 23, 42, 0.65)",
        cardBorder: "rgba(56, 189, 248, 0.2)",
        neonBlue: "#38BDF8",
        accentBlue: "#2563EB",
        glowCyan: "#06b6d4",
      },
      boxShadow: {
        'neon-blue': '0 0 20px -2px rgba(56, 189, 248, 0.5), 0 0 10px -2px rgba(37, 99, 235, 0.5)',
        'neon-podium': '0 10px 35px -5px rgba(56, 189, 248, 0.6), inset 0 0 20px rgba(56, 189, 248, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-sm': '0 0 12px rgba(56, 189, 248, 0.4)',
      },
      backdropBlur: {
        'glass': '16px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
