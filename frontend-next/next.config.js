const { PHASE_DEVELOPMENT_SERVER, PHASE_TEST} = require('next/constants')
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');
// const dns = require("dns");

// dns.setDefaultResultOrder("ipv4first")

module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  // if (phase === PHASE_DEVELOPMENT_SERVER) {
  //   return {
  //     /* development only config options here */
  //     env:{
  //       URL_API:"http://localhost:8000/api"
  //     },
  //     images: {
  //       domains: ['source.unsplash.com','lh3.googleusercontent.com'],
  //     },
  //     experimental: {
  //       serverActions: true,
  //     },
  //   }
  // }
  
  return {
    env:{
      // URL_API:"http://localhost:8000/api"
      URL_API:"http://127.0.0.1:8000/api"

    },
    images: {
      domains: ['source.unsplash.com','lh3.googleusercontent.com'],
    },
    experimental: {
      serverActions: true,
    },
    /* config options for all phases except development here */
  }
}