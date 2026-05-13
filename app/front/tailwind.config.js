/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A1F44',
        secondary: '#D4AF37',
        accent: '#F3E5AB',
        surface: '#FFFFFF',
        background: '#F8F9FA'
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Cinzel"', 'serif'],
      }
    }
  },
  plugins: []
}
