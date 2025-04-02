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
        vertx: false,
        // Force all undici instances to use the same version
        undici: require.resolve('undici')
      };
    }

    // Add specific rule for handling private class fields in undici
    config.module.rules.push({
      test: /node_modules[/\\](@firebase[/\\]auth[/\\]node_modules[/\\]undici|undici)[/\\].*\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-private-methods', '@babel/plugin-proposal-class-properties']
      }
    });

    return config;
  },
  images: {
    domains: ['localhost'],
  },
  transpilePackages: ['@firebase/auth', 'firebase', '@firebase/app', '@firebase/firestore', 'undici'],
  experimental: {
    esmExternals: 'loose'
  }
};

module.exports = nextConfig; 