/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        surface: '#101010',
        ink: '#F5F5F5',
        muted: '#9CA3AF',
        accent: '#00C8FF',
        accent2: '#5B8CFF',
      },
      borderColor: {
        line: 'rgba(255,255,255,.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
