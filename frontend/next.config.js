// @ts-check

const { PHASE_DEVELOPMENT_SERVER } = require("next/dist/shared/lib/constants");

module.exports = (phase) => {
  // console.log("phase=",phase)
  // console.log("process.env.APP_ENV=",process.env.APP_ENV)

  // All phase config
  const config = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "eraiyomi.s3.ap-southeast-1.amazonaws.com",
        },
      ],
    },
    experimental: {
      serverActions: true,
    },
  }

  // Development only config
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    config['env'] = {
      URL_API: "http://localhost:8000/api",
    }
    return config
  }

  // Staging only config
  if(process.env.APP_ENV!==undefined && process.env.APP_ENV==="staging"){
    config['env'] = {
      URL_API: "https://staging-api.eraiyomi.com/api",
      // URL_API: "http://localhost:8001/api",
    }
    config['compiler'] = {
      removeConsole: {
        exclude: ["error", "info"],
      }
    }
    config['output'] = "standalone"
    return config
  }

  // Production only config
  config['env'] = {
    URL_API: "https://api.eraiyomi.com/api",
  }
  config['compiler'] = {
    removeConsole: {
      exclude: ["error", "info"],
    }
  }
  config['output'] = "standalone"

  return config
};