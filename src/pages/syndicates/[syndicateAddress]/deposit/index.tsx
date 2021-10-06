import DepositSyndicate from "@/components/syndicates/depositSyndicate";
import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";
import { withLoggedOutUser } from "@/lib/withAuth";
import React from "react";

const SyndicateDepositView = () => {
  return (
    <LayoutWithSyndicateDetails>
      <DepositSyndicate />
    </LayoutWithSyndicateDetails>
  );
};

export default withLoggedOutUser(SyndicateDepositView);
