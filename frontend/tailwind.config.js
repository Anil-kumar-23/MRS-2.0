/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#10b981', // emerald-500
          dark: '#059669', // emerald-600
          light: '#d1fae5', // emerald-100
        },
        secondary: {
          DEFAULT: '#3b82f6', // blue-500
          dark: '#2563eb', // blue-600
        },
        background: {
          light: '#f8fafc',
          dark: '#0f172a',
        },
        surface: {
          light: '#ffffff',
          dark: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}

