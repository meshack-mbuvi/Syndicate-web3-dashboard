import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { RootState } from "@/redux/store";
import StatusBadge from "@/components/syndicateDetails/statusBadge";
import CopyLink from "@/components/shared/CopyLink";

const ShareModal = () => {
  const {
    syndicatesReducer: { syndicate },
  } = useSelector((state: RootState) => state);

  const router = useRouter();
  const { syndicateAddress } = router.query;
  const [showDepositLinkCopyState, setShowDepositLinkCopyState] =
    useState<boolean>(false);

  const updateDepositLinkCopyState = () => {
    setShowDepositLinkCopyState(true);
    setTimeout(() => setShowDepositLinkCopyState(false), 1000);
  };

  // club deposit link
  const [clubDepositLink, setClubDepositLink] = useState<string>("");
  useEffect(() => {
    setClubDepositLink(
      `${window.location.origin}/syndicates/${syndicateAddress}/`,
    );
  }, [syndicateAddress]);

  return (
    <div className="rounded-2-half bg-gray-syn8">
      <StatusBadge
        depositsEnabled={syndicate?.depositsEnabled}
      />
      <div className="h-fit-content rounded-2-half py-10 px-8 flex justify-center items-center flex-col">
        <img
          src="/images/checkCircleGreen.svg"
          className="h-20 w-20"
          alt="success"
        />
        <div className="mt-8 text-2xl leading-9">Investment club created</div>
        <p className="text-center text-base leading-6 text-gray-syn4 mt-4 mb-6">
          Invite members by sharing your club’s deposit link
        </p>
        <CopyLink
          link={clubDepositLink}
          updateCopyState={updateDepositLinkCopyState}
          showCopiedState={showDepositLinkCopyState}
        />
      </div>
    </div>
  );
};

export default ShareModal;
