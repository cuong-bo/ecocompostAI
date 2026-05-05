/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:      '#0A7A52',
          bgDark:  '#08754F',
          card:    '#F2F2F2',
          cardAlt: '#EFEFEF',
          btn:     '#56AB2F',
          btnTo:   '#A8E063',
          focus:   '#22C55E',
          border:  '#D1D5DB',
          text:    '#2F3542',
        },
      },
    },
  },
  plugins: [],
}

