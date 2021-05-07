// This page deals with deposits or withdrawals to a syndicate.
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import SyndicateActions from "@/containers/syndicateActions";

const SyndicateDepositOrWithdrawPage = () => {
  const router = useRouter();
  const { syndicateAddress } = router.query;

  useEffect(() => {
    // re-route to the deposit page
    router.replace(`/syndicates/${syndicateAddress}/deposit`);
  });
  return <SyndicateActions />;
};

export default SyndicateDepositOrWithdrawPage;
