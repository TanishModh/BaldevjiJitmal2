/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f4efe5',
        foreground: '#221d19',
        primary: {
          DEFAULT: '#5a1f1c',
          foreground: '#fcf9f2',
        },
        accent: {
          DEFAULT: '#b28342',
          foreground: '#221d19',
        },
        gold: '#b28342',
        'muted-foreground': '#6a6054',
        card: {
          DEFAULT: '#faf5ec',
          foreground: '#221d19',
        },
        border: 'rgba(178, 131, 66, 0.25)',
        input: 'rgba(178, 131, 66, 0.3)',
        ring: '#5a1f1c',
        'sand-100': '#f4efe5',
        'sand-200': '#ebe1d0',
        maroon: '#5a1f1c',
        paper: '#f4efe5',
        secondary: '#ebe1d0',
        destructive: '#b91c1c',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Work Sans"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(34, 29, 25, 0.05)',
        lift: '0 12px 32px -4px rgba(34, 29, 25, 0.1), 0 4px 12px -2px rgba(34, 29, 25, 0.04)',
        gold: '0 0 25px -4px rgba(178, 131, 66, 0.25)',
      },
    },
  },
  plugins: [],
};
