// This page deals with deposits or withdrawals to a syndicate.
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const SyndicateDepositView = () => {
  const router = useRouter();
  const { syndicateAddress } = router.query;
  useEffect(() => {
    // re-route to the deposit page
    router.replace(`/syndicates/${syndicateAddress}/deposit`);
  });
  return <></>;
};

export default SyndicateDepositView;
