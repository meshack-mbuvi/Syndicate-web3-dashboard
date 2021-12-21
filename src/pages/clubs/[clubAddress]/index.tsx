import DepositSyndicate from "@/components/syndicates/depositSyndicate";
import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";
import React from "react";

const SyndicateDepositView: React.FC = () => {
  return (
    <LayoutWithSyndicateDetails>
      <DepositSyndicate />
    </LayoutWithSyndicateDetails>
  );
};

export default SyndicateDepositView;
