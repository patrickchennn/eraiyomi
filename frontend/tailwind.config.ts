import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
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
      roboto:["Roboto","sans-serif"],
    },
  },
  plugins: [
    function ({ addVariant }: {addVariant: any}) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    }
  ],
}
export default config
