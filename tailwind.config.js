/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        noto: ['"Noto Serif"', 'serif'],
        bayon: ['Bayon', 'sans-serif'],
      },
    },
  },
  plugins: [],
}