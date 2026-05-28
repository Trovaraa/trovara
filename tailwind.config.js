/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trovara: {
          green: {
            DEFAULT: '#1A6B3C',
            50:  '#EDF7F1',
            100: '#D2EDE0',
            200: '#A5DBC1',
            300: '#78C8A2',
            400: '#4BB583',
            500: '#2D9960',
            600: '#1A6B3C',
            700: '#145330',
            800: '#0D3B22',
            900: '#072213',
          },
          gold: {
            DEFAULT: '#E8A427',
            50:  '#FEF9ED',
            100: '#FCEDC8',
            200: '#F9D88F',
            300: '#F5C357',
            400: '#E8A427',
            500: '#C8841A',
            600: '#A8650F',
            700: '#854C08',
            800: '#623404',
            900: '#3F1E01',
          },
          earth: '#7B4F2E',
          cream: '#FAFAF5',
          dark:  '#1A1A0F',
          light: '#F2F5EE',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up':   'fadeUp 0.6s ease-out forwards',
        'fade-in':   'fadeIn 0.4s ease-out forwards',
        'slide-in':  'slideIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
