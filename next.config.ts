import type { NextConfig } from 'next'

// Identifiant unique à chaque build — utilisé pour vider le cache navigateur
const BUILD_ID = Date.now().toString(36)

const nextConfig: NextConfig = {
  output: 'standalone',

  // Exposé côté client pour versionner les assets statiques (/logo.svg, /favicon.svg)
  env: {
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
  },

  async headers() {
    return [
      {
        // Pages HTML et API : jamais mis en cache navigateur
        source: '/((?!_next).*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
    ]
  },
}

export default nextConfig
