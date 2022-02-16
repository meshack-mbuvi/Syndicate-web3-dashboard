import { useMemo } from "react";
import { isDev } from "@/utils/environment";

export type TokenDetails = {
  depositTokenAddress: string;
  depositTokenSymbol: string;
  depositTokenLogo: string;
  depositTokenName: string;
  depositTokenDecimals: number;
};

const TOKEN_MAPPING: Record<string, Record<string, TokenDetails>> = {
  rinkeby: {
    usdc: {
      depositTokenAddress: "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926",
      depositTokenSymbol: "USDC",
      depositTokenLogo: "/images/TestnetTokenLogos/usdcIcon.svg",
      depositTokenName: "USD-Coin",
      depositTokenDecimals: 6,
    },
    ether: {
      depositTokenAddress: "0xether",
      depositTokenSymbol: "ETH",
      depositTokenLogo: "/images/ethereum-logo.png",
      depositTokenName: "Ethereum",
      depositTokenDecimals: 18,
    },
  },
  mainnet: {
    usdc: {
      depositTokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      depositTokenSymbol: "USDC",
      depositTokenLogo: "/images/prodTokenLogos/usd-coin-usdc.svg",
      depositTokenName: "USD-Coin",
      depositTokenDecimals: 6,
    },
    ether: {
      depositTokenAddress: "0xether",
      depositTokenSymbol: "ETH",
      depositTokenLogo: "/images/ethereum-logo.png",
      depositTokenName: "Ethereum",
      depositTokenDecimals: 18,
    },
  },
};

const useTokenDetails = (ethDepositToken: boolean): TokenDetails => {
  const token = ethDepositToken ? "ether" : "usdc";

  return useMemo(
    () =>
      isDev ? TOKEN_MAPPING["rinkeby"][token] : TOKEN_MAPPING["mainnet"][token],
    [token],
  );
};

export default useTokenDetails;
