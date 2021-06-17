import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import { TokenMappings } from "src/utils/tokenMappings";
import { ERC20TokenDetails } from "src/utils/ERC20Methods";

const decimals = 18;

const getTokenDecimals = async (tokenAddress: string) => {
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
 * we'll also set the token decimals of the deposit/Withdrawal ERC20 token here
 */
export const useCurrentERC20 = () => {

  const [currentERC20, setCurrentERC20] = useState<string>("DAI");
  const [currentERC20Decimals, setCurrentERC20Decimals] = useState<number>(decimals);

  const {
    syndicate,
  } = useSelector((state: RootState) => state.syndicatesReducer);

  useEffect(() => {
    if (syndicate) {
      // set token symbol based on token address
      const tokenAddress = syndicate.depositERC20Address;
      const mappedTokenAddress = Object.keys(TokenMappings).find(
        (key) => key.toLowerCase() == tokenAddress.toLowerCase()
      );
      if (mappedTokenAddress) {
        setCurrentERC20(TokenMappings[mappedTokenAddress]);
      }

      // set token decimal places.
      getTokenDecimals(tokenAddress).then(tokenDecimal => {
        setCurrentERC20Decimals(tokenDecimal)
      });
    }
  }, [syndicate]);

  return { currentERC20, currentERC20Decimals }
}
