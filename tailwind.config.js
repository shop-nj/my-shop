/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'ui-serif', 'serif'],
      },
      colors: {
        brand: {
          50:  '#fdf2f4',
          100: '#fce4e9',
          200: '#f9c8d2',
          300: '#f39baf',
          400: '#eb6080',
          500: '#d93558',
          600: '#b81e44',
          700: '#96183a',
          800: '#7e1632',
          900: '#6b152b',
        },
      },
    },
  },
  plugins: [],
}
