module.exports = {
  productionBrowserSourceMaps: Boolean(process.env.NEXT_SOURCE_MAPS_ENABLED),
  images: {
    domains: [
      'assets.coingecko.com',
      'lh3.googleusercontent.com',
      'syndicate.mypinata.cloud'
    ]
  },
  async redirects() {
    return [
      {
        source: '/clubs',
        destination: '/',
        permanent: true
      },
      {
        source: '/collectives',
        destination: '/',
        permanent: true
      }
    ];
  }
};
