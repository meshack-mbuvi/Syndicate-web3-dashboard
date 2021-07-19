import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ERC20TokenDetails } from "src/utils/ERC20Methods";
import { TokenMappings } from "src/utils/tokenMappings";

const decimals = 18;

const getTokenDecimals = async (tokenAddress: string) => {
  if (!tokenAddress.trim()) return decimals;

  // set token decimals based on the token address
  const ERC20Details = new ERC20TokenDetails(tokenAddress);
  const tokenDecimals = await ERC20Details.getTokenDecimals();
  if (tokenDecimals !== null) {
    return parseInt(tokenDecimals);
  }
  return decimals;
};

/**
 * set token symbol based on deposit token address
 * we'll manually map the token symbol for now.
 * we'll also set the token decimals of the deposit ERC20 token here
 */
export const useCurrentERC20 = (): {
  depositTokenSymbol;
  depositTokenDecimals;
} => {
  const [depositTokenSymbol, setDepositTokenSymbol] = useState<string>("DAI");
  const [depositTokenDecimals, setDepositTokenDecimals] = useState<number>(
    decimals,
  );

  const { syndicate } = useSelector(
    (state: RootState) => state.syndicatesReducer,
  );

  useEffect(() => {
    if (syndicate) {
      // set token symbol based on token address
      const tokenAddress = syndicate.depositERC20Address;
      const mappedTokenAddress = Object.keys(TokenMappings).find(
        (key) => key.toLowerCase() == tokenAddress.toLowerCase(),
      );
      if (mappedTokenAddress) {
        setDepositTokenSymbol(TokenMappings[mappedTokenAddress]);
      }

      // set token decimal places.
      getTokenDecimals(tokenAddress).then((tokenDecimal) => {
        setDepositTokenDecimals(tokenDecimal);
      });
    }
  }, [syndicate]);

  return { depositTokenSymbol, depositTokenDecimals };
};
