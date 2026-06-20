/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep strict mode active
  reactStrictMode: true,
  
  // Explicitly activate Gzip/Brotli compression
  compress: true,
  
  // Serve static public assets with aggressive Cache-Control headers to optimize network speed
  async headers() {
    return [
      {
        source: '/logo.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/widget.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
