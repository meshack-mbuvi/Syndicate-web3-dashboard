import { ClubERC20Contract } from "@/ClubERC20Factory/clubERC20";
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
import {
  fetchCollectiblesTransactions,
  fetchTokenTransactions,
} from "@/state/assets/slice";
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

const LayoutWithSyndicateDetails: FC = ({ children }) => {
  // Retrieve state
  const {
    web3Reducer: {
      web3: { account, web3 },
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
    dispatch(fetchTokenTransactions(erc20Token.owner));

    // test nft account: 0xf4c2c3e12b61d44e6b228c43987158ac510426fb
    dispatch(fetchCollectiblesTransactions(erc20Token.owner));
  }, [erc20Token]);

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

  const showOnboardingIfNeeded = router.pathname.endsWith("deposit");

  let noToken;
  // A manager should not access deposit page but should be redirected
  // to syndicates page
  useEffect(() => {
    // We need to have syndicate loaded so that we know whether it's open to
    // deposit or not.
    if (!router.isReady || !erc20Token) return;

    if (
      !isEmpty(erc20Token) &&
      erc20Token.name &&
      syndicateAddress !== undefined &&
      account !== undefined &&
      router.isReady
    ) {
      switch (router.pathname) {
        case "/syndicates/[syndicateAddress]/manage":
          if (!erc20Token?.isOwner) {
            router.replace(`/syndicates/${syndicateAddress}/deposit`);
          }

          break;

        case "/syndicates/[syndicateAddress]/deposit":
          if (erc20Token?.isOwner) {
            router.replace(`/syndicates/${syndicateAddress}/manage`);
          }
          break;

        // case when address lacks action
        case "/syndicates/[syndicateAddress]/":
          if (erc20Token?.isOwner) {
            router.replace(`/syndicates/${syndicateAddress}/manage`);
          } else if (erc20Token?.depositsEnabled) {
            router.replace(`/syndicates/${syndicateAddress}/deposit`);
          }
          break;
        default:
          if (syndicateAddress && erc20Token?.name) {
            if (erc20Token?.isOwner) {
              router.replace(`/syndicates/${syndicateAddress}/manage`);
            } else if (erc20Token?.depositsEnabled) {
              router.replace(`/syndicates/${syndicateAddress}/deposit`);
            }
          }
          break;
      }
    }
  }, [account, router.isReady, JSON.stringify(erc20Token)]);

  // get static text from constants
  const {
    noTokenTitleText,
    noTokenMessageText,
    notSyndicateYetTitleText,
    notSyndicateYetMessageText,
    notSyndicateForManagerYetMessageText,
  } = syndicateActionConstants;

  // set texts to display on empty state
  // we'll initialize this to instances where address is not a syndicate.
  // if the address is invalid, this texts will be updated accordingly.
  let emptyStateTitle = noTokenTitleText;
  let emptyStateMessage = noTokenMessageText;

  if (
    !erc20Token.name &&
    !erc20Token?.loading &&
    account !== syndicateAddress
  ) {
    emptyStateTitle = notSyndicateYetTitleText;
    emptyStateMessage = notSyndicateYetMessageText;
  }

  if (!erc20Token?.name && !erc20Token?.loading && erc20Token?.isOwner) {
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
        <EtherscanLink etherscanInfo={syndicateAddress} />
      </div>
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
      </div>
    </div>
  );

  if (!erc20Token?.name && !erc20Token?.loading) {
    noToken = syndicateEmptyState;
  }

  if (!erc20Token?.name && !erc20Token?.loading) {
    noToken = syndicateNotFoundState;
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
                  <SyndicateDetails accountIsManager={erc20Token?.isOwner}>
                    <div className="w-full md:hidden mt-5">{children}</div>
                  </SyndicateDetails>
                </div>
                {/* Right Column */}
                <div className="md:col-end-13 md:col-span-5 col-span-12 hidden md:flex justify-end items-start pt-0 h-full">
                  <div className="sticky top-33 w-100">{children}</div>
                </div>
              </div>

              <div className="mt-16">
                <div
                  ref={subNav}
                  className={`${
                    isSubNavStuck ? "bg-gray-syn8" : "bg-black"
                  } transition-all edge-to-edge-with-left-inset`}
                >
                  <nav className="flex space-x-10 h-20" aria-label="Tabs">
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
