// @ts-check
 
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  env:{
    URL_API:"http://localhost:8000/api",
  },
  images: {
    domains: ['source.unsplash.com','lh3.googleusercontent.com'],
  },
  experimental: {
    serverActions: true,
  },
  output: "standalone"
}
 
module.exports = nextConfig
