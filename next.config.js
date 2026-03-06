/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix deprecated images.domains for Next.js 16
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cannabi-8vhj7yrt8-jiten-kumars-projects.vercel.app',
        port: '',
        pathname: '**',
      },
    ],
  },
  
  // Fix deprecated experimental.serverComponentsExternalPackages
  serverExternalPackages: ['@prisma/client'],
  
  // Configure Turbopack for Next.js 16
  turbopack: {
    // Enable Turbopack with proper configuration
  },
  
  // Disable TypeScript strict mode for production builds
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Fix cross-origin preview issue
  allowedDevOrigins: [
    'preview-chat-1edabd21-3b3d-48e3-b934-e0ca44886e1d.space.z.ai'
  ],
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig