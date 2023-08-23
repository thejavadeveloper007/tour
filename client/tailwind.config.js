/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/component/*.js"],
  theme: {
    extend: {
      height:{
        '81.6':'81.6vh'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

