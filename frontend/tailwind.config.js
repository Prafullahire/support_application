/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#120303',
          maroon: '#2b0303',
          red: '#8f0f0f',
          'red-bright': '#c81e1e',
          white: '#FFFFFF',
        },
        accent: {
          green: '#17a34a',
          'green-dark': '#0e7a37',
        },
        surface: {
          card: '#ffffff',
          muted: '#f6f3f1',
        },
        'text-muted': '#8a8a8a',
        primary: {
          DEFAULT: '#DC2626',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        sidebar: {
          DEFAULT: '#0A0A0A',
          light: '#171717',
          foreground: '#FFFFFF',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.08)',
        'card-hover': '0 4px 12px 0 rgb(220 38 38 / 0.12)',
      },
    },
  },
  plugins: [],
};
