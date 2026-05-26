import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Trades brand — warm, industrial, credible
        trades: {
          50:  '#fdf3ec',
          100: '#fae3d0',
          200: '#f5c49e',
          300: '#ef9f65',
          400: '#e87a35',
          500: '#c8511b',  // primary orange
          600: '#a03e10',
          700: '#7a2f0a',
          800: '#542106',
          900: '#2c1204',
        },
        ink: {
          900: '#1a1007',
          800: '#2c1a0e',
          700: '#4a2d15',
          600: '#7a4523',
          500: '#a8713e',
          400: '#c89870',
          300: '#e0c4a8',
          200: '#f0dece',
          100: '#faf5f0',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 24px rgba(200, 81, 27, 0.25)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
export default config
