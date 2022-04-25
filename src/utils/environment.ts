export const debug = process.env.NEXT_PUBLIC_DEBUG;
export const isDev = debug === 'true';
export const isProd = !isDev;
export const isSSR = (): boolean => typeof window === 'undefined';
export const isStagingOrProd =
  process.env.NODE_ENV === 'production' &&
  !isSSR() &&
  !(window?.location?.hostname.indexOf('deploy-preview') > -1);
