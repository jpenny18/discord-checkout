/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Handle modules that depend on Node.js built-ins
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

      // Explicitly handle es6-promise and vertx
      config.resolve.alias = {
        ...config.resolve.alias,
        vertx: false
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