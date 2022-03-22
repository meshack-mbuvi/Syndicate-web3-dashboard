import { useEffect, useState } from "react";
import axios from "axios";
import { AppState } from "@/state";
import { useSelector, useDispatch } from "react-redux";
import { setDepositTokenUSDPrice } from "@/state/erc20token/slice";

export function useGetTokenPrice(): number {
  const {
    erc20TokenSliceReducer: {
      depositDetails: { depositTokenName },
    },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const [tokenUSDPrice, setTokenUSDPrice] = useState(0);

  useEffect(() => {
    async function getTokenPrice(tokenName) {
      const result = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${tokenName}&vs_currencies=usd`,
      );
      setTokenUSDPrice(result.data?.[tokenName.toLowerCase()]?.usd);
      dispatch(
        setDepositTokenUSDPrice(result.data?.[tokenName.toLowerCase()]?.usd),
      );
    }
    getTokenPrice(depositTokenName);
  }, [depositTokenName, dispatch]);

  return tokenUSDPrice;
}
