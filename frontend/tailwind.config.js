/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#d4af37',
        accent: '#8b7355',
        dark: '#0f0f0f',
        light: '#f8f7f4',
        cream: '#faf9f6',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #faf9f6 0%, #ffffff 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      },
    },
  },
  plugins: [],
}
