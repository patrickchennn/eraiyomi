// @ts-check

const { PHASE_DEVELOPMENT_SERVER } = require("next/dist/shared/lib/constants");

module.exports = (phase) => {
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

  // Development only config options here
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    config['env'] = {
      URL_API: "http://localhost:8001/api",
    }
    return config
  }

  // Config options for all phases except development here
  config['env'] = {
    URL_API: "http://localhost:8999/api",
  }
  config['compiler'] = {
    removeConsole: {
      exclude: ["error", "info"],
    }
  }
  config['output'] = "standalone"

  return config
};

/** Docs:
 * 
 * Programmatically distinguishing between production build phase and production serve phase? #48736 - https://github.com/vercel/next.js/discussions/48736 (Accessed on Feb 2025)
 */