module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend:{
      height: {
        '70vh': '70vh',
      },
      animation: {
        expandTopToBottom: 'expandTopToBottom 1s ease-in-out',
      },
      keyframes: {
        expandTopToBottom: {
          "0%": {height:'0px'},
          "100%": {height:'100%'}
        }
      }
    },
    fontFamily: {
      sans: ["Montserrat",'Sono', 'sans-serif'],
      cinzel: ['Cinzel','serif']
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    }
  ],

}
