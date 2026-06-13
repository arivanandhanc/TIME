import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Neutral near-black ramp (matches support.arivanandhan.in).
        brand: {
          50: '#f4f4f4',
          100: '#e0e0e0',
          200: '#d6d6d4',
          300: '#bcbcb9',
          400: '#b0b0ad',
          500: '#8c8c89',
          600: '#5a5a57',
          700: '#343432',
          800: '#1f1f1e',
          900: '#141413',
          950: '#0a0a0a',
        },
        // Amber accent.
        accent: {
          DEFAULT: '#fbbf24',
          400: '#fcd34d',
          500: '#fbbf24',
          600: '#f59e0b',
          ink: '#1f1a0d',
          glow: 'rgba(251,191,36,0.18)',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: { '2xl': '1180px' },
      },
    },
  },
  plugins: [],
};

export default config;
