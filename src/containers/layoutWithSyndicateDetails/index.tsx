import { ClubERC20Contract } from "@/ClubERC20Factory/clubERC20";
import ErrorBoundary from "@/components/errorBoundary";
import Layout from "@/components/layout";
import OnboardingModal from "@/components/onboarding";
import BackButton from "@/components/socialProfiles/backButton";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import Head from "@/components/syndicates/shared/HeaderTitle";
import SyndicateDetails from "@/components/syndicates/syndicateDetails";
import { setERC20Token } from "@/helpers/erc20TokenDetails";
import { useAccountTokens } from "@/hooks/useAccountTokens";
import { useIsClubOwner } from "@/hooks/useClubOwner";
import useClubTokenMembers from "@/hooks/useClubTokenMembers";
import { useDemoMode } from "@/hooks/useDemoMode";
import useTransactions from "@/hooks/useTransactions";
import NotFoundPage from "@/pages/404";
import { AppState } from "@/state";
import {
  clearCollectiblesTransactions,
  fetchCollectiblesTransactions,
  fetchTokenTransactions,
  setMockCollectiblesResult,
  setMockTokensResult,
} from "@/state/assets/slice";
import { setClubMembers } from "@/state/clubMembers";
import {
  setERC20TokenContract,
  setERC20TokenDetails,
} from "@/state/erc20token/slice";
import { clearMyTransactions } from "@/state/erc20transactions";
import { Status } from "@/state/wallet/types";
import { getTextWidth } from "@/utils/getTextWidth";
import {
  mockActiveERC20Token,
  mockDepositERC20Token,
  mockDepositModeTokens,
  mockTokensResult,
} from "@/utils/mockdata";
import window from "global";
import { useRouter } from "next/router";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { syndicateActionConstants } from "src/components/syndicates/shared/Constants";
import ClubTokenMembers from "../managerActions/clubTokenMembers";
import ActivityView from "./activity";
import Assets from "./assets";
import TabButton from "./TabButton";

