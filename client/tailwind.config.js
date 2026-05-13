/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        zhust: {
          primary: '#000033',
          secondary: '#3b82f6',
          accent: '#ffbf00',
          dark: '#000022',
        }
      }
    },
  },
  plugins: [],
}
