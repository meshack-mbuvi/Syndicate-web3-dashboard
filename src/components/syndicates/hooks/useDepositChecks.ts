import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


export const useDepositChecks = () => {
  const [depositsAvailable, setDepositsAvailable] = useState<boolean>(true);
  const [maxLPsZero, setMaxmembersZero] = useState<boolean>(false);

  const { syndicate } = useSelector((state: RootState) => state.syndicatesReducer);

  useEffect(() => {
    if (syndicate) {
      const { depositsEnabled, numMembersMax } = syndicate;
      if (!depositsEnabled) {
        setDepositsAvailable(false);
        setMaxmembersZero(false);
      } else {
        setDepositsAvailable(true);
        setMaxmembersZero(false);
      }

      // if the maxMembers value for the syndicate is set to zero,
      // then deposits are not available for the syndicate even though it's open
      if (parseInt(numMembersMax) < 1) {
        setMaxmembersZero(true);
        setDepositsAvailable(false);
      } else {
        setMaxmembersZero(false);
        setDepositsAvailable(true);
      }
    }
  }, [syndicate])

  return { depositsAvailable, maxLPsZero }
}
