/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium minimal color palette
        lavender: {
          50: '#faf8ff',
          100: '#f3f0ff',
          200: '#e9e3ff',
          300: '#d4c5ff',
          400: '#b794f6',
          500: '#9f7aea',
          600: '#805ad5',
          700: '#6b46c1',
          800: '#553c9a',
          900: '#44337a',
        },
        // Light theme specific colors
        light: {
          bg: '#fafafa',
          surface: '#ffffff',
          card: '#ffffff',
          border: '#e5e7eb',
          text: {
            primary: '#1f2937',
            secondary: '#6b7280',
            tertiary: '#9ca3af',
          }
        },
        primary: {
          cyan: '#00D9FF',
          purple: '#7B2CBF',
          pink: '#FF006E',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00D9FF 0%, #7B2CBF 50%, #FF006E 100%)',
        'gradient-lavender': 'linear-gradient(135deg, #b794f6 0%, #9f7aea 100%)',
        'gradient-lavender-soft': 'linear-gradient(135deg, #f3f0ff 0%, #e9e3ff 100%)',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'lavender': '0 4px 16px rgba(159, 122, 234, 0.15)',
      }
    },
  },
  plugins: [],
}
