/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  compiler: {
    styledComponents: {
      // Enable display of the component name along with the generated className (needed for debugging).
      displayName: true,

      // Enable SSR support
      ssr: true,

      // Optional
      fileName: false,
    },
  },
};

module.exports = nextConfig;
