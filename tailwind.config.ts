import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          light: '#f8fafc',
          dark: '#0f172a',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
