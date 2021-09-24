import { amplitudeLogger, Flow } from "@/components/amplitude";
import { CLICK_CREATE_A_SYNDICATE } from "@/components/amplitude/eventNames";
import ErrorBoundary from "@/components/errorBoundary";
import Layout from "@/components/layout";
import Footer from "@/components/navigation/footer";
import OnboardingModal from "@/components/onboarding";
import { Spinner } from "@/components/shared/spinner";
import BackButton from "@/components/socialProfiles/backButton";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import { showWalletModal } from "@/redux/actions";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { formatAddress } from "@/utils/formatAddress";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tab } from "@headlessui/react";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import Button from "src/components/buttons";
import { syndicateActionConstants } from "src/components/syndicates/shared/Constants";
import Head from "src/components/syndicates/shared/HeaderTitle";
import SyndicateDetails from "src/components/syndicates/syndicateDetails";
import ManageMembers from "../managerActions/manageMembers";

const LayoutWithSyndicateDetails = ({ children }): JSX.Element => {
  // Retrieve state
  const {
    syndicatesReducer: { syndicate, syndicateFound, syndicateAddressIsValid },
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: { account, web3 },
    },
    loadingReducer: { submitting },
  } = useSelector((state: RootState) => state);

  const [showCopyState, setShowCopyState] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  const updateAddressCopyState = () => {
    setShowCopyState(true);
    setTimeout(() => setShowCopyState(false), 1000);
  };

  const showSyndicateForm = () => {
    // Trigger wallet connection if wallet is not connected
    if (!account) {
      return dispatch(showWalletModal());
    }

    router.replace("/syndicates/create");

    // Amplitude logger: How many users clicked on the "Create a Syndicate" button
    amplitudeLogger(CLICK_CREATE_A_SYNDICATE, { flow: Flow.MGR_CREATE_SYN });
  };
  const [showMembers, setShowMembers] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  // used to render right column components on the left column in small devices
  const ref = useRef();

  const { syndicateAddress } = router.query;

  // format an account address in the format 0x3f6q9z52…54h2kjh51h5zfa
  const formattedSyndicateAddress3XLarge = formatAddress(
    syndicateAddress,
    18,
    18,
  );
  const formattedSyndicateAddressXLarge = formatAddress(
    syndicateAddress,
    10,
    10,
  );
  const formattedSyndicateAddressLarge = formatAddress(syndicateAddress, 8, 8);
  const formattedSyndicateAddressMedium = formatAddress(syndicateAddress, 6, 4);
  const formattedSyndicateAddressSmall = formatAddress(
    syndicateAddress,
    10,
    14,
  );
  const formattedSyndicateAddressMobile = formatAddress(syndicateAddress, 5, 8);

  const [accountIsManager, setAccountIsManager] = useState<boolean>(false);
  const showOnboardingIfNeeded = router.pathname.endsWith("deposit");

  let noSyndicate;
  // A manager should not access deposit page but should be redirected
  // to syndicates page
  useEffect(() => {
    // We need to have syndicate loaded so that we know whether it's open to
    // deposit or not.
    if (!router.isReady || !syndicate) return;

    if (
      !isEmpty(syndicate) &&
      syndicateAddress !== undefined &&
      account !== undefined &&
      web3.utils.isAddress(syndicate.syndicateAddress)
    ) {
      switch (router.pathname) {
        case "/syndicates/[syndicateAddress]/manage":
          // For a closed syndicate, user should be navigated to withdrawal page
          if (syndicate.managerCurrent !== account) {
            if (syndicate?.open) {
              router.replace(
                `/syndicates/${syndicate.syndicateAddress}/deposit`,
              );
            } else {
              router.replace(
                `/syndicates/${syndicate.syndicateAddress}/withdraw`,
              );
            }
          }
          setShowMembers(true);
          break;
        case "/syndicates/[syndicateAddress]/deposit":
          if (syndicate?.managerPending === account) {
            router.replace(`/syndicates/${syndicateAddress}/manager_pending`);
          } else if (syndicate.managerCurrent === account) {
            router.replace(`/syndicates/${syndicate.syndicateAddress}/manage`);
          } else if (syndicate.distributing) {
            router.replace(
              `/syndicates/${syndicate.syndicateAddress}/withdraw`,
            );
          }
          setShowMembers(false);
          break;
        case "/syndicates/[syndicateAddress]/withdraw":
          if (syndicate?.managerPending === account) {
            router.replace(`/syndicates/${syndicateAddress}/manager_pending`);
          } else if (syndicate.managerCurrent === account) {
            router.replace(`/syndicates/${syndicate.syndicateAddress}/manage`);
          } else if (syndicate.depositsEnabled || syndicate.open) {
            router.replace(`/syndicates/${syndicate.syndicateAddress}/deposit`);
          }
          setShowMembers(false);
          break;
        // case when address lacks action
        case "/syndicates/[syndicateAddress]/":
          if (syndicate.managerCurrent === account) {
            router.replace(`/syndicates/${syndicate.syndicateAddress}/manage`);
          } else if (syndicate.depositsEnabled || syndicate.open) {
            router.replace(`/syndicates/${syndicate.syndicateAddress}/deposit`);
          } else if (syndicate.distributing) {
            router.replace(
              `/syndicates/${syndicate.syndicateAddress}/withdraw`,
            );
          }
          setShowMembers(false);
          break;
        default:
          if (syndicateAddress && syndicate) {
            if (syndicate.managerCurrent === account) {
              router.replace(
                `/syndicates/${syndicate.syndicateAddress}/manage`,
              );
            } else if (syndicate.depositsEnabled || syndicate.open) {
              router.replace(
                `/syndicates/${syndicate.syndicateAddress}/deposit`,
              );
            } else if (syndicate.distributing) {
              router.replace(
                `/syndicates/${syndicate.syndicateAddress}/withdraw`,
              );
            } else if (
              syndicate.managerCurrent !== account &&
              !syndicate.open
            ) {
              router.replace(
                `/syndicates/${syndicate.syndicateAddress}/details`,
              );
            }
          }
          break;
      }
    }
  }, [account, router.isReady, syndicate]);

  // Syndicate data should be fetched when router is fully set.
  // GetterLogicContract is used to retrieve syndicate values while
  // DistributionLogicContract is used to get distributions details for the
  // syndicate.
  useEffect(() => {
    if (
      router.isReady &&
      syndicateContracts?.GetterLogicContract &&
      syndicateContracts?.DistributionLogicContract
    ) {
      dispatch(
        getSyndicateByAddress({ syndicateAddress, ...syndicateContracts }),
      );
    }
  }, [
    router.isReady,
    syndicateContracts?.GetterLogicContract,
    syndicateContracts?.DistributionLogicContract,
    account,
    syndicateAddress,
    account,
  ]);

  // check whether the current connected wallet account is the manager of the syndicate
  // we'll use this information to load the manager view
  useEffect(() => {
    if (syndicate && syndicate?.managerCurrent == account) {
      setAccountIsManager(true);
    } else {
      setAccountIsManager(false);
    }
    setCurrentUrl(window.location.href);
  }, [syndicate, account]);

  // get static text from constants
  const {
    noSyndicateTitleText,
    noSyndicateMessageText,
    syndicateAddressInvalidMessageText,
    syndicateAddressInvalidTitleText,
    notSyndicateYetTitleText,
    notSyndicateYetMessageText,
    notSyndicateForManagerYetMessageText,
    creatingSyndicateForManagerTitle,
    creatingSyndicateTitle,
  } = syndicateActionConstants;

  // set texts to display on empty state
  // we'll initialize this to instances where address is not a syndicate.
  // if the address is invalid, this texts will be updated accordingly.
  let emptyStateTitle = noSyndicateTitleText;
  let creatingSyndicateStateTitle = "";
  let emptyStateMessage = noSyndicateMessageText;
  if (!syndicateAddressIsValid) {
    emptyStateTitle = syndicateAddressInvalidTitleText;
    emptyStateMessage = syndicateAddressInvalidMessageText;
  }

  if (
    syndicateAddressIsValid &&
    !syndicateFound &&
    account !== syndicateAddress
  ) {
    emptyStateTitle = notSyndicateYetTitleText;
    emptyStateMessage = notSyndicateYetMessageText;
  }

  if (
    syndicateAddressIsValid &&
    !syndicateFound &&
    account === syndicateAddress
  ) {
    emptyStateTitle = notSyndicateYetTitleText;
    emptyStateMessage = notSyndicateForManagerYetMessageText;
  }
  if (
    submitting &&
    syndicateAddressIsValid &&
    !syndicateFound &&
    account === syndicateAddress
  ) {
    creatingSyndicateStateTitle = creatingSyndicateForManagerTitle;
  }

  if (
    submitting &&
    syndicateAddressIsValid &&
    !syndicateFound &&
    account !== syndicateAddress
  ) {
    creatingSyndicateStateTitle = creatingSyndicateTitle;
  }

  // set syndicate empty state.
  // component will be rendered if the address is not a syndicate or
  // if the address is invalid.
  const syndicateEmptyState = (
    <div className="flex justify-center items-center h-full w-full mt-6 sm:mt-10">
      <div className="flex flex-col items-center justify-center sm:w-7/12 md:w-5/12 rounded-custom bg-gray-6 p-10">
        <div className="w-full flex justify-center mb-6">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="h-12 text-gray-500 text-7xl"
          />
        </div>
        <p className="font-semibold text-2xl text-center">{emptyStateTitle}</p>
        <p className="text-base my-5 font-normal text-gray-dim text-center">
          {emptyStateMessage}
        </p>
        {!syndicateAddressIsValid ? null : (
          <EtherscanLink etherscanInfo={syndicate?.syndicateAddress} />
        )}
      </div>
    </div>
  );

  const nonManagerCta = (
    <div className="flex items-center mt-2">
      <CopyToClipboard text={currentUrl} onCopy={updateAddressCopyState}>
        <div className="flex">
          <div className="ml-4 flex items-center ml-0 relative w-7 h-7 cursor-pointer rounded-full lg:hover:bg-gray-700 lg:active:bg-white lg:active:bg-opacity-20">
            {showCopyState ? (
              <span className="absolute text-xs -top-5 -left-1 text-blue">
                copied
              </span>
            ) : null}
            <img
              alt="copy"
              src="/images/copy-clipboard-blue.svg"
              className="cursor-pointer h-4 mx-auto transform rotate-180  fill-current text-blue"
            />
          </div>
          <p className="text-base text-blue">Copy link to create a syndicate</p>
        </div>
      </CopyToClipboard>
    </div>
  );

  const managerCta = (
    <div className="flex items-center mt-2">
      <Button
        customClasses="primary-CTA relative"
        textColor="text-black"
        onClick={() => showSyndicateForm()}
        createSyndicate={false}
      >
        <div className="hidden sm:block">Create a syndicate</div>
        <div className="block sm:hidden">Create</div>
      </Button>
    </div>
  );

  const syndicateNotFoundState = (
    <div className="flex justify-center items-center h-full w-full mt-6 sm:mt-10">
      <div className="flex flex-col items-center justify-center sm:w-7/12 md:w-5/12 rounded-custom p-10">
        <p className="font-semibold text-2xl text-center">
          {formatAddress(syndicateAddress, 9, 6)} {emptyStateTitle}
        </p>
        <p className="text-base my-5 font-normal text-gray-dim text-center">
          {emptyStateMessage}
        </p>
        {account === syndicateAddress ? managerCta : nonManagerCta}
      </div>
    </div>
  );

  const syndicateNotReadyLoaderState = (
    <div className="flex justify-center items-center h-full w-full mt-6 sm:mt-10">
      <div className="flex flex-col items-center justify-center sm:w-7/12 md:w-5/12 rounded-custom p-10">
        <Spinner />
        <p className="font-semibold text-xl text-center">
          {creatingSyndicateStateTitle}
        </p>
        {<EtherscanLink etherscanInfo={syndicateAddress} />}
      </div>
    </div>
  );

  const creatingSyndicate = (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row sm:mr-2 lg:mr-6 h-fit-content rounded-custom items-center justify-between">
          <div>
            <span className="font-medium text-gray-500 text-sm uppercase tracking-widest pb-3">
              Syndicate
            </span>
            <div className="justify-start">
              <div className="flex-shrink main-title flex-wrap break-all">
                <div className="mr-4">
                  <div className="hidden 3xl:block">
                    <span className="text-gray-500">0x</span>
                    {formattedSyndicateAddress3XLarge.slice(2)}
                  </div>
                  <div className="hidden xl:block 3xl:hidden">
                    <span className="text-gray-500">0x</span>
                    {formattedSyndicateAddressXLarge.slice(2)}
                  </div>
                  <div className="hidden lg:block xl:hidden">
                    <span className="text-gray-500">0x</span>
                    {formattedSyndicateAddressLarge.slice(2)}
                  </div>
                  <div className="hidden md:block lg:hidden">
                    <span className="text-gray-500">0x</span>
                    {formattedSyndicateAddressMedium.slice(2)}
                  </div>
                  <div className="hidden sm:block md:hidden">
                    <span className="text-gray-500">0x</span>
                    {formattedSyndicateAddressSmall.slice(2)}
                  </div>
                  <div className="sm:hidden">
                    <span className="text-gray-500">0x</span>
                    {formattedSyndicateAddressMobile.slice(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {syndicateNotReadyLoaderState}
      </div>
    </div>
  );

  if (!syndicateFound || !syndicateAddressIsValid) {
    noSyndicate = syndicateEmptyState;
  }

  if (!syndicateFound && syndicateAddressIsValid) {
    noSyndicate = syndicateNotFoundState;
    // noSyndicate = creatingSyndicate
  }

  if (submitting && !syndicateFound && syndicateAddressIsValid) {
    noSyndicate = creatingSyndicate;
  }

  return (
    <Layout>
      <Head title="Syndicate" />
      <ErrorBoundary>
        {showOnboardingIfNeeded && <OnboardingModal />}
        <div className="w-full">
          {noSyndicate ? (
            noSyndicate
          ) : (
            <div className="container mx-auto">
              {/* Two Columns (Syndicate Details + Widget Cards) */}
              <div className="flex flex-col md:flex-row">
                <BackButton topOffset="-1.2rem" />
                {/* Left Column */}
                <div className="md:w-3/5 w-full pb-6 md:pr-24">
                  <div ref={ref} className="w-full md:hidden" />{" "}
                  {/* its used as an identifier for ref in small devices */}
                  {/*
                  we should have an isChildVisible child here,
                  but it's not working as expected
                  */}
                  <SyndicateDetails accountIsManager={accountIsManager}>
                    <div className="w-full md:hidden">{children}</div>
                  </SyndicateDetails>
                </div>
                {/* Right Column */}
                <div className="lg:w-2/5 w-96 hidden md:block pt-0">
                  <div className="lg:max-w-120 lg:w-full w-96 mx-auto sticky relative top-33">
                    {children}
                  </div>
                </div>
              </div>

              {/* Tabbed components; only visible on manage pages */}
              {!isEmpty(syndicate) && showMembers === true && (
                <div className="w-full rounded-md h-full my-4">
                  <div className="w-full sm:px-0">
                    <Tab.Group defaultIndex={0}>
                      <Tab.List className="flex space-x-10 w-full">
                        <div className="w-full h-fit-content space-x-4 border-b-1 border-gray-nightrider">
                          <Tab
                            className={({ selected }) =>
                              `pr-3 pb-6 text-xs font-whyte uppercase ${
                                selected
                                  ? "text-white border-b-1 border-white"
                                  : "text-gray-lightManatee"
                              }`
                            }
                          >
                            Members
                          </Tab>
                        </div>
                      </Tab.List>

                      <Tab.Panels className="font-whyte text-blue-rockBlue w-full">
                        <Tab.Panel as="div">
                          <ManageMembers />
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                </div>
              )}

              <Footer extraClasses="mt-24 sm:mt-24 md:mt-40 mb-12" />
            </div>
          )}
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

export default LayoutWithSyndicateDetails;
