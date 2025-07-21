export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {

    fontFamily: {
      custom: ['Circular', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    },
      colors: {
        brand:{
          bcolor:' #00A693',
        },
        primary: '#2B2D2E',
        secondary: '#747C7D',
        tertiary: '#45BA59',
        highlight: '#F0FFF0',
      },
    }
  },
  plugins: [],
}