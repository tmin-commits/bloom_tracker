/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bloom: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        lavender: {
          50: '#fbf7ff',
          100: '#f5eeff',
          200: '#edd5fe',
          300: '#dfb7fe',
          400: '#c78ffc',
          500: '#a855f7',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e5eee5',
          200: '#ceddce',
          300: '#a7c1a8',
          400: '#7fa380',
          500: '#5e8560',
        },
        peach: {
          50: '#fff8f4',
          100: '#feefe5',
          200: '#fddbc7',
          300: '#fbbfa0',
          400: '#f89a6c',
          500: '#f36d33',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
