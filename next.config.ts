import type { NextConfig } from 'next'
import path from 'path'

const config: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ysspfbsdsgpljktkzbrj.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default config
