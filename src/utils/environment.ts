export const debug = process.env.NEXT_PUBLIC_DEBUG;
export const isDev = debug === "true";
export const isProd = !isDev;
