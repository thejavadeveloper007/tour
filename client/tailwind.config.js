/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/component/*.js"],
  theme: {
    extend: {
      height:{
        '81.6':'81.6vh'
      },
      backgroundImage:{
        'hero-image': "url('./assets/images/pexels-jess-bailey-designs-965117.jpg')"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

