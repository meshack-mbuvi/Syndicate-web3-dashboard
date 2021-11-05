import ErrorBoundary from "@/components/errorBoundary";
import FadeIn from "@/components/fadeIn/FadeIn";
import JoinWaitlist from "@/components/JoinWaitlist";
import { SkeletonLoader } from "@/components/skeletonLoader";
import StatusBadge from "@/components/syndicateDetails/statusBadge";
import { useUnavailableState } from "@/components/syndicates/hooks/useUnavailableState";
import { UnavailableState } from "@/components/syndicates/shared/unavailableState";
import { RootState } from "@/redux/store";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CopyLink from "@/components/shared/CopyLink";
import CreateEntityCard from "@/components/shared/createEntityCard";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import { SuccessCard } from "@/containers/managerActions/successCard";

const ManagerActions = (): JSX.Element => {
  const {
    erc20TokenSliceReducer: { erc20Token },
    createInvestmentClubSliceReducer: {
      clubCreationStatus: {
        transactionHash, // TODO: this will be empty after reload
      },
    },
  } = useSelector((state: RootState) => state);

  const {
    maxTotalDeposits,
    depositToken,
    totalDeposits,
    memberCount,
    depositsEnabled,
    symbol,
    totalSupply,
    accountClubTokens,
    connectedMemberDeposits,
    loading,
    memberPercentShare,
    maxMemberCount,
    isOwner,
  } = erc20Token;

  const router = useRouter();
  const { syndicateAddress } = router.query;

  const { title, message, renderUnavailableState, renderJoinWaitList } =
    useUnavailableState("manage");

  const [showDepositLinkCopyState, setShowDepositLinkCopyState] =
    useState(false);
  const [clubDepositLink, setClubDepositLink] = useState("");

  // variables to track investment club creation process.
  // TODO: actual values should be fetched from the redux store.
  // to update this once the contract calls have been updated
  const creatingSyndicate = false;
  const syndicateSuccessfullyCreated = false;
  const syndicateCreationFailed = false;

  // club deposit link
  useEffect(() => {
    setClubDepositLink(
      `${window.location.origin}/syndicates/${syndicateAddress}/deposit`,
    );
  }, [syndicateAddress]);

  // check for success state to show success + confetti component
  // TODO: Add localstorage state from create syndicate function to track these conditions:
  // Celebratory moment for 3000ms
  // Show when
  // 1) user stays on club page and tx completes, or
  // 2) user returns to this page first time since tx completed
  const [showConfettiSuccess, setShowConfettiSuccess] =
    useState<boolean>(false);

  useEffect(() => {
    if (syndicateSuccessfullyCreated) {
      setShowConfettiSuccess(true);
      setTimeout(() => {
        setShowConfettiSuccess(false);
      }, 5000);
    }
  }, [syndicateSuccessfullyCreated]);

  if (renderUnavailableState || renderJoinWaitList) {
    return (
      <div className="h-fit-content px-8 pb-4 pt-5 bg-gray-9 rounded-2xl">
        <div className="flex justify-between my-1 px-2">
          {renderJoinWaitList ? (
            <JoinWaitlist />
          ) : (
            renderUnavailableState && (
              <UnavailableState title={title} message={message} />
            )
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <div className="h-fit-content rounded-2xl p-4 md:mx-2 md:p-6 bg-gray-9 mt-6 md:mt-0 w-full">
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
        <div className="w-40" />
        <div className="rounded-2xl p-4 md:mx-2 md:p-6 bg-gray-9 mt-6 w-full">
          <div className="my-4">
            <SkeletonLoader width="full" height="12" />
          </div>
          <div className="mb-4">
            <SkeletonLoader width="full" height="12" />
          </div>
        </div>
      </>
    );
  }

  const updateDepositLinkCopyState = () => {
    setShowDepositLinkCopyState(true);
    setTimeout(() => setShowDepositLinkCopyState(false), 1000);
  };

  const showReviewPage = () => {
    // TODO: navigate to the review page from here.
    return;
  };

  return (
    <ErrorBoundary>
      <div className="w-full mt-4 sm:mt-0">
        <FadeIn>
          <div className="rounded-2-half bg-gray-syn8">
            <StatusBadge
              {...{
                depositsEnabled,
                creatingSyndicate,
                syndicateSuccessfullyCreated,
                syndicateCreationFailed,
                showConfettiSuccess,
              }}
            />
            <div
              className={`h-fit-content relative ${
                showConfettiSuccess ? "p-0" : "py-10 px-8"
              } flex justify-center items-start flex-col w-full`}
            >
              {!syndicateCreationFailed &&
                !creatingSyndicate &&
                !showConfettiSuccess && (
                  <div className="flex flex-col items-start pb-6">
                    <p className="pb-2 uppercase text-white text-sm font-whyte-medium">
                      Invite to deposit
                    </p>
                    <p className="text-gray-syn4">
                      Invite members by sharing your club’s deposit link
                    </p>
                  </div>
                )}

              {creatingSyndicate && (
                <div className="pb-6 flex flex-col items-center justify-center">
                  <p className="pb-6 text-gray-syn4 text-center">
                    Your investment club is coming into on-chain existence. Once
                    the transaction is complete, you’ll see your club’s deposit
                    link below.
                  </p>
                  <EtherscanLink
                    etherscanInfo={transactionHash}
                    text="View progress on Etherscan"
                    type="transaction"
                  />
                </div>
              )}

              {syndicateCreationFailed && (
                <div className="flex flex-col items-center pb-6">
                  <p className="text-gray-syn4 pb-6">
                    Please try again and{" "}
                    <a
                      href="#"
                      className="text-blue hover:opacity-90"
                      target="_blank"
                    >
                      let us know
                    </a>{" "}
                    if the issue persists.
                  </p>
                  <EtherscanLink
                    etherscanInfo={transactionHash}
                    text="View on Etherscan"
                    type="transaction"
                  />
                </div>
              )}

              {showConfettiSuccess && (
                <div className="w-full py-10 px-8">
                  <SuccessCard
                    {...{
                      syndicateSuccessfullyCreated,
                      updateDepositLinkCopyState,
                      showDepositLinkCopyState,
                      clubDepositLink,
                    }}
                  />
                </div>
              )}

              {syndicateCreationFailed ? (
                <button
                  className="bg-white hover:bg-opacity-90 py-4 w-full rounded-custom text-black"
                  onClick={showReviewPage}
                >
                  Try again
                </button>
              ) : !showConfettiSuccess ? (
                <CopyLink
                  link={clubDepositLink}
                  updateCopyState={updateDepositLinkCopyState}
                  showCopiedState={showDepositLinkCopyState}
                  creatingSyndicate={creatingSyndicate}
                  syndicateSuccessfullyCreated={syndicateSuccessfullyCreated}
                  showConfettiSuccess={showConfettiSuccess}
                />
              ) : null}
            </div>
          </div>
        </FadeIn>
        <CreateEntityCard />
      </div>
    </ErrorBoundary>
  );
};

export default ManagerActions;
