/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'royal-light': '#FAF0F9',
        'royal-accent': '#F4E3F3',
        'royal-highlight': '#EAC7E6',
        'royal-button': '#DCA2D6',
        'royal-interactive': '#9D6B98',
        'royal-header': '#5E345A',
        'royal-footer': '#4F264A',
        'royal-dark': '#3F183B',
        'royal-accent-diamond': '#CC6CC2',
      },
    },
  },
  plugins: [],
};