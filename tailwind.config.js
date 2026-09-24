/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Orbitron"', "sans-serif"],
        sans: ['"Space Grotesk"', "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tighter: "-0.06em",
      },
      lineHeight: {
        0.85: "0.85",
      },
    },
  },
  plugins: [],
};
