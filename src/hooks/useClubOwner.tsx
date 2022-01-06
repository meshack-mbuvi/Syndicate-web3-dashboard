import { AppState } from "@/state";
import { useSelector } from "react-redux";

export function useIsClubOwner(): boolean {
  const {
    web3Reducer: {
      web3: { account },
    },
    erc20TokenSliceReducer: {
      erc20Token: { owner },
    },
  } = useSelector((state: AppState) => state);

  return account === owner && account != "" && owner != "";
}
