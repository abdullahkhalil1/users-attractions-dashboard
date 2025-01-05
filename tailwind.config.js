/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'brandPrimary': '#3f51b5',
        'bgSecondary': '#FAFAF9',
      }
    },
  },
  plugins: [],
}