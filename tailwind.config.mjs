/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,svelte,vue}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '950px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '2200px',
      '4xl': '3000px',
    },
    extend: {
      colors: {
        dark: '#131313',
        shadow: '#1e1e1e',
        creme: '#fbf9d6',
        yellow: '#f8fe03',
      },
      fontFamily: {
        display: ['"VVDS Fifties"', 'VVDS_Fifties', 'sans-serif'],
        body: ['"Suisse Intl"', '"Neue Montreal"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
