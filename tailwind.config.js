/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-global': '#000000',
        'bg-card': '#0a0a0a',
        'bg-card-alt': '#111111',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'OldStandardTT', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'serif'],
        heading: ['var(--font-heading)', 'OldStandardTT', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'serif'],
        title: ['var(--font-heading)', 'OldStandardTT', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'serif'],
        display: ['var(--font-heading)', 'OldStandardTT', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'serif'],
        body: ['var(--font-body)', 'OldStandardTT', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'serif'],
        label: ['var(--font-label)', 'CoFoSansMono', 'monospace', 'Courier New', 'monospace'],
        mono: ['var(--font-label)', 'CoFoSansMono', 'monospace', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}