const LayoutWithSyndicateDetails: FC = ({ children }) => {
  const {
    initializeContractsReducer: { syndicateContracts },
    merkleProofSliceReducer: { myMerkleProof },
    web3Reducer: {
      web3: { account, web3, status },
    },
    erc20TokenSliceReducer: {
      erc20Token: { owner, loading, name, depositsEnabled },
    },
  } = useSelector((state: AppState) => state);

  // Get clubAddress from window.location object since during page load, router is not ready
  // hence clubAddress is undefined.
  // We need to have access to clubAddress as early as possible.
  const clubAddress = window?.location?.pathname.split("/")[2];

  const isDemoMode = useDemoMode(clubAddress);
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  useEffect(() => {
    // Demo mode
    if (clubAddress === zeroAddress) {
      router.push("/clubs/demo/manage");
    }
  });

  //  tokens for the connected wallet account
  const { accountTokens } = useAccountTokens();

  // fetch club transactions
  useTransactions();

  // fetch club members
  useClubTokenMembers();

  useEffect(() => {
    return () => {
      // clear transactions when component unmounts
      // solves an issue with previous transactions being loaded
      // when a switch is made to another club with a different owner.
      dispatch(clearMyTransactions());
    };
  }, []);

  const isOwner = useIsClubOwner();

  const router = useRouter();
  const dispatch = useDispatch();
  const [scrollTop, setScrollTop] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [isSubNavStuck, setIsSubNavStuck] = useState(true);
  // const [customTransform, setCustomTransform] = useState(undefined);
  const subNav = useRef(null);
  const {
    query: { status: isOpenForDeposits },
  } = router;

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
    if (
      subNav.current &&
      parseInt(subNav.current.getBoundingClientRect().top) <= 0
    ) {
      setIsSubNavStuck(true);
      setShowNav(false);
    } else {
      setIsSubNavStuck(false);
      setShowNav(true);
    }
  }, [scrollTop]);

  const fetchAssets = () => {
    // fetch token transactions for the connected account.
    dispatch(fetchTokenTransactions(owner));
    // test nft account: 0xf4c2c3e12b61d44e6b228c43987158ac510426fb
    dispatch(
      fetchCollectiblesTransactions({
        account: owner,
        offset: "0",
      }),
    );
  };

  useEffect(() => {
    if (owner) {
      fetchAssets();
    } else if (isDemoMode) {
      const mockTokens = depositsEnabled
        ? mockDepositModeTokens
        : mockTokensResult;
      dispatch(setMockTokensResult(mockTokens));

      dispatch(setMockCollectiblesResult(depositsEnabled));
    }
  }, [owner, clubAddress, depositsEnabled]);

  useEffect(() => {
    // clear collectibles on account switch
    if (account && !isDemoMode) {
      dispatch(clearCollectiblesTransactions());
    }
  }, [account, clubAddress, dispatch, isDemoMode]);

  /**
   * Fetch club details
   */
  useEffect(() => {
    if (!clubAddress || status == Status.CONNECTING) return;

    if (
      clubAddress !== zeroAddress &&
      web3.utils.isAddress(clubAddress) &&
      syndicateContracts?.DepositTokenMintModule
    ) {
      const clubERC20tokenContract = new ClubERC20Contract(
        clubAddress as string,
        web3,
      );

      dispatch(setERC20TokenContract(clubERC20tokenContract));

      dispatch(
        setERC20Token(
          clubERC20tokenContract,
          syndicateContracts?.DepositTokenMintModule,
        ),
      );

      return () => {
        dispatch(setClubMembers([]));
      };
    } else if (isDemoMode) {
      // using "Open to deposits" as the default view here in all cases.
      dispatch(setERC20TokenDetails(mockDepositERC20Token));
    }
  }, [
    clubAddress,
    account,
    status,
    syndicateContracts?.DepositTokenMintModule,
  ]);

  const showOnboardingIfNeeded =
    router.pathname.endsWith("[clubAddress]") && !isDemoMode;

  const transform = useMemo(
    () => (getTextWidth(name) > 590 ? "translateY(0%)" : "translateY(-50%)"),
    [name],
  );

  // get static text from constants
  const { noTokenTitleText } = syndicateActionConstants;

  // set texts to display on empty state
  // we'll initialize this to instances where address is not a syndicate.
  // if the address is invalid, this texts will be updated accordingly.

  // set syndicate empty state.
  // component will be rendered if the address is not a syndicate
  const syndicateEmptyState = (
    <div className="flex justify-center items-center h-full w-full mt-6 sm:mt-10">
      <div className="flex flex-col items-center justify-center sm:w-7/12 md:w-5/12 rounded-custom p-10">
        <div className="w-full flex justify-center mb-6">
          <img
            className="inline w-12"
            src="/images/syndicateStatusIcons/warning-triangle-gray.svg"
            alt="Warning"
          />
        </div>
        <p className="text-lg md:text-2xl text-center mb-3">
          {noTokenTitleText}
        </p>
        <EtherscanLink etherscanInfo={clubAddress} />
      </div>
    </div>
  );

  const [activeTab, setActiveTab] = useState("assets");

  const isActive = !depositsEnabled;
  const isOwnerOrMember =
    isOwner || +accountTokens || myMerkleProof?.account === account;
  const renderOnDisconnect =
    status !== Status.DISCONNECTED && !(isActive && !isOwnerOrMember);

  useEffect(() => {
    if (!renderOnDisconnect) {
      setActiveTab("assets");
    }
  }, [renderOnDisconnect]);

  return (
    <>
      {router.isReady && !isDemoMode && !web3.utils.isAddress(clubAddress) ? (
        <NotFoundPage />
      ) : (
        <Layout showNav={showNav} showBackButton={true}>
          <Head title={name || "Club"} />
          <ErrorBoundary>
            {showOnboardingIfNeeded && <OnboardingModal />}
            <div className="w-full">
              {router.isReady && !name && !loading && !isDemoMode ? (
                syndicateEmptyState
              ) : (
                <div className="container mx-auto ">
                  {/* Two Columns (Syndicate Details + Widget Cards) */}
                  <BackButton
                    topOffset={isSubNavStuck ? "-0.68rem" : "-0.25rem"}
                    transform={transform}
                    isHidden={isDemoMode}
                  />
                  <div className="grid grid-cols-12 gap-5">
                    {/* Left Column */}
                    <div className="md:col-start-1 md:col-end-7 col-span-12">
                      {/* its used as an identifier for ref in small devices */}
                      {/*
                  we should have an isChildVisible child here,
                  but it's not working as expected
                  */}
                      <SyndicateDetails accountIsManager={isOwner}>
                        <div className="w-full md:hidden mt-5">{children}</div>
                      </SyndicateDetails>
                    </div>
                    {/* Right Column */}
                    <div className="md:col-end-13 md:col-span-5 col-span-12 hidden md:flex justify-end items-start pt-0 h-full">
                      <div className="sticky top-33 w-100">{children}</div>
                    </div>

                    <div className="mt-16 col-span-12">
                      <div
                        ref={subNav}
                        className={`${
                          isSubNavStuck ? "bg-gray-syn8" : "bg-black"
                        } sticky top-0 z-15 transition-all edge-to-edge-with-left-inset`}
                      >
                        <nav className="flex space-x-10" aria-label="Tabs">
                          <button
                            key="assets"
                            onClick={() => setActiveTab("assets")}
                            className={`whitespace-nowrap h4 w-fit-content py-6 transition-all border-b-1 focus:ring-0 font-whyte text-sm cursor-pointer ${
                              activeTab == "assets"
                                ? "border-white text-white"
                                : "border-transparent text-gray-syn4 hover:text-gray-40"
                            }`}
                          >
                            Assets
                          </button>
                          {(renderOnDisconnect || isDemoMode) && (
                            <button
                              key="members"
                              onClick={() => setActiveTab("members")}
                              className={`whitespace-nowrap h4 py-6 transition-all border-b-1 focus:ring-0 font-whyte text-sm cursor-pointer ${
                                activeTab == "members"
                                  ? "border-white text-white"
                                  : "border-transparent text-gray-syn4 hover:text-gray-400 "
                              }`}
                            >
                              Members
                            </button>
                          )}
                          {(renderOnDisconnect || isDemoMode) && (
                            <TabButton
                              active={activeTab === "activity"}
                              label="Activity"
                              onClick={() => setActiveTab("activity")}
                            />
                          )}
                        </nav>
                        <div
                          className={`${
                            isSubNavStuck ? "hidden" : "block"
                          } border-b-1 border-gray-syn7 absolute w-screen right-0`}
                        ></div>
                      </div>

                      <div className="text-base grid grid-cols-12 gap-y-5">
                        <div className="col-span-12">
                          {activeTab == "assets" && <Assets />}
                          {activeTab == "members" &&
                            (renderOnDisconnect || isDemoMode) && (
                              <ClubTokenMembers />
                            )}
                          {activeTab == "activity" &&
                            (renderOnDisconnect || isDemoMode) && (
                              <ActivityView />
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ErrorBoundary>
        </Layout>
      )}
    </>
  );
};

export default LayoutWithSyndicateDetails;
