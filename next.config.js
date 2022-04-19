module.exports = {
  extends: ['plugin:@next/next/recommended'],
  productionBrowserSourceMaps: Boolean(process.env.NEXT_SOURCE_MAPS_ENABLED),
  images: {
    domains: ['assets.coingecko.com']
  }
};
