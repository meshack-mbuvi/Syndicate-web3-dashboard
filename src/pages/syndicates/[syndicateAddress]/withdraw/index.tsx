import WithdrawSyndicate from "@/components/syndicates/withdrawSyndicate";
import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";
import withAuth from "@/lib/withAuth";
import React from "react";

const SyndicateWithdrawalView: React.FC = () => {
  return (
    <LayoutWithSyndicateDetails>
      <WithdrawSyndicate />
    </LayoutWithSyndicateDetails>
  );
};

export default withAuth(SyndicateWithdrawalView);
