import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ArrowNarrowRightIcon, XIcon } from "@heroicons/react/solid";
import ErrorBoundary from "@/components/errorBoundary";
import FadeIn from "@/components/fadeIn/FadeIn";
import CopyLink from "@/components/shared/CopyLink";
import CreateEntityCard from "@/components/shared/createEntityCard";
import { SkeletonLoader } from "@/components/skeletonLoader";
import StatusBadge from "@/components/syndicateDetails/statusBadge";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import { SuccessCard } from "@/containers/managerActions/successCard";
import { RootState } from "@/redux/store";

const useShowShareWarning = () => {
  const initialChoice = () => {
    const previousChoice = window.localStorage.getItem("ShareWarning") || null;
    return previousChoice === "true" || previousChoice === null;
  }; // TODO: Use Redux persist to save user preferences

  const [showShareWarning, setshowShareWarning] = useState(initialChoice);
  const handleShowShareWarning = (val: boolean) => {
    localStorage.setItem("showShareWarning", val.toString());
    setshowShareWarning(val);
  };
  return {
    showShareWarning,
    setshowShareWarning,
    handleShowShareWarning,
  };
};

const ManagerActions = (): JSX.Element => {
  const {
    erc20TokenSliceReducer: { erc20Token },
    createInvestmentClubSliceReducer: {
      clubCreationStatus: {
        transactionHash, // TODO: this will be empty after reload
      },
    },
  } = useSelector((state: RootState) => state);
  const router = useRouter();

  const { loading, depositsEnabled, address, isOwner } = erc20Token;

  const { clubAddress, source } = router.query;

  // we show loading state until content processing has been completed
  // meaning we are sure what to show the user depending on whether it's member
  // or manager content
  const [readyToDisplay, setReadyToDisplay] = useState(false);

  const { showShareWarning, handleShowShareWarning } = useShowShareWarning();

  useEffect(() => {
    //  Content processing not yet completed
    if (!address) return;

    // Redirect the owner to the manage page
    if (!isOwner) {
      router.push(`/clubs/${clubAddress}/deposit`);
    } else {
      setReadyToDisplay(true);
    }
  }, [isOwner, address, router, clubAddress]);

  const [showDepositLinkCopyState, setShowDepositLinkCopyState] =
    useState(false);
  const [clubDepositLink, setClubDepositLink] = useState("");

  // variables to track investment club creation process.
  // TODO: actual values should be fetched from the redux store.
  // to update this once the contract calls have been updated
  const creatingSyndicate = false;
  const [syndicateSuccessfullyCreated, setSyndicateSuccessfullyCreated] =
    useState<boolean>(false);
  const syndicateCreationFailed = false;

  // club deposit link
  useEffect(() => {
    setClubDepositLink(
      `${window.location.origin}/clubs/${clubAddress}/deposit`,
    );
  }, [clubAddress]);

  // trigger confetti if we are coming from syndicateCreate page
  useEffect( () => {
    if (source && source === 'create') {
      setSyndicateSuccessfullyCreated(true)
      // truncates the query part to prevent reshowing confetti
      router.push(`/syndicates/${clubAddress}/manage`)
    }
  }, [source])

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
    }
  }, [syndicateSuccessfullyCreated]);

  if (loading || !readyToDisplay) {
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
      <div className="w-full mt-4 sm:mt-0 relative overflow-hidden">
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
                showConfettiSuccess
                  ? "p-0"
                  : `pt-6 ${showShareWarning ? "pb-6" : "pb-10"} px-8`
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
                      showConfettiSuccess,
                      setShowConfettiSuccess
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
              {showShareWarning && (
                <div className="flex flex-row mt-4 text-yellow-saffron bg-brown-dark rounded-1.5lg py-3 px-4">
                  <p className="text-sm">
                    Do not publicly share this deposit link. Only share with
                    trusted and qualified people.&nbsp;
                    <a
                      className="underline"
                      rel="noreferrer"
                      href="https://www.sec.gov/reportspubs/investor-publications/investorpubsinvclubhtm.html"
                      target="_blank"
                    >
                      Learn more from the SEC
                      <ArrowNarrowRightIcon className="h-4 w-4 inline-block no-underline ml-1" />
                    </a>
                  </p>
                  <div className="flex items-center pl-2.5">
                    <XIcon
                      className="h-7 w-7 cursor-pointer"
                      onClick={() => handleShowShareWarning(false)}
                      onKeyPress={() => handleShowShareWarning(false)}
                      role="button"
                      tabIndex={0}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
        <CreateEntityCard />
      </div>
    </ErrorBoundary>
  );
};

export default ManagerActions;
