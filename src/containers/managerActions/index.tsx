import ErrorBoundary from "@/components/errorBoundary";
import FadeIn from "@/components/fadeIn/FadeIn";
import ArrowDown from "@/components/icons/arrowDown";
import CopyLink from "@/components/shared/CopyLink";
import CreateEntityCard from "@/components/shared/createEntityCard";
import { SkeletonLoader } from "@/components/skeletonLoader";
import StatusBadge from "@/components/syndicateDetails/statusBadge";
import ConnectWalletAction from "@/components/syndicates/shared/connectWalletAction";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import { SuccessCard } from "@/containers/managerActions/successCard";
import { AppState } from "@/state";
import { Status } from "@/state/wallet/types";
import { generateMemberSignURL } from "@/utils/generateMemberSignURL";
import { ArrowNarrowRightIcon, XIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CopyLinkIcon } from "src/components/iconWrappers";
import GenerateDepositLinkModal from "./GenerateDepositLink";

const useShowShareWarning = () => {
  const router = useRouter();
  const initialChoice = () => {
    let previousChoice;
    if (router.isReady) {
      previousChoice = window.localStorage.getItem("ShareWarning") || null;
    }
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
    web3Reducer: {
      web3: { status },
    },
    erc20TokenSliceReducer: { erc20Token },
    createInvestmentClubSliceReducer: {
      clubCreationStatus: {
        transactionHash, // TODO: this will be empty after reload
      },
    },
    legalInfoReducer: {
      walletSignature: { signature },
    },
  } = useSelector((state: AppState) => state);
  const router = useRouter();

  const {
    loading,
    depositsEnabled,
    address,
    isOwner,
    claimEnabled,
    totalDeposits,
    maxTotalDeposits,
  } = erc20Token;

  const { clubAddress, source } = router.query;

  // we show loading state until content processing has been completed
  // meaning we are sure what to show the user depending on whether it's member
  // or manager content
  const [readyToDisplay, setReadyToDisplay] = useState(false);

  const { showShareWarning, handleShowShareWarning } = useShowShareWarning();

  useEffect(() => {
    //  Content processing not yet completed
    if (!address) return;

    // Don't Migrate if wallet is disconnected
    if (status === Status.CONNECTED && isOwner) {
      setReadyToDisplay(true);
    }
  }, [isOwner, address, router, clubAddress, status]);

  const [showDepositLinkCopyState, setShowDepositLinkCopyState] =
    useState(false);
  const [clubDepositLink, setClubDepositLink] = useState("");
  const [docSigned, setDocSigned] = useState(false);
  const [copyLinkCTA, setCopyLinkCTA] = useState("border-gray-syn6");
  const [showGenerateLinkModal, setShowGenerateLinkModal] = useState(false);
  const [hasAgreements, setHasAgreememnts] = useState(false);

  // variables to track investment club creation process.
  // TODO: actual values should be fetched from the redux store.
  // to update this once the contract calls have been updated
  const creatingSyndicate = false;
  const [syndicateSuccessfullyCreated, setSyndicateSuccessfullyCreated] =
    useState<boolean>(false);
  const syndicateCreationFailed = false;

  // club deposit link
  useEffect(() => {
    const legal = JSON.parse(localStorage.getItem("legal") || "{}");
    const clubLegalData = legal[clubAddress as string];
    setHasAgreememnts(clubLegalData?.signaturesNeeded || false);
    if (!clubLegalData?.signaturesNeeded) {
      return setClubDepositLink(
        `${window.location.origin}/clubs/${clubAddress}`,
      );
    }
    if (
      clubLegalData?.clubData.adminSignature &&
      clubLegalData.signaturesNeeded
    ) {
      const memberSignURL = generateMemberSignURL(
        clubAddress as string,
        clubLegalData.clubData,
        clubLegalData.clubData.adminSignature,
      );
      setClubDepositLink(memberSignURL);
    }
  }, [clubAddress, signature, showGenerateLinkModal]);

  // trigger confetti if we are coming from syndicateCreate page
  useEffect(() => {
    if (!clubAddress) return;

    if (source && source === "create") {
      setSyndicateSuccessfullyCreated(true);
      // truncates the query part to prevent reshowing confetti
      router.push(`/clubs/${clubAddress}/manage`);
    }
  }, [source, clubAddress, router]);

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
                claimEnabled,
                creatingSyndicate,
                syndicateSuccessfullyCreated,
                syndicateCreationFailed,
                showConfettiSuccess,
              }}
              isManager
              depositExceedTotal={+totalDeposits === +maxTotalDeposits}
            />
            {status !== Status.DISCONNECTED && (loading || !readyToDisplay) ? (
              <div className="h-fit-content relative py-6 px-8 flex justify-center items-start flex-col w-full">
                <SkeletonLoader
                  width="1/3"
                  height="5"
                  borderRadius="rounded-full"
                />
                <SkeletonLoader
                  width="3/4"
                  height="4"
                  borderRadius="rounded-full"
                />
                <SkeletonLoader width="full" height="12" />
              </div>
            ) : depositsEnabled || claimEnabled ? (
              <div
                className={`h-fit-content relative ${
                  showConfettiSuccess
                    ? "p-0"
                    : `pt-6 ${showShareWarning ? "pb-6" : "pb-10"} px-8`
                } flex justify-center items-start flex-col w-full`}
              >
                {status === Status.DISCONNECTED ? (
                  <ConnectWalletAction />
                ) : (
                  <>
                    {!syndicateCreationFailed &&
                      !creatingSyndicate &&
                      !showConfettiSuccess && (
                        <div className="flex flex-col items-start mb-6">
                          <p className="pb-2 uppercase text-white text-sm font-whyte-medium">
                            Invite to {claimEnabled ? "claim" : "deposit"}
                          </p>
                          <div className="text-gray-syn4">
                            <p>
                              Invite members by sharing your club’s{" "}
                              {claimEnabled ? "claim" : "deposit"} link
                            </p>
                            {docSigned && (
                              <p>
                                {hasAgreements
                                  ? "Contains legal agreements"
                                  : "Bypasses legal agreements"}{" "}
                                <button
                                  className="text-blue-navy cursor-pointer"
                                  onClick={() => setShowGenerateLinkModal(true)}
                                >
                                  Change
                                </button>
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                    {creatingSyndicate && (
                      <div className="pb-6 flex flex-col items-center justify-center">
                        <p className="pb-6 text-gray-syn4 text-center">
                          Your investment club is coming into on-chain
                          existence. Once the transaction is complete, you’ll
                          see your club’s deposit link below.
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
                            setShowConfettiSuccess,
                          }}
                        />
                      </div>
                    )}
                    {!docSigned && (
                      <>
                        <button
                          className="bg-green rounded-custom w-full flex items-center justify-center py-4 mb-4"
                          onClick={() => setShowGenerateLinkModal(true)}
                        >
                          <div className="flex-grow-1 mr-3">
                            <CopyLinkIcon color="text-black" />
                          </div>
                          <p className="text-black pr-1 whitespace-nowrap font-whyte-medium">
                            Generate link to invite members
                          </p>
                        </button>
                        <div className="flex justify-center w-full mb-4">
                          <ArrowDown />
                        </div>
                      </>
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
                        creatingSyndicate={
                          !docSigned ? true : creatingSyndicate
                        }
                        syndicateSuccessfullyCreated={
                          syndicateSuccessfullyCreated
                        }
                        showConfettiSuccess={showConfettiSuccess}
                        borderColor={copyLinkCTA}
                      />
                    ) : null}
                    <GenerateDepositLinkModal
                      setDocSigned={setDocSigned}
                      setShowGenerateLinkModal={setShowGenerateLinkModal}
                      showGenerateLinkModal={showGenerateLinkModal}
                      setCopyLinkCTA={setCopyLinkCTA}
                    />
                    {showShareWarning && !showConfettiSuccess && docSigned && (
                      <div className="flex flex-row mt-4 text-yellow-warning bg-brown-dark rounded-1.5lg py-3 px-4">
                        <p className="text-sm">
                          Do not publicly share this deposit link. Only share
                          with trusted and qualified people.&nbsp;
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
                  </>
                )}
              </div>
            ) : null}
          </div>
        </FadeIn>
        {status !== Status.DISCONNECTED && <CreateEntityCard />}
      </div>
    </ErrorBoundary>
  );
};

export default ManagerActions;
