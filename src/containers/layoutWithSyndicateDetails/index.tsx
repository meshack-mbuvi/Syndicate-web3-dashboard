import React, { useEffect, useRef, useState, FC } from "react";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";

import { amplitudeLogger, Flow } from "@/components/amplitude";
import { CLICK_CREATE_A_SYNDICATE } from "@/components/amplitude/eventNames";
import ErrorBoundary from "@/components/errorBoundary";
import Layout from "@/components/layout";
import Footer from "@/components/navigation/footer";
import OnboardingModal from "@/components/onboarding";
import { Spinner } from "@/components/shared/spinner";
import BackButton from "@/components/socialProfiles/backButton";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import { checkAccountAllowance } from "@/helpers/approveAllowance";
import { getSyndicateDepositorData } from "@/redux/actions/manageMembers";
import { setSyndicateDistributionTokens } from "@/redux/actions/syndicateMemberDetails";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import {
  storeDepositTokenAllowance,
  storeDistributionTokensDetails,
} from "@/redux/actions/tokenAllowances";
import { RootState } from "@/redux/store";
import { showWalletModal } from "@/state/wallet/actions";
import { getTokenIcon } from "@/TokensList";
import { getWeiAmount, onlyUnique } from "@/utils/conversions";
import { formatAddress } from "@/utils/formatAddress";
import { getCoinFromContractAddress } from "functions/src/utils/ethereum";
import Button from "@/components/buttons";
import { syndicateActionConstants } from "src/components/syndicates/shared/Constants";
import Head from "@/components/syndicates/shared/HeaderTitle";
import SyndicateDetails from "@/components/syndicates/syndicateDetails";
import TabsButton from "@/components/TabsButton";
import ManageMembers from "../managerActions/manageMembers";
import { assetsFilterOptions } from "./constants";

