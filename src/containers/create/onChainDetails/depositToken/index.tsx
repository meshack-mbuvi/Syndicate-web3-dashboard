import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ContentTitle } from "../../shared";
import { TokenSelectInput } from "./tokenSelectInput";

const DepositTokenAndLimit: React.FC = () => {
  const {
    tokenAndDepositLimitReducer: {
      createSyndicate: {
        tokenAndDepositsLimits: {
          depositTokenDetails: { depositTokenName },
        },
      },
    },
  } = useSelector((state: RootState) => state);

  const { buttonsDisabled, setContinueDisabled } = useCreateSyndicateContext();

  useEffect(() => {
    // disable buttons if no token is selected or errors
    if (!buttonsDisabled && !depositTokenName) {
      setContinueDisabled(true);
    } else {
      setContinueDisabled(false);
    }
    return () => {
      setContinueDisabled(false);
    };
  }, [buttonsDisabled, depositTokenName, setContinueDisabled]);

  return (
    <div className="flex">
      <div className="">
        <ContentTitle>Deposit token</ContentTitle>

        <div className="w-full space-y-3">
          <TokenSelectInput label="Deposit Token" required />
        </div>
      </div>
    </div>
  );
};

export default DepositTokenAndLimit;
