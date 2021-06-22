import WithdrawSyndicate from "@/components/syndicates/withdrawSyndicate";
import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";
import React from "react";

const SyndicateWithdrawalView = () => {
  return (
    <LayoutWithSyndicateDetails>
      <WithdrawSyndicate />
    </LayoutWithSyndicateDetails>
  );
};

export default SyndicateWithdrawalView;
