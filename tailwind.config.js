/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bakery-gold": "#D4AF37",
        "bakery-brown": "#6B4423",
        "bakery-cream": "#F5E6D3",
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        sans: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },
    },
  },
  plugins: [],
};
