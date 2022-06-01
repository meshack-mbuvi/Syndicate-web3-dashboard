// current stable coins symbol
const stableCoinSymbols = ['USDC', 'DAI', 'USDT'];

export const isStableCoin = (coinSymbol: string): boolean =>
  stableCoinSymbols.includes(coinSymbol);
