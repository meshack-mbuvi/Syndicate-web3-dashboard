import { ClubERC20Contract } from "@/ClubERC20Factory/clubERC20";
import { amplitudeLogger, Flow } from "@/components/amplitude";
import { CLICK_CREATE_A_SYNDICATE } from "@/components/amplitude/eventNames";
import ErrorBoundary from "@/components/errorBoundary";
import Layout from "@/components/layout";
import Footer from "@/components/navigation/footer";
import OnboardingModal from "@/components/onboarding";
import BackButton from "@/components/socialProfiles/backButton";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import Head from "@/components/syndicates/shared/HeaderTitle";
import SyndicateDetails from "@/components/syndicates/syndicateDetails";
import { setERC20Token } from "@/helpers/erc20TokenDetails";
import { RootState } from "@/redux/store";
import { showWalletModal } from "@/state/wallet/actions";
import { formatAddress } from "@/utils/formatAddress";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import React, { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { syndicateActionConstants } from "src/components/syndicates/shared/Constants";
import ClubTokenMembers from "../managerActions/clubTokenMembers";
import Assets from "./assets";
import {
  fetchTokenTransactions,
  fetchCollectiblesTransactions,
} from "@/state/assets/slice";

const LayoutWithSyndicateDetails: FC = ({ children }) => {
  // Retrieve state
  const {
    syndicatesReducer: { syndicate, syndicateAddressIsValid },
    web3Reducer: {
      web3: { account, web3 },
    },
    manageMembersDetailsReducer: {
      syndicateManageMembers: { syndicateMembers },
    },
    erc20TokenSliceReducer: { erc20Token },
  } = useSelector((state: RootState) => state);

  const [scrollTop, setScrollTop] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [isSubNavStuck, setIsSubNavStuck] = useState(true);
  const subNav = useRef(null);

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

  useEffect(() => {
    // fetch token transactions for the connected account.
    dispatch(fetchTokenTransactions(account));

    // test nft account: 0xf4c2c3e12b61d44e6b228c43987158ac510426fb
    dispatch(fetchCollectiblesTransactions(account));
  }, [account]);

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

  const [clubERC20tokenContract, setClubERC20tokenContract] = useState(null);

  useEffect(() => {
    if (router.isReady && web3.utils.isAddress(syndicateAddress)) {
      const clubERC20tokenContract = new ClubERC20Contract(
        syndicateAddress as string,
        web3,
      );
      setClubERC20tokenContract(clubERC20tokenContract);
    }
    return () => {
      setClubERC20tokenContract(null);
    };
  }, [syndicateAddress, router.isReady, web3]);

  useEffect(() => {
    if (clubERC20tokenContract && account && router.isReady) {
      dispatch(setERC20Token(clubERC20tokenContract, account));
    }
  }, [clubERC20tokenContract, account, router.isReady]);

  // format an account address in the format 0x3f6q9z52…54h2kjh51h5zfa
  const formattedSyndicateAddress3XLarge = formatAddress(
    erc20Token?.address,
    18,
    18,
  );
  const formattedSyndicateAddressXLarge = formatAddress(
    erc20Token?.address,
    10,
    10,
  );
  const formattedSyndicateAddressLarge = formatAddress(
    erc20Token?.address,
    8,
    8,
  );
  const formattedSyndicateAddressMedium = formatAddress(
    erc20Token?.address,
    6,
    4,
  );
  const formattedSyndicateAddressSmall = formatAddress(
    erc20Token?.address,
    10,
    14,
  );
  const formattedSyndicateAddressMobile = formatAddress(
    erc20Token?.address,
    5,
    8,
  );

  const [accountIsManager, setAccountIsManager] = useState<boolean>(false);
  const showOnboardingIfNeeded = router.pathname.endsWith("deposit");

  let noToken;
  // A manager should not access deposit page but should be redirected
  // to syndicates page
  useEffect(() => {
    // We need to have syndicate loaded so that we know whether it's open to
    // deposit or not.
    if (!router.isReady || !syndicate) return;

    if (
      !isEmpty(erc20Token) &&
      syndicateAddress !== undefined &&
      account !== undefined &&
      web3.utils.isAddress(erc20Token?.address)
    ) {
      switch (router.pathname) {
        case "/syndicates/[syndicateAddress]/manage":
          // For a closed syndicate, user should be navigated to withdrawal page
          if (!erc20Token?.isOwner) {
            if (erc20Token?.depositsEnabled) {
              router.replace(`/syndicates/${erc20Token?.address}/deposit`);
            } else {
              router.replace(`/syndicates/${erc20Token?.address}/withdraw`);
            }
          }

          break;

        case "/syndicates/[syndicateAddress]/deposit":
          if (erc20Token?.isOwner) {
            router.replace(`/syndicates/${erc20Token?.address}/manage`);
          }
          break;
        case "/syndicates/[syndicateAddress]/withdraw":
          if (erc20Token?.isOwner) {
            router.replace(`/syndicates/${erc20Token?.address}/manage`);
          } else if (erc20Token?.depositsEnabled) {
            router.replace(`/syndicates/${erc20Token?.address}/deposit`);
          }
          break;
        // case when address lacks action
        case "/syndicates/[syndicateAddress]/":
          if (erc20Token?.isOwner) {
            router.replace(`/syndicates/${erc20Token?.address}/manage`);
          } else if (erc20Token?.depositsEnabled) {
            router.replace(`/syndicates/${erc20Token?.address}/deposit`);
          }
          break;
        default:
          if (syndicateAddress && syndicate) {
            if (erc20Token?.isOwner) {
              router.replace(`/syndicates/${erc20Token?.address}/manage`);
            } else if (erc20Token?.depositsEnabled) {
              router.replace(`/syndicates/${erc20Token?.address}/deposit`);
            } else if (syndicate.distributing) {
              router.replace(`/syndicates/${erc20Token?.address}/withdraw`);
            } else if (!erc20Token?.isOwner && !erc20Token?.depositsEnabled) {
              router.replace(`/syndicates/${erc20Token?.address}/details`);
            }
          }
          break;
      }
    }
  }, [account, router.isReady, syndicate, JSON.stringify(syndicateMembers)]);

  // check whether the current connected wallet account is the manager of the syndicate
  // we'll use this information to load the manager view
  useEffect(() => {
    if (erc20Token?.isOwner) {
      setAccountIsManager(true);
    } else {
      setAccountIsManager(false);
    }
  }, [erc20Token?.isOwner, account]);

  // get static text from constants
  const {
    noTokenTitleText,
    noTokenMessageText,
    syndicateAddressInvalidMessageText,
    syndicateAddressInvalidTitleText,
    notSyndicateYetTitleText,
    notSyndicateYetMessageText,
    notSyndicateForManagerYetMessageText,
  } = syndicateActionConstants;

  // set texts to display on empty state
  // we'll initialize this to instances where address is not a syndicate.
  // if the address is invalid, this texts will be updated accordingly.
  let emptyStateTitle = noTokenTitleText;
  let emptyStateMessage = noTokenMessageText;
  if (!syndicateAddressIsValid) {
    emptyStateTitle = syndicateAddressInvalidTitleText;
    emptyStateMessage = syndicateAddressInvalidMessageText;
  }

  if (
    syndicateAddressIsValid &&
    !erc20Token.name &&
    !erc20Token?.loading &&
    account !== syndicateAddress
  ) {
    emptyStateTitle = notSyndicateYetTitleText;
    emptyStateMessage = notSyndicateYetMessageText;
  }

  if (
    syndicateAddressIsValid &&
    !erc20Token?.name &&
    !erc20Token?.loading &&
    erc20Token?.isOwner
  ) {
    emptyStateTitle = notSyndicateYetTitleText;
    emptyStateMessage = notSyndicateForManagerYetMessageText;
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
          <EtherscanLink etherscanInfo={erc20Token?.address} />
        )}
      </div>
    </div>
  );

  const syndicateNotFoundState = (
    <div className="flex justify-center items-center h-full w-full mt-6 sm:mt-10">
      <div className="flex flex-col items-center justify-center sm:w-7/12 md:w-5/12 rounded-custom p-10">
        <p className="font-semibold text-2xl text-center">
          {formatAddress(erc20Token?.address, 9, 6)} {emptyStateTitle}
        </p>
        <p className="text-base my-5 font-normal text-gray-dim text-center">
          {emptyStateMessage}
        </p>
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
      </div>
    </div>
  );

  if ((!erc20Token?.name && !erc20Token?.loading) || !syndicateAddressIsValid) {
    noToken = syndicateEmptyState;
  }

  if (!erc20Token?.name && !erc20Token?.loading && syndicateAddressIsValid) {
    noToken = syndicateNotFoundState;
    // noToken = creatingSyndicate
  }

  if (!erc20Token?.name && erc20Token?.loading && syndicateAddressIsValid) {
    noToken = creatingSyndicate;
  }

  const [activeTab, setActiveTab] = useState("assets");

  return (
    <Layout showNav={showNav}>
      <Head title="Syndicate" />
      <ErrorBoundary>
        {showOnboardingIfNeeded && <OnboardingModal />}
        <div className="w-full">
          {noToken ? (
            noToken
          ) : (
            <div className="container mx-auto ">
              {/* Two Columns (Syndicate Details + Widget Cards) */}
              <BackButton />
              <div className="grid grid-cols-12 gap-5">
                {/* Left Column */}
                <div className="md:col-start-1 md:col-end-7 col-span-12">
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
                <div className="md:col-end-13 md:col-span-5 col-span-12 hidden md:block pt-0 h-full">
                  <div className="sticky top-33 w-100">{children}</div>
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
                      } transition-all h-16 border-b-1 focus:ring-0 font-whyte text-sm cursor-pointer ${
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
                      } transition-all h-16 border-b-1 focus:ring-0 font-whyte text-sm cursor-pointer ${
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
                    {activeTab == "assets" && <Assets />}
                    {activeTab == "members" && <ClubTokenMembers />}
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
