import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useDepositChecks = () => {
  const [depositsAvailable, setDepositsAvailable] = useState<boolean>(true);
  const [maxMembersZero, setMaxMembersZero] = useState<boolean>(false);
  const [maxDepositReached, setMaxDepositReached] = useState<boolean>(false);

  const { syndicate } = useSelector(
    (state: RootState) => state.syndicatesReducer,
  );

  useEffect(() => {
    if (syndicate) {
      const {
        depositsEnabled,
        numMembersMax,
        depositMaxTotal,
        depositTotal,
      } = syndicate;
      if (!depositsEnabled) {
        setDepositsAvailable(false);
        setMaxMembersZero(false);
      } else {
        setDepositsAvailable(true);
        setMaxMembersZero(false);
      }

      // if the maxMembers value for the syndicate is set to zero,
      // then deposits are not available for the syndicate even though it's open
      if (parseInt(numMembersMax) < 1) {
        setMaxMembersZero(true);
        setDepositsAvailable(false);
      } else {
        setMaxMembersZero(false);
        setDepositsAvailable(true);
      }

      // syndicate max deposit reached
      if (depositMaxTotal === depositTotal) {
        setMaxDepositReached(true);
      }
    }
  }, [syndicate]);

  return { depositsAvailable, maxMembersZero, maxDepositReached };
};
