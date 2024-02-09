const { PHASE_DEVELOPMENT_SERVER, PHASE_TEST} = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      /* development only config options here */
      env:{
        URL_API:"http://localhost:8000/api",
      },
      images: {
        domains: ['source.unsplash.com','lh3.googleusercontent.com'],
      },
      experimental: {
        serverActions: true,
      },
    }
  }
  
  return {
    env:{
      URL_API:"https://eraiyomi-server.up.railway.app/api"
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