/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // react-pdf configuration
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    
    return config
  },
}

export default nextConfig
