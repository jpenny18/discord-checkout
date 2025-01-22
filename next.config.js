/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        http: false,
        https: false,
        zlib: false
      };
    }

    return config;
  },
  images: {
    domains: ['localhost'],
  },
  transpilePackages: ['@firebase/auth', 'firebase', '@firebase/app', '@firebase/firestore'],
  experimental: {
    esmExternals: 'loose'
  }
};

module.exports = nextConfig; 