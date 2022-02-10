import { useMemo } from "react";
import { isDev } from "@/utils/environment";

export type TokenDetails = {
  depositTokenAddress: string;
  depositTokenSymbol: string;
  depositTokenLogo: string;
  depositTokenName: string;
  depositTokenDecimals: number;
};

const USDC_MAPPING: Record<string, TokenDetails> = {
  rinkeby: {
    depositTokenAddress: "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926",
    depositTokenSymbol: "USDC",
    depositTokenLogo: "/images/TestnetTokenLogos/usdcIcon.svg",
    depositTokenName: "USD-Coin",
    depositTokenDecimals: 6,
  },
  mainnet: {
    depositTokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    depositTokenSymbol: "USDC",
    depositTokenLogo: "/images/prodTokenLogos/usd-coin-usdc.svg",
    depositTokenName: "USD-Coin",
    depositTokenDecimals: 6,
  },
};
const useUSDCDetails = (): TokenDetails => {
  return useMemo(
    () => (isDev ? USDC_MAPPING["rinkeby"] : USDC_MAPPING["mainnet"]),
    [],
  );
};

export default useUSDCDetails;
