/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'audacia-rose': '#7A5C6E',
        'audacia-gold': '#D4AF37',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, rgba(212,175,55,1) 0%, rgba(245,223,124,1) 50%, rgba(212,175,55,1) 100%)',
      }
    },
  },
  plugins: [],
}
