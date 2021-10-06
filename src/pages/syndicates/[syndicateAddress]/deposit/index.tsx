import DepositSyndicate from "@/components/syndicates/depositSyndicate";
import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";
import { withAuth } from "@/lib/withAuth";
import React from "react";

const SyndicateDepositView = () => {
  return (
    <LayoutWithSyndicateDetails>
      <DepositSyndicate />
    </LayoutWithSyndicateDetails>
  );
};

export default withAuth(SyndicateDepositView);
