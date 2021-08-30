import { isDev } from "@/utils/environment";
import { coinsList } from "./coinsList";
import { testCoinsList } from "./testCoinsList";

export interface ICoinProps {
  symbol: string;
  name: string;
  contractAddress: string;
  icon: string;
  decimal: number;
  default?: boolean;
}

/**
 * @returns { ICoinProps } based on environment
 */
export const getCoinsList = (): ICoinProps[] => {
  if (isDev) {
    return testCoinsList;
  } else {
    return coinsList;
  }
};

export const getTokenIcon = (symbol: string): string => {
  const coins = getCoinsList();
  const coinInfo = coins.find(coin => coin.symbol === symbol.toLowerCase());
  if (coinInfo) {
    return coinInfo.icon;
  }
  return "";
};
