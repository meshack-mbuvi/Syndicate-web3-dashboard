import { ClubERC20Contract } from "@/ClubERC20Factory/clubERC20";
import ErrorBoundary from "@/components/errorBoundary";
import Layout from "@/components/layout";
import OnboardingModal from "@/components/onboarding";
import BackButton from "@/components/socialProfiles/backButton";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import Head from "@/components/syndicates/shared/HeaderTitle";
import SyndicateDetails from "@/components/syndicates/syndicateDetails";
import {
  ERC20TokenDefaultState,
  setERC20Token,
} from "@/helpers/erc20TokenDetails";
import { useFetchMerkleProof } from "@/hooks/useMerkleProof";
import NotFoundPage from "@/pages/404";
import { AppState } from "@/state";
import {
  clearCollectiblesTransactions,
  fetchCollectiblesTransactions,
  fetchTokenTransactions,
} from "@/state/assets/slice";
import { setClubMembers } from "@/state/clubMembers";
import { setERC20TokenDetails } from "@/state/erc20token/slice";
import {
  setLoadingMerkleProof,
  setMerkleProof,
} from "@/state/merkleProofs/slice";
import { Status } from "@/state/wallet/types";
import { getWeiAmount } from "@/utils/conversions";
import { useRouter } from "next/router";
import React, { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { syndicateActionConstants } from "src/components/syndicates/shared/Constants";
import ClubTokenMembers from "../managerActions/clubTokenMembers";
import Assets from "./assets";

const LayoutWithSyndicateDetails: FC = ({ children }) => {
  const {
    initializeContractsReducer: { syndicateContracts },
    merkleProofSliceReducer: { myMerkleProof },
    web3Reducer: {
      web3: { account, web3, status },
    },
    erc20TokenSliceReducer: {
      erc20Token: {
        owner,
        loading,
        name,
        tokenDecimals,
        isOwner,
        depositsEnabled,
        accountClubTokens,
      },
    },
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const dispatch = useDispatch();
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
    if (owner) {
      // fetch token transactions for the connected account.
      dispatch(fetchTokenTransactions(owner));
      // test nft account: 0xf4c2c3e12b61d44e6b228c43987158ac510426fb
      dispatch(
        fetchCollectiblesTransactions({
          account: owner,
          offset: "0",
        }),
      );
    }
  }, [owner, dispatch]);

  useEffect(() => {
    // clear collectibles on account switch
    if (account) {
      dispatch(clearCollectiblesTransactions());
    }
  }, [account, dispatch]);

  // used to render right column components on the left column in small devices

  const { clubAddress } = router.query;

  const {
    loading: transactionsLoading,
    data: merkleProofData = {},
    refetch: refetchMerkleProof,
  } = useFetchMerkleProof(false);

  useEffect(() => {
    if (!clubAddress || !router.isReady) return;
    if (
      router.isReady &&
      web3.utils.isAddress(clubAddress) &&
      syndicateContracts?.SingleTokenMintModule
    ) {
      const clubERC20tokenContract = new ClubERC20Contract(
        clubAddress as string,
        web3,
      );

      dispatch(
        setERC20Token(
          clubERC20tokenContract,
          syndicateContracts.SingleTokenMintModule,
          account,
        ),
      );

      refetchMerkleProof();

      return () => {
        dispatch(setERC20TokenDetails(ERC20TokenDefaultState));
        dispatch(setClubMembers([]));
      };
    }
  }, [
    clubAddress,
    account,
    router.isReady,
    syndicateContracts?.SingleTokenMintModule,
    dispatch,
    refetchMerkleProof,
    web3,
  ]);

  useEffect(() => {
    dispatch(setLoadingMerkleProof(true));
    if (merkleProofData.Financial_getIndexAndProof?.accountIndex) {
      const merkleObj = merkleProofData.Financial_getIndexAndProof;
      dispatch(setLoadingMerkleProof(true));
      dispatch(
        setMerkleProof({
          ...merkleObj,
          account,
          _amount: getWeiAmount(merkleObj?.amount, tokenDecimals, false),
        }),
      );
      dispatch(setLoadingMerkleProof(false));
    }
  }, [
    account,
    transactionsLoading,
    merkleProofData.Financial_getIndexAndProof?.accountIndex,
    merkleProofData.Financial_getIndexAndProof,
    dispatch,
    tokenDecimals,
  ]);

  const showOnboardingIfNeeded = router.pathname.endsWith("deposit");

  // A manager should not access deposit page but should be redirected
  // to syndicates page
  useEffect(() => {
    // We need to have syndicate loaded so that we know whether it's open to
    // deposit or not.
    if (!router.isReady || loading || !clubAddress) return;

    // "" === "" returns true for isOwner which cause URL to flash /manage
    // when on /clubs/[clubAddress]
    const isOwner = account === owner && account != "" && owner != "";

    if (router.pathname.includes("/manage") && !isOwner) {
      router.replace(`/clubs/${clubAddress}`);
    } else if (router.pathname === "/clubs/[clubAddress]" && isOwner) {
      router.replace(`/clubs/${clubAddress}/manage`);
    }
  }, [owner, clubAddress, router, account, loading]);

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
    isOwner || +accountClubTokens || myMerkleProof?.account === account;
  const renderOnDisconnect =
    status !== Status.DISCONNECTED && !(isActive && !isOwnerOrMember);

  useEffect(() => {
    if (!renderOnDisconnect) {
      setActiveTab("assets");
    }
  }, [renderOnDisconnect]);

  return (
    <>
      {router.isReady && !web3.utils.isAddress(clubAddress) ? (
        <NotFoundPage />
      ) : (
        <Layout showNav={showNav}>
          <Head title={name || "Club"} />
          <ErrorBoundary>
            {showOnboardingIfNeeded && <OnboardingModal />}
            <div className="w-full">
              {router.isReady && !name && !loading ? (
                syndicateEmptyState
              ) : (
                <div className="container mx-auto ">
                  {/* Two Columns (Syndicate Details + Widget Cards) */}
                  <BackButton
                    topOffset={isSubNavStuck ? "-0.68rem" : "-0.25rem"}
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
                        } sticky top-0 z-10 transition-all edge-to-edge-with-left-inset`}
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
                          {renderOnDisconnect && (
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
                          {/* add more tabs here */}
                        </nav>
                        <div
                          className={`${
                            isSubNavStuck ? "hidden" : "block"
                          } border-b-1 border-gray-syn6 absolute w-screen right-0`}
                        ></div>
                      </div>

                      <div className="text-base grid grid-cols-12 gap-y-5">
                        <div className="col-span-12">
                          {activeTab == "assets" && <Assets />}
                          {activeTab == "members" && renderOnDisconnect && (
                            <ClubTokenMembers />
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
