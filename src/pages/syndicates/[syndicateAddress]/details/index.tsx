import DepositSyndicate from "@/components/syndicates/depositSyndicate";
import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";
import React from "react";

const SyndicateDetailsView = () => {
  return (
    <LayoutWithSyndicateDetails>
      <DepositSyndicate />{" "}
      {/* TODO: what goes here? should it be deposits are unavaible?  */}
    </LayoutWithSyndicateDetails>
  );
};

export default SyndicateDetailsView;
