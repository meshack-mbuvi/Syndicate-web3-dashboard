module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/clubs',
        permanent: true,
      },
    ]
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  extends: ["plugin:@next/next/recommended"],
};
