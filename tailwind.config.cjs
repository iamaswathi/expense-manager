export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {

    fontFamily: {
      custom: ['Circular', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    },
      colors: {
        brand:{
          sunset:' #ff705c',
        },
        primary: '#2B2D2E',
        secondary: '#747C7D',
        tertiary: '#45BA59',
        highlight: '#F3F4F9',
      },
    },
  },
  plugins: [],
}