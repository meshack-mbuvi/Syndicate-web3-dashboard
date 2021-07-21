import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getCoinFromContractAddress } from "functions/src/utils/ethereum";

export const useCurrentERC20 = () => {
  const [depositTokenSymbol, setDepositTokenSymbol] = useState<string>("DAI");
  const [depositTokenDecimals, setDepositTokenDecimals] = useState<number>(18);
  const [depositTokenLogo, setDepositTokenLogo] = useState<string>("");

  const { syndicate } = useSelector(
    (state: RootState) => state.syndicatesReducer,
  );

  /**
   * set token symbol based on deposit token address
   * we'll manually map the token symbol for now.
   * we'll also set the token decimals of the deposit ERC20 token here
   */
  const getTokenDetails = async (tokenAddress: string) => {
    const { decimals, symbol, logo } = await getCoinFromContractAddress(
      tokenAddress,
    );
    setDepositTokenSymbol(symbol);
    setDepositTokenDecimals(decimals);
    setDepositTokenLogo(logo);
  };

  useEffect(() => {
    if (syndicate) {
      // set token symbol based on token address
      const tokenAddress = syndicate.depositERC20Address;
      // set deposit token details.
      getTokenDetails(tokenAddress);
    }
  }, [syndicate]);

  return { depositTokenSymbol, depositTokenDecimals, depositTokenLogo };
};
