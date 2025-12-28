/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        earth: {
          bg: '#2a1810',
          card: '#3d2817',
          accent: '#8b2635',
          gold: '#d4af37',
          text: '#e8d5b5',
          success: '#6b8e4e',
          warning: '#c77d4f'
        }
      }
    },
  },
  plugins: [],
}
