/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        netflix: {
          red: '#e50914',
          black: '#141414',
        },
        silverSand: '#c2c3c4',
        codGray: '#131112',
        roofTerracotta: '#a21f20',
        russett: '#80645c',
        accent: 'hsl(var(--accent))',
        primary: 'hsl(var(--primary))',
        card: 'hsl(var(--card))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
    },
  },
  plugins: [],
} 