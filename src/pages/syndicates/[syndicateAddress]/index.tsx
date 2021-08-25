// This page deals with deposits or withdrawals to a syndicate.
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { SkeletonLoader } from "@/components/skeletonLoader";
import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";

const SyndicateDepositView = () => {
  const router = useRouter();
  const { syndicateAddress } = router.query;
  const [syndicateMainAddress, setSyndicateAddress] = useState(syndicateAddress)
  useEffect(() => {
    if (syndicateAddress) {
      setSyndicateAddress(syndicateAddress)
    }
  }, [syndicateAddress]);
  return (
      syndicateMainAddress ?
          // use the component below to determine which page to load
          <LayoutWithSyndicateDetails>
            <>
              <div className="h-fit-content rounded-2xl p-4 md:mx-2 md:p-6 bg-gray-9 mt-6 md:mt-0">
                <div className="mb-6">
                  <SkeletonLoader width="full" height="10" />
                </div>
                <div className="mb-4">
                  <SkeletonLoader width="full" height="12" />
                </div>
                <div className="mb-4">
                  <SkeletonLoader width="full" height="12" />
                </div>
                <div className="mb-4">
                  <SkeletonLoader width="full" height="12" />
                </div>
              </div>
              <div className="my-6 mx-4">
                <SkeletonLoader width="24" height="10" />
                <div className="my-6">
                  <SkeletonLoader width="full" height="12" />
                </div>
                <div className="mb-6">
                  <SkeletonLoader width="full" height="12" />
                </div>
              </div>
            </>
          </LayoutWithSyndicateDetails> : <></>
  );
};

export default SyndicateDepositView;
