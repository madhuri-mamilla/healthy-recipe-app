/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#f2f9ee',
          100: '#e0f0d6',
          500: '#5a9c3f',
          600: '#487f32',
          700: '#396527',
        },
        turmeric: {
          400: '#f2b134',
          500: '#e29a12',
        },
      },
    },
  },
  plugins: [],
}
