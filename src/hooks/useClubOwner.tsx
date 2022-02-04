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

export const useIsClubMember = (): boolean => {
  const {
    clubMembersSliceReducer: { clubMembers },
    web3Reducer: {
      web3: { account },
    },
  } = useSelector((state: AppState) => state);
  return clubMembers.some(
    (member) => member.memberAddress.toLowerCase() === account.toLowerCase(),
  );
};
