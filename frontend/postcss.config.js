/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        navy: {
          700: "#1e293b",
          750: "#182235",
          800: "#0f172a",
          900: "#0a0f1e",
        },
      },
    },
  },
  plugins: [],
};