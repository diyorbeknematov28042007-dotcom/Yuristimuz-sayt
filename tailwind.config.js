/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        indigo: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      borderRadius: {
        'xl':  '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      fontSize: {
        'xs':   ['11px', { lineHeight: '1.5' }],
        'sm':   ['13px', { lineHeight: '1.5' }],
        'base': ['14px', { lineHeight: '1.6' }],
        'lg':   ['16px', { lineHeight: '1.5' }],
        'xl':   ['18px', { lineHeight: '1.4' }],
        '2xl':  ['22px', { lineHeight: '1.3' }],
        '3xl':  ['28px', { lineHeight: '1.2' }],
        '4xl':  ['36px', { lineHeight: '1.1' }],
        '5xl':  ['48px', { lineHeight: '1.05' }],
        '6xl':  ['60px', { lineHeight: '1.0' }],
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0,0,0,0.05)',
        'sm': '0 1px 4px rgba(0,0,0,0.06)',
        'md': '0 4px 12px rgba(0,0,0,0.08)',
        'lg': '0 8px 24px rgba(0,0,0,0.10)',
        'xl': '0 16px 48px rgba(0,0,0,0.12)',
        'indigo': '0 4px 16px rgba(99,102,241,0.3)',
      },
      backgroundImage: {
        'gradient-indigo': 'linear-gradient(135deg, #6366f1, #4f46e5)',
        'gradient-hero': 'linear-gradient(165deg, #eef2ff 0%, #f8fafc 50%, #ffffff 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a, #1e293b)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
      },
    },
  },
  plugins: [],
}
