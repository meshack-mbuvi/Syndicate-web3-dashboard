import { amplitudeLogger, Flow } from '@/components/amplitude';
import { DEPOSIT_LINK_COPY } from '@/components/amplitude/eventNames';
import ErrorBoundary from '@/components/errorBoundary';
import FadeIn from '@/components/fadeIn/FadeIn';
import CreateEntityCard from '@/components/shared/createEntityCard';
import MakeDistributionCard from '@/components/shared/makeDistributionCard';
import ModifyClubSettingsCard from '@/components/shared/modifyClubSettingsCard';
import SignLegalDocumentsCard from '@/components/shared/signLegalDocumentsCard';
import { SkeletonLoader } from '@/components/skeletonLoader';
import StatusBadge from '@/components/syndicateDetails/statusBadge';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import ConnectWalletAction from '@/components/syndicates/shared/connectWalletAction';
import { L2 } from '@/components/typography';
import { SuccessCard } from '@/containers/managerActions/successCard';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { useDemoMode } from '@/hooks/useDemoMode';
import useFeatureFlag from '@/hooks/useFeatureFlag';
import { FEATURE_FLAGS } from '@/pages/_app';
import { AppState } from '@/state';
import { setDepositReadyInfo } from '@/state/legalInfo';
import { Status } from '@/state/wallet/types';
import { generateMemberSignURL } from '@/utils/generateMemberSignURL';
import { XIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { animated } from 'react-spring';
import GenerateDepositLink, { DepositLinkModal } from './GenerateDepositLink';
import ShareOrChangeLegalDocuments from './shared/ShareOrChangeLegalDocuments';

const useShowShareWarning = () => {
  const router = useRouter();
  const initialChoice = () => {
    let previousChoice;
    if (router.isReady) {
      previousChoice = window.localStorage.getItem('ShareWarning') || null;
    }
    return previousChoice === 'true' || previousChoice === null;
  }; // TODO: Use Redux persist to save user preferences

  const [showShareWarning, setshowShareWarning] = useState(initialChoice);
  const handleShowShareWarning = (val: boolean) => {
    localStorage.setItem('showShareWarning', val.toString());
    setshowShareWarning(val);
  };
  return {
    showShareWarning,
    setshowShareWarning,
    handleShowShareWarning
  };
};

const ManagerActions = (): JSX.Element => {
  const {
    web3Reducer: {
      web3: { status, activeNetwork }
    },
    erc20TokenSliceReducer: { erc20Token },
    createInvestmentClubSliceReducer: {
      clubCreationStatus: {
        transactionHash // TODO: this will be empty after reload
      }
    },
    legalInfoReducer: {
      walletSignature: { signature },
      depositReadyInfo: { depositLink, adminSigned }
    }
  } = useSelector((state: AppState) => state);

  const {
    isReady,
    readyClient: readyDistributionsClient,
    isTreatmentOn: isDistributionsTreatmentOn
  } = useFeatureFlag(FEATURE_FLAGS.DISTRIBUTIONS, {
    distributionsAllowlisted: true
  });

  const { resetCreationStates } = useCreateInvestmentClubContext();
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    loading,
    depositsEnabled,
    claimEnabled,
    totalSupply,
    maxTotalSupply
  } = erc20Token;

  const { clubAddress, source } = router.query;

  // we show loading state until content processing has been completed
  // meaning we are sure what to show the user depending on whether it's member
  // or manager content

  const { showShareWarning, handleShowShareWarning } = useShowShareWarning();

  const [showDepositLinkCopyState, setShowDepositLinkCopyState] =
    useState(false);
  const [showGenerateLinkModal, setShowGenerateLinkModal] = useState(false);

  const [hasAgreements, setHasAgreememnts] = useState(false);

  const setClubDepositLink = (clubDepositLink: string) => {
    dispatch(
      setDepositReadyInfo({ adminSigned, depositLink: clubDepositLink })
    );
  };

  // variables to track investment club creation process.
  // TODO: actual values should be fetched from the redux store.
  // to update this once the contract calls have been updated
  const creatingSyndicate = false;
  const [syndicateSuccessfullyCreated, setSyndicateSuccessfullyCreated] =
    useState<boolean>(false);
  const syndicateCreationFailed = false;

  const isDemoMode = useDemoMode();

  // club deposit link
  useEffect(() => {
    const legal = JSON.parse(localStorage.getItem('legal') || '{}');
    const clubLegalData = legal[clubAddress as string];
    setHasAgreememnts(clubLegalData?.signaturesNeeded || false);
    if (!clubLegalData?.signaturesNeeded) {
      return setClubDepositLink(
        `${window.location.origin}/clubs/${clubAddress}?chain=${activeNetwork.network}`
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
        activeNetwork.network
      );
      setClubDepositLink(memberSignURL);
    }
  }, [clubAddress, signature, showGenerateLinkModal]);

  // trigger confetti if we are coming from syndicateCreate page
  useEffect(() => {
    if (!clubAddress) return;

    if (source && source === 'create') {
      // reset creation context states
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      resetCreationStates();
      setSyndicateSuccessfullyCreated(true);
      // truncates the query part to prevent reshowing confetti
      router.push(
        `/clubs/${clubAddress}/manage${'?chain=' + activeNetwork.network}`
      );
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
    amplitudeLogger(DEPOSIT_LINK_COPY, {
      flow: Flow.CLUB_CREATE
    });
  };

  const [linkShareAgreementChecked, setLinkShareAgreementChecked] =
    useState(false);
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const depositExceedTotal = +totalSupply === +maxTotalSupply;

  const [showShareOrChangeLegalDocs, setShowShareOrChangeLegalDocs] =
    useState(false);

  const handleSignLegalDocument = () => {
    const legal = JSON.parse(localStorage.getItem('legal') || '{}');

    const clubLegalData = legal[clubAddress as string];
    if (!clubLegalData) {
      setShowGenerateLinkModal(true);
      setLinkShareAgreementChecked(true);
    } else {
      setShowShareOrChangeLegalDocs(true);
    }
  };

  const handleChangeLegalDocument = () => {
    setShowGenerateLinkModal(true);
    setLinkShareAgreementChecked(true);
    setShowShareOrChangeLegalDocs(false);
  };

  return (
    <>
      {isReady && readyDistributionsClient ? (
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
                    showConfettiSuccess
                  }}
                  isManager
                  depositExceedTotal={depositExceedTotal}
                />
                {status !== Status.DISCONNECTED && loading ? (
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
                ) : (depositsEnabled && !depositExceedTotal) || claimEnabled ? (
                  <div
                    className={`h-fit-content relative ${
                      showConfettiSuccess
                        ? 'p-0'
                        : `pt-6 ${showShareWarning ? 'pb-6' : 'pb-10'} px-8`
                    } flex justify-center items-start flex-col w-full`}
                  >
                    {status === Status.DISCONNECTED && !isDemoMode ? (
                      <ConnectWalletAction />
                    ) : (
                      <>
                        {!syndicateCreationFailed &&
                          !creatingSyndicate &&
                          !showConfettiSuccess && (
                            <div className="flex flex-col items-start mb-6">
                              <L2 extraClasses="pb-2">
                                Invite to {claimEnabled ? 'claim' : 'deposit'}
                              </L2>
                              <div className="text-gray-syn4">
                                <p>
                                  Invite members by sharing your club’s{' '}
                                  {claimEnabled ? 'claim' : 'deposit'} link
                                </p>
                                {!adminSigned && (
                                  <button
                                    className="flex space-between mt-3"
                                    onClick={() =>
                                      setLinkShareAgreementChecked(
                                        !linkShareAgreementChecked
                                      )
                                    }
                                  >
                                    <input
                                      className="bg-transparent rounded mt-1 focus:ring-offset-0 cursor-pointer"
                                      onChange={() =>
                                        setLinkShareAgreementChecked(
                                          !linkShareAgreementChecked
                                        )
                                      }
                                      type="checkbox"
                                      id="linkShareAgreement"
                                      name="linkShareAgreement"
                                      checked={linkShareAgreementChecked}
                                    />
                                    <animated.p className="text-sm text-gray-syn4 ml-3 text-left">
                                      I agree to only share this link privately.
                                      I understand that publicly sharing this
                                      link may violate securities laws.{' '}
                                      <br></br>
                                      <a
                                        target="_blank"
                                        style={{ color: '#4376ff' }}
                                        href="https://www.sec.gov/reportspubs/investor-publications/investorpubsinvclubhtm.html"
                                        rel="noopener noreferrer"
                                      >
                                        Learn more.
                                      </a>{' '}
                                    </animated.p>
                                  </button>
                                )}
                                {adminSigned && (
                                  <p>
                                    {hasAgreements
                                      ? 'Contains legal agreements'
                                      : 'Bypasses legal agreements'}{' '}
                                    <button
                                      className="text-blue-navy cursor-pointer"
                                      onClick={() =>
                                        setShowGenerateLinkModal(true)
                                      }
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
                              existence. Once the transaction is complete,
                              you’ll see your club’s deposit link below.
                            </p>
                            <BlockExplorerLink
                              resourceId={transactionHash}
                              prefix="View progress on "
                              resource="transaction"
                            />
                          </div>
                        )}

                        {syndicateCreationFailed && (
                          <div className="flex flex-col items-center pb-6">
                            <p className="text-gray-syn4 pb-6">
                              Please try again and{' '}
                              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                              <a
                                href="#"
                                className="text-blue hover:opacity-90"
                                target="_blank"
                              >
                                let us know
                              </a>{' '}
                              if the issue persists.
                            </p>
                            <BlockExplorerLink
                              resourceId={transactionHash}
                              resource="transaction"
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
                                clubDepositLink: depositLink,
                                showConfettiSuccess,
                                setShowConfettiSuccess
                              }}
                            />
                          </div>
                        )}
                        {!showConfettiSuccess && (
                          <GenerateDepositLink
                            showGenerateLinkModal={showGenerateLinkModal}
                            setShowGenerateLinkModal={setShowGenerateLinkModal}
                            updateDepositLinkCopyState={
                              updateDepositLinkCopyState
                            }
                            showDepositLinkCopyState={showDepositLinkCopyState}
                            syndicateCreationFailed={syndicateCreationFailed}
                            showConfettiSuccess={showConfettiSuccess}
                            creatingSyndicate={creatingSyndicate}
                            syndicateSuccessfullyCreated={
                              syndicateSuccessfullyCreated
                            }
                            agreementChecked={linkShareAgreementChecked}
                          />
                        )}

                        {showShareWarning &&
                          !showConfettiSuccess &&
                          adminSigned && (
                            <div className="flex flex-row mt-4 text-gray-syn4 bg-gray-syn9 rounded-1.5lg py-3 px-4">
                              <p className="text-sm">
                                I agree to only share this link privately. I
                                understand that publicly sharing this link may
                                violate securities laws.{' '}
                                <a
                                  target="_blank"
                                  style={{ color: '#4376ff' }}
                                  href="https://www.sec.gov/reportspubs/investor-publications/investorpubsinvclubhtm.html"
                                  rel="noopener noreferrer"
                                >
                                  Learn more.
                                </a>{' '}
                              </p>
                              <div className="flex items-center pl-2.5">
                                <XIcon
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={() => handleShowShareWarning(false)}
                                  onKeyPress={() =>
                                    handleShowShareWarning(false)
                                  }
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
              <DepositLinkModal
                setShowGenerateLinkModal={setShowGenerateLinkModal}
                showGenerateLinkModal={showGenerateLinkModal}
              />
            </FadeIn>

            {status !== Status.DISCONNECTED && (
              <div className="flex bg-gray-syn8 duration-500 transition-all rounded-2.5xl my-6 p-4 space-y-4 items-start flex-col">
                {/* TODO: Update to distributions before merging */}
                {isDistributionsTreatmentOn ? (
                  <div
                    className={`${
                      loading || depositsEnabled ? `` : `hover:bg-gray-syn7`
                    } rounded-xl py-2 px-4 w-full`}
                  >
                    {loading ? (
                      <>
                        <SkeletonLoader width="2/3" height="6" />
                        <SkeletonLoader width="full" height="10" />
                      </>
                    ) : (
                      <MakeDistributionCard depositsEnabled={depositsEnabled} />
                    )}
                  </div>
                ) : null}

                <div
                  className={`${
                    loading ? `` : `hover:bg-gray-syn7`
                  } rounded-xl py-2 px-4 w-full`}
                >
                  {loading ? (
                    <>
                      <SkeletonLoader width="2/3" height="6" />
                      <SkeletonLoader width="full" height="10" />
                    </>
                  ) : (
                    <CreateEntityCard />
                  )}
                </div>

                {!depositsEnabled ? (
                  <div
                    className={`${
                      loading ? `` : `hover:bg-gray-syn7`
                    } rounded-xl py-2 px-4 w-full`}
                  >
                    {loading ? (
                      <SkeletonLoader width="full" height="6" />
                    ) : (
                      <SignLegalDocumentsCard
                        onClick={handleSignLegalDocument}
                      />
                    )}
                  </div>
                ) : null}

                <div
                  className={`${
                    loading ? `` : `hover:bg-gray-syn7`
                  } rounded-xl py-2 px-4 w-full`}
                >
                  {loading ? (
                    <SkeletonLoader width="full" height="6" />
                  ) : (
                    <ModifyClubSettingsCard />
                  )}
                </div>
              </div>
            )}

            <ShareOrChangeLegalDocuments
              showShareOrChangeDocs={showShareOrChangeLegalDocs}
              setShowShareOrChangeDocsModal={setShowShareOrChangeLegalDocs}
              handleChangeLegalDocument={handleChangeLegalDocument}
            />
          </div>
        </ErrorBoundary>
      ) : null}
    </>
  );
};

export default ManagerActions;