const LayoutWithSyndicateDetails: FC = ({ children }) => {
  // Retrieve state
  const {
    syndicatesReducer: { syndicate, syndicateFound, syndicateAddressIsValid },
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: { account, web3 },
    },
    syndicateMemberDetailsReducer: { syndicateDistributionTokens },
    loadingReducer: { submitting },
    manageMembersDetailsReducer: {
      syndicateManageMembers: { syndicateMembers },
    },
  } = useSelector((state: RootState) => state);

  const [showCopyState, setShowCopyState] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [isSubNavStuck, setIsSubNavStuck] = useState(true);
  const subNav = useRef(null);

  const updateAddressCopyState = () => {
    setShowCopyState(true);
    setTimeout(() => setShowCopyState(false), 1000);
  };

  // Listen to page scrolling
  useEffect(() => {
    const onScroll = (e) => {
      setScrollTop(e.target.documentElement.scrollTop);
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Change sub-nav and nav styles when stuck
  useEffect(() => {
    if (subNav.current && subNav.current.getBoundingClientRect().top === 0) {
      setIsSubNavStuck(true);
      setShowNav(false);
    } else {
      setIsSubNavStuck(false);
      setShowNav(true);
    }
  }, [scrollTop]);

  const showSyndicateForm = () => {
    // Trigger wallet connection if wallet is not connected
    if (!account) {
      return dispatch(showWalletModal());
    }

    router.replace("/syndicates/create");

    // Amplitude logger: How many users clicked on the "Create a Syndicate" button
    amplitudeLogger(CLICK_CREATE_A_SYNDICATE, { flow: Flow.MGR_CREATE_SYN });
  };

  const router = useRouter();
  const dispatch = useDispatch();

  // used to render right column components on the left column in small devices

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

  // get events where distribution was set.
  // we'll fetch distributionERC20s from here and check if the manager has set the correct
  // allowance for all of them.
  const getManagerDistributionTokensAllowances = async () => {
    const addressOfSyndicate = web3.utils.toChecksumAddress(
      syndicateAddress as string,
    );

    // get events where member invested in a syndicate.
    const distributionEvents =
      await syndicateContracts.DistributionLogicContract.getDistributionEvents(
        "DistributionAdded",
        { syndicateAddress: addressOfSyndicate },
      );

    if (distributionEvents.length > 0) {
      // get all distributionERC20 tokens
      const distributionERC20s = [];
      const allowanceAndDistributionDetails = [];
      const syndicateDistributionTokensArray = [];

      for (let i = 0; i < distributionEvents.length; i++) {
        const { distributionERC20Address } = distributionEvents[i].returnValues;
        distributionERC20s.push(distributionERC20Address);
      }
      const uniqueERC20s = distributionERC20s.filter(onlyUnique);

      // set up token contract to check manager allowance for the ERC20
      for (let i = 0; i < uniqueERC20s.length; i++) {
        const tokenAddress = uniqueERC20s[i];

        const { decimals, symbol } = await getCoinFromContractAddress(
          tokenAddress,
        );

        // get token properties
        const tokenSymbol = symbol;
        const tokenDecimals = decimals ? decimals : "18";

        // get allowance set for token by the manager
        const managerAddress = syndicate?.managerCurrent;

        const tokenManagerAllowance = await checkAccountAllowance(
          tokenAddress,
          managerAddress,
          syndicateContracts.DistributionLogicContract._address,
        );

        /**
         * To find whether sufficient allowance is set, we need to compare total
         * unclaimed distributions against current allowance for a given token
         * address.
         *
         * Note: To get unclaimed distributions, we get the difference between
         * total current distributions and total claimed distributions.
         */
        const tokenAllowance = getWeiAmount(
          tokenManagerAllowance,
          tokenDecimals,
          false,
        );

        // get total distributions for the token
        const totalCurrentDistributions =
          await syndicateContracts.DistributionLogicContract.getDistributionTotal(
            syndicateAddress,
            tokenAddress,
          );

        // We should get also get total claimed distributions
        const totalClaimedDistributions =
          await syndicateContracts.DistributionLogicContract.getDistributionClaimedTotal(
            syndicateAddress,
            tokenAddress,
          );

        const tokenDistributions = getWeiAmount(
          totalCurrentDistributions,
          tokenDecimals,
          false,
        );

        const claimedDistributions = getWeiAmount(
          totalClaimedDistributions,
          tokenDecimals,
          false,
        );

        // Find the difference between total current and claimed distributions
        const totalUnclaimedDistributions =
          +tokenDistributions - +claimedDistributions;

        // check if allowance set is enough to cover distributions.
        const sufficientAllowanceSet =
          +tokenAllowance >= +totalUnclaimedDistributions;

        allowanceAndDistributionDetails.push({
          tokenAddress,
          tokenAllowance,
          tokenDistributions,
          sufficientAllowanceSet,
          tokenSymbol,
          tokenDecimals,
        });

        syndicateDistributionTokensArray.push({
          tokenAddress,
          tokenSymbol,
          tokenDecimals,
          tokenDistributions,
          selected: false,
          tokenIcon: getTokenIcon(tokenSymbol), // set Token Icon
        });
      }

      // dispatch token distribution details to the redux store
      dispatch(storeDistributionTokensDetails(allowanceAndDistributionDetails));

      // store distribution token details for the withdrawals page.
      // checking if we already have the value set in the redux store
      // this avoids a scenario where token selected states are reset when
      // the parent component is refreshed.
      if (syndicateDistributionTokens) {
        for (let i = 0; i < syndicateDistributionTokensArray.length; i++) {
          const currentToken = syndicateDistributionTokensArray[i];
          for (let j = 0; j < syndicateDistributionTokens.length; j++) {
            const currentStoredToken = syndicateDistributionTokens[j];
            if (
              currentToken.tokenAddress === currentStoredToken.tokenAddress &&
              currentStoredToken.selected
            ) {
              syndicateDistributionTokensArray[i].selected = true;
            }
          }
        }
      }

      dispatch(
        setSyndicateDistributionTokens(syndicateDistributionTokensArray),
      );

      //reset distribution token fields
      dispatch(storeDepositTokenAllowance([]));
    }
  };

  // get allowance set on manager's account for the current depositERC20
  const getManagerDepositTokenAllowance = async () => {
    const managerAddress = syndicate?.managerCurrent;
    const managerDepositTokenAllowance = await checkAccountAllowance(
      syndicate?.depositERC20Address,
      managerAddress,
      syndicateContracts.DepositLogicContract._address,
    );

    const managerDepositAllowance = getWeiAmount(
      managerDepositTokenAllowance,
      syndicate?.tokenDecimals,
      false,
    );

    // check if the allowance set by the manager is not enough to cover the total max. deposits.
    // if the current token allowance is less than the syndicate total max. deposits
    // but is greater than zero, we'll consider this insufficient allowance.
    // The manager needs to fix this by adding more deposit token allowance to enable members
    // to withdraw their deposits.
    const sufficientAllowanceSet =
      +managerDepositAllowance >= +syndicate?.depositTotalMax;

    // dispatch action to store deposit token allowance details
    dispatch(
      storeDepositTokenAllowance([
        {
          tokenAddress: syndicate?.depositERC20Address,
          tokenAllowance: managerDepositAllowance,
          tokenSymbol: syndicate?.depositERC20TokenSymbol,
          tokenDeposits: syndicate?.depositTotalMax,
          tokenDecimals: syndicate?.tokenDecimals,
          sufficientAllowanceSet,
        },
      ]),
    );
    //reset distribution details
    dispatch(storeDistributionTokensDetails([]));
  };

  // assess manager deposit and distributions token allowance
  useEffect(() => {
    if (web3 && syndicateContracts) {
      // if the syndicate is still open to deposits, we'll check the deposit token allowance.
      // otherwise, we'll check the distributions token(s) allowance(s)
      if (syndicate?.depositsEnabled) {
        getManagerDepositTokenAllowance();
      } else if (!syndicate?.depositsEnabled && syndicate?.distributing) {
        getManagerDistributionTokensAllowances();
      }
    }
  }, [
    syndicateContracts,
    syndicate,
    syndicate?.depositERC20TokenSymbol,
    syndicate?.tokenDecimals,
  ]);

  // Retrieve syndicate depositors
  useEffect(() => {
    if (syndicate) {
      dispatch(getSyndicateDepositorData());
    }
  }, [syndicate]);

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
          break;
        case "/syndicates/[syndicateAddress]/withdraw":
          if (syndicate?.managerPending === account) {
            router.replace(`/syndicates/${syndicateAddress}/manager_pending`);
          } else if (syndicate.managerCurrent === account) {
            router.replace(`/syndicates/${syndicate.syndicateAddress}/manage`);
          } else if (syndicate.depositsEnabled || syndicate.open) {
            router.replace(`/syndicates/${syndicate.syndicateAddress}/deposit`);
          }
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
  }, [account, router.isReady, syndicate, JSON.stringify(syndicateMembers)]);

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

  // Retrieve syndicate depositors
  useEffect(() => {
    if (syndicate) {
      dispatch(getSyndicateDepositorData());
    }
  }, [syndicate]);

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

  const [activeTab, setActiveTab] = useState("members");

  return (
    <Layout showNav={showNav}>
      <Head title="Syndicate" />
      <ErrorBoundary>
        {showOnboardingIfNeeded && <OnboardingModal />}
        <div className="w-full">
          {noSyndicate ? (
            noSyndicate
          ) : (
            <div className="container mx-auto ">
              {/* Two Columns (Syndicate Details + Widget Cards) */}
              <BackButton />
              <div className="grid grid-cols-12 gap-5">
                {/* Left Column */}
                <div className="md:col-start-1 md:col-end-7 col-span-12">
                  {/* <div ref={ref} className="w-full md:hidden" />{" "} */}
                  {/* its used as an identifier for ref in small devices */}
                  {/*
                  we should have an isChildVisible child here,
                  but it's not working as expected
                  */}
                  <SyndicateDetails accountIsManager={accountIsManager}>
                    <div className="w-full md:hidden mt-5">{children}</div>
                  </SyndicateDetails>
                </div>
                {/* Right Column */}
                <div className="md:col-end-13 md:col-span-4 col-span-12 hidden md:block pt-0 h-full">
                  <div className="sticky relative top-33">{children}</div>
                </div>
              </div>
              <div className="mt-14">
                <div
                  ref={subNav}
                  className={`${
                    isSubNavStuck ? "bg-gray-syn8" : "bg-black"
                  } transition-all edge-to-edge-with-left-inset`}
                >
                  <nav className="flex space-x-10" aria-label="Tabs">
                    <button
                      key="members"
                      onClick={() => setActiveTab("assets")}
                      className={`whitespace-nowrap h4 w-fit-content ${
                        isSubNavStuck ? "py-6" : "h-16"
                      } transition-all h-16 border-b-1 focus:outline-none focus:ring-0 font-whyte text-sm cursor-pointer ${
                        activeTab == "assets"
                          ? "border-white text-white"
                          : "border-transparent text-gray-500 hover:text-gray-40"
                      }`}
                    >
                      Assets
                    </button>
                    <button
                      key="members"
                      onClick={() => setActiveTab("members")}
                      className={`whitespace-nowrap h4 ${
                        isSubNavStuck ? "py-6" : "h-16"
                      } transition-all h-16 border-b-1 focus:outline-none focus:ring-0 font-whyte text-sm cursor-pointer ${
                        activeTab == "members"
                          ? "border-white text-white"
                          : "border-transparent text-gray-500 hover:text-gray-400 "
                      }`}
                    >
                      Members
                    </button>
                    {/* add more tabs here */}
                  </nav>
                  <div
                    className={`${
                      isSubNavStuck ? "hidden" : "block"
                    } border-b-1 border-gray-24 absolute w-screen right-0`}
                  ></div>
                </div>

                <div className="text-base grid grid-cols-12 gap-y-5">
                  <div className="col-span-12">
                    {activeTab == "assets" && (
                      <div className="my-10">
                        <TabsButton options={assetsFilterOptions} value="all" />
                      </div>
                    )}
                    {activeTab == "members" && syndicateMembers?.length > 0 && (
                      <ManageMembers />
                    )}
                  </div>
                </div>
              </div>
              <Footer extraClasses="mt-24 sm:mt-24 md:mt-40 mb-12" />
            </div>
          )}
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

export default LayoutWithSyndicateDetails;
