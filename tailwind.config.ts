import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        // Brand purple palette
        purple: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Charcoal palette
        charcoal: {
          50:  '#f7f6f9',
          100: '#efecef',
          200: '#ddd8df',
          300: '#bdb4c2',
          400: '#92839a',
          500: '#6e5d77',
          600: '#52445b',
          700: '#3d3244',
          800: '#2d2040',
          900: '#1a1025',
          950: '#110d18',
          DEFAULT: '#1a1025',
        },
        // Brand gold accent
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f5b942',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Brand specific
        brand: {
          purple:   '#5B21B6',
          'purple-light': '#7C3AED',
          gold:     '#F5B942',
          lavender: '#EDE9FE',
          dark:     '#1A1025',
          charcoal: '#2D2040',
        },
        // Neutral overrides
        neutral: {
          50:  '#FAF8FF',
          100: '#F3F0FF',
          200: '#E9E5FF',
          300: '#D4CCFF',
          400: '#A89CCC',
          500: '#7C6B99',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#0B0F19',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        serif:   ['"Playfair Display"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-brand':    'linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #A78BFA 100%)',
        'gradient-gold':     'linear-gradient(135deg, #D97706 0%, #F5B942 100%)',
        'gradient-dark':     'linear-gradient(180deg, #1A1025 0%, #2D2040 100%)',
        'gradient-hero':     'linear-gradient(135deg, rgba(91,33,182,0.85) 0%, rgba(26,16,37,0.95) 100%)',
        'gradient-card':     'linear-gradient(145deg, rgba(124,58,237,0.05) 0%, rgba(245,185,66,0.05) 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(124,58,237,0.3)' },
          '50%':      { boxShadow: '0 0 20px rgba(124,58,237,0.7), 0 0 40px rgba(124,58,237,0.3)' },
        },
      },
      animation: {
        'fade-in':        'fade-in 0.5s ease-out',
        'fade-in-up':     'fade-in-up 0.6s ease-out',
        'slide-up':       'slide-up 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'slide-in-left':  'slide-in-left 0.4s ease-out',
        'scale-in':       'scale-in 0.3s ease-out',
        'shimmer':        'shimmer 2s infinite linear',
        'float':          'float 3s ease-in-out infinite',
        'glow-pulse':     'glow-pulse 2s ease-in-out infinite',
      },
      boxShadow: {
        'brand':      '0 4px 24px rgba(91,33,182,0.25)',
        'brand-lg':   '0 8px 40px rgba(91,33,182,0.35)',
        'gold':       '0 4px 24px rgba(245,185,66,0.30)',
        'card':       '0 2px 16px rgba(91,33,182,0.08)',
        'card-hover': '0 8px 32px rgba(91,33,182,0.16)',
        'glow':       '0 0 20px rgba(124,58,237,0.4)',
      },
      borderRadius: {
        'xl':  '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '3rem',
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}

export default config
