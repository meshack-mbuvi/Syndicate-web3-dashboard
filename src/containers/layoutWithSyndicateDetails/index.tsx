import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import BackButton from '@/components/buttons/BackButton';
import ErrorBoundary from '@/components/errorBoundary';
import Layout from '@/components/layout';
import OnboardingModal from '@/components/onboarding';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { ClubHeader } from '@/components/syndicates/shared/clubHeader';
import Head from '@/components/syndicates/shared/HeaderTitle';
import SyndicateDetails from '@/components/syndicates/syndicateDetails';
import { useConnectWalletContext } from '@/context/ConnectWalletProvider';
import { CLUB_TOKEN_QUERY } from '@/graphql/queries';
import {
  getDepositDetails,
  resetClubState,
  setERC20Token
} from '@/helpers/erc20TokenDetails';
import { useAccountTokens } from '@/hooks/useAccountTokens';
import { useClubDepositsAndSupply } from '@/hooks/useClubDepositsAndSupply';
import { useIsClubOwner } from '@/hooks/useClubOwner';
import useClubTokenMembers from '@/hooks/useClubTokenMembers';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useGetDepositTokenPrice } from '@/hooks/useGetDepositTokenPrice';
import useTransactions from '@/hooks/useTransactions';
import { useGetNetwork } from '@/hooks/web3/useGetNetwork';
import { useProvider } from '@/hooks/web3/useProvider';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import {
  clearCollectiblesTransactions,
  fetchCollectiblesTransactions,
  fetchTokenTransactions,
  setMockCollectiblesResult,
  setMockTokensResult
} from '@/state/assets/slice';
import { setClubMembers } from '@/state/clubMembers';
import {
  setDepositTokenUSDPrice,
  setERC20TokenContract,
  setERC20TokenDepositDetails
} from '@/state/erc20token/slice';
import { clearMyTransactions } from '@/state/erc20transactions';
import { Status } from '@/state/wallet/types';
import { getTextWidth } from '@/utils/getTextWidth';
import {
  mockActiveERC20Token,
  mockDepositERC20Token,
  mockDepositModeTokens,
  mockTokensResult
} from '@/utils/mockdata';
import { NetworkStatus, useQuery } from '@apollo/client';
import window from 'global';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { syndicateActionConstants } from 'src/components/syndicates/shared/Constants';
import ClubTokenMembers from '../managerActions/clubTokenMembers/index';
import ActivityView from './activity';
import Assets from './assets';
import TabButton from './TabButton';

const LayoutWithSyndicateDetails: FC<{
  managerSettingsOpen: boolean;
}> = ({ managerSettingsOpen, children }) => {
  const {
    initializeContractsReducer: {
      syndicateContracts: { SingleTokenMintModule, DepositTokenMintModule }
    },
    merkleProofSliceReducer: { myMerkleProof },
    web3Reducer: {
      web3: { account, web3, status, activeNetwork }
    },
    erc20TokenSliceReducer: {
      erc20TokenContract,
      erc20Token,
      depositDetails: { nativeDepositToken },
      activeModuleDetails,
      depositTokenPriceInUSD
    },
    assetsSliceReducer: { collectiblesResult }
  } = useSelector((state: AppState) => state);

  const {
    isValid,
    owner,
    loading,
    name,
    depositsEnabled,
    maxTotalDeposits,
    symbol,
    memberCount
  } = erc20Token;

  // Prevents incorrect data display when page data has not been loaded yet.
  const [pageLoading, setPageLoading] = useState(true);

  // Get clubAddress from window.location object since during page load, router is not ready
  // hence clubAddress is undefined.
  // We need to have access to clubAddress as early as possible.
  const clubAddress = window?.location?.pathname.split('/')[2];

  const isDemoMode = useDemoMode(clubAddress);
  // dispatch the price of the deposit token for use in other
  // components
  useGetDepositTokenPrice(activeNetwork.chainId);
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  useEffect(() => {
    // Demo mode
    if (clubAddress === zeroAddress) {
      router.push('/clubs/demo/manage');
    }
  });

  useEffect(() => {
    if (isEmpty(web3)) return;

    setPageLoading(false);

    return () => {
      setPageLoading(true);
    };
  }, [web3]);

  //  tokens for the connected wallet account
  const { accountTokens } = useAccountTokens();

  const {
    loadingClubDeposits,
    totalDeposits,
    refetch: refetchSingleClubDetails
  } = useClubDepositsAndSupply(clubAddress);

  // fetch club transactions
  useTransactions();

  // fetch club members
  useClubTokenMembers();

  const router = useRouter();
  const dispatch = useDispatch();

  const { switchNetworks } = useConnectWalletContext();
  const { providerName } = useProvider();
  const [urlNetwork, setUrlNetwork] = useState<any>(null);

  const { chain } = router.query;

  useEffect(() => {
    if (chain) {
      GetNetworkByName(chain);
    }
  }, [chain]);

  const GetNetworkByName = (name) => {
    const network = useGetNetwork(name);
    setUrlNetwork(network);
  };

  const {
    loading: queryLoading,
    data,
    networkStatus,
    stopPolling
  } = useQuery(CLUB_TOKEN_QUERY, {
    variables: {
      syndicateDaoId: clubAddress?.toLocaleLowerCase()
    },
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId },
    notifyOnNetworkStatusChange: true,
    skip: !clubAddress || loading || !activeNetwork.chainId,
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    return () => {
      // clear transactions when component unmounts
      // solves an issue with previous transactions being loaded
      // when a switch is made to another club with a different owner.
      dispatch(clearMyTransactions());
      dispatch(clearCollectiblesTransactions());

      // also clearing token details when switching between clubs
      dispatch(setDepositTokenUSDPrice(0));
      resetClubState(dispatch);
      dispatch(
        setERC20TokenDepositDetails({
          mintModule: '',
          nativeDepositToken: false,
          depositToken: '',
          depositTokenSymbol: '',
          depositTokenLogo: '/images/usdcIcon.svg',
          depositTokenName: '',
          depositTokenDecimals: 6,
          loading: true
        })
      );
    };
  }, [dispatch]);

  const isOwner = useIsClubOwner();
  const [scrollTop, setScrollTop] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [isSubNavStuck, setIsSubNavStuck] = useState(true);
  // const [customTransform, setCustomTransform] = useState(undefined);
  const subNav = useRef(null);

  // Listen to page scrolling
  useEffect(() => {
    const onScroll = (e) => {
      setScrollTop(e.target.documentElement.scrollTop);
    };
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
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
    dispatch(
      fetchTokenTransactions({
        account: owner,
        activeNetwork: activeNetwork,
        web3: web3
      })
    );
    // test nft account: 0xf4c2c3e12b61d44e6b228c43987158ac510426fb
    dispatch(
      fetchCollectiblesTransactions({
        account: owner,
        offset: '0',
        chainId: activeNetwork.chainId,
        maxTotalDeposits: nativeDepositToken
          ? parseInt((depositTokenPriceInUSD * maxTotalDeposits).toString())
          : maxTotalDeposits
      })
    );
  };

  useEffect(() => {
    if (
      owner &&
      depositTokenPriceInUSD &&
      !loadingClubDeposits &&
      !isDemoMode
    ) {
      fetchAssets();
    }
  }, [
    owner,
    clubAddress,
    depositsEnabled,
    maxTotalDeposits,
    depositTokenPriceInUSD,
    loadingClubDeposits,
    nativeDepositToken
  ]);

  useEffect(() => {
    if (isDemoMode) {
      const mockTokens = depositsEnabled
        ? mockDepositModeTokens
        : mockTokensResult;
      dispatch(setMockTokensResult(mockTokens));

      dispatch(setMockCollectiblesResult(depositsEnabled));
    }
  }, [isDemoMode, collectiblesResult.length]);

  useEffect(() => {
    // clear collectibles on account switch
    if (account && !isDemoMode) {
      dispatch(clearCollectiblesTransactions());
    }
  }, [account, clubAddress, dispatch, isDemoMode, maxTotalDeposits]);

  useEffect(() => {
    // check for demo mode to make sure correct things render
    if (!isDemoMode) {
      // check for network status as ready after query is over
      if (networkStatus !== NetworkStatus.ready) {
        return;
      }
      // check for query loading and data being non-null
      if (!data?.syndicateDAO && !queryLoading) {
        return;
      }
      stopPolling();
      // fallback for if single club details query doesn't initially work
      if (!totalDeposits) {
        refetchSingleClubDetails();
        return;
      }
    } else {
      if (!data) {
        return;
      }
    }

    const { depositToken } = data.syndicateDAO || {};
    async function fetchDepositDetails() {
      let depositDetails;

      if (isDemoMode) {
        depositDetails = mockDepositERC20Token;
      } else {
        depositDetails = await getDepositDetails(
          depositToken,
          erc20TokenContract,
          DepositTokenMintModule,
          SingleTokenMintModule,
          activeModuleDetails?.mintModule,
          activeNetwork
        );
      }

      dispatch(
        setERC20TokenDepositDetails({
          ...depositDetails,
          loading: false
        })
      );
    }
    fetchDepositDetails();
  }, [
    data,
    data?.syndicateDAO,
    loading,
    router.isReady,
    queryLoading,
    networkStatus,
    totalDeposits
  ]);

  /**
   * Fetch club details
   */
  useEffect(() => {
    if (
      !clubAddress ||
      status == Status.CONNECTING ||
      isEmpty(web3) ||
      pageLoading
    )
      return;

    if (
      clubAddress !== zeroAddress &&
      web3.utils.isAddress(clubAddress) &&
      DepositTokenMintModule
    ) {
      //assumes that ERC20ClubFactory uses same ClubERC20 contract
      const clubERC20tokenContract = new ClubERC20Contract(
        clubAddress as string,
        web3,
        activeNetwork
      );

      dispatch(setERC20TokenContract(clubERC20tokenContract));

      dispatch(setERC20Token(clubERC20tokenContract));

      return () => {
        dispatch(setClubMembers([]));
      };
    } else if (isDemoMode) {
      // using "Active" as the default view.
      resetClubState(dispatch, mockActiveERC20Token);
    }
  }, [
    web3?._provider,
    clubAddress,
    account,
    nativeDepositToken,
    status,
    activeNetwork.chainId,
    activeModuleDetails?.hasActiveModules,
    pageLoading
  ]);

  const showOnboardingIfNeeded =
    router.pathname.endsWith('[clubAddress]') && !isDemoMode;

  const transform = useMemo(
    () => (getTextWidth(name) > 590 ? 'translateY(0%)' : 'translateY(-50%)'),
    [name]
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
        <BlockExplorerLink resourceId={clubAddress} />
        {urlNetwork?.chainId &&
        urlNetwork?.chainId !== activeNetwork?.chainId ? (
          <div
            className={`mt-5 flex justify-center flex-col w-full rounded-1.5lg p-6 bg-${urlNetwork.metadata.colors.background} bg-opacity-15`}
          >
            <div className="text-lg text-center mb-3">
              This club exists on {urlNetwork.name}
            </div>
            <div className="flex justify-center mb-3">
              <img width={40} height={40} src={urlNetwork.logo} alt="" />
            </div>
            {providerName === 'WalletConnect' ? (
              <div className="text-sm text-center text-gray-syn3">
                You&#39;re using WalletConnect. To switch networks, you&#39;ll
                need to do so directly in your wallet.
              </div>
            ) : (
              <button
                className="primary-CTA"
                onClick={() => {
                  switchNetworks(urlNetwork.chainId);
                }}
              >
                Switch to {urlNetwork.name}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );

  const [activeTab, setActiveTab] = useState('assets');

  const isActive = !depositsEnabled;
  const isOwnerOrMember =
    isOwner || +accountTokens || myMerkleProof?.account === account;
  const renderOnDisconnect =
    status !== Status.DISCONNECTED && !(isActive && !isOwnerOrMember);

  useEffect(() => {
    if (!renderOnDisconnect) {
      setActiveTab('assets');
    }
  }, [renderOnDisconnect]);

  return (
    <>
      {!pageLoading &&
      router.isReady &&
      !isDemoMode &&
      !isEmpty(web3) &&
      !web3?.utils?.isAddress(clubAddress) ? (
        <NotFoundPage />
      ) : (
        <Layout
          managerSettingsOpen={managerSettingsOpen}
          showNav={showNav}
          showBackButton={true}
        >
          <Head title={name || 'Club'} />
          <ErrorBoundary>
            {showOnboardingIfNeeded && <OnboardingModal />}
            <div className="w-full">
              {!pageLoading &&
              router.isReady &&
              !isValid &&
              !loading &&
              !isDemoMode ? (
                syndicateEmptyState
              ) : (
                <div className="container mx-auto">
                  {/* Two Columns (Syndicate Details + Widget Cards) */}
                  {!managerSettingsOpen && (
                    <BackButton
                      /* topOffset={isSubNavStuck ? "-0.68rem" : "-0.25rem"} */
                      transform={transform}
                      isHidden={isDemoMode}
                    />
                  )}
                  <div className="grid grid-cols-12 gap-5">
                    {/* Left Column */}
                    <div
                      className={`col-start-1 col-end-12 ${
                        managerSettingsOpen ? 'md:col-end-8' : 'md:col-end-7'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between col-end-6 flex-wrap md:col-start-1 ${
                          managerSettingsOpen ? 'md:col-end-8' : 'md:col-end-7'
                        }`}
                      >
                        {/* Club header */}
                        {!managerSettingsOpen && (
                          <ClubHeader
                            {...{
                              loading,
                              name,
                              symbol,
                              owner,
                              loadingClubDeposits,
                              totalDeposits,
                              managerSettingsOpen,
                              clubAddress
                            }}
                          />
                        )}
                      </div>

                      <SyndicateDetails
                        managerSettingsOpen={managerSettingsOpen}
                      >
                        <div className="w-full md:hidden mt-5">{children}</div>
                      </SyndicateDetails>
                    </div>
                    {/* Right Column */}
                    <div className="md:col-end-13 md:col-span-5 col-span-12 hidden md:flex justify-end items-start pt-0 h-full">
                      <div className="sticky top-33 w-100">{children}</div>
                    </div>

                    {!managerSettingsOpen ? (
                      <div className="mt-16 col-span-12">
                        <div
                          ref={subNav}
                          className={`${
                            isSubNavStuck ? 'bg-gray-syn8' : 'bg-black'
                          } sticky top-0 z-15 transition-all edge-to-edge-with-left-inset`}
                        >
                          <nav className="flex space-x-10" aria-label="Tabs">
                            <button
                              key="assets"
                              onClick={() => setActiveTab('assets')}
                              className={`whitespace-nowrap h4 w-fit-content py-6 transition-all border-b-1 focus:ring-0 cursor-pointer ${
                                activeTab == 'assets'
                                  ? 'border-white text-white'
                                  : 'border-transparent text-gray-syn4 hover:text-gray-40'
                              }`}
                            >
                              Assets
                            </button>
                            {(renderOnDisconnect || isDemoMode) && (
                              <button
                                key="members"
                                onClick={() => setActiveTab('members')}
                                className={`whitespace-nowrap h4 py-6 transition-all border-b-1 focus:ring-0 cursor-pointer ${
                                  activeTab == 'members'
                                    ? 'border-white text-white'
                                    : 'border-transparent text-gray-syn4 hover:text-gray-400 '
                                }`}
                              >
                                {`Members (${memberCount})`}
                              </button>
                            )}
                            {(renderOnDisconnect || isDemoMode) && (
                              <TabButton
                                active={activeTab === 'activity'}
                                label="Activity"
                                onClick={() => setActiveTab('activity')}
                              />
                            )}
                          </nav>
                          <div
                            className={`${
                              isSubNavStuck ? 'hidden' : 'block'
                            } border-b-1 border-gray-syn7 absolute w-screen right-0`}
                          ></div>
                        </div>

                        <div className="text-base grid grid-cols-12 gap-y-5">
                          <div className="col-span-12">
                            {activeTab == 'assets' && <Assets />}
                            {activeTab == 'members' &&
                              (renderOnDisconnect || isDemoMode) && (
                                <div className="-mr-6 sm:mr-auto">
                                  <ClubTokenMembers />
                                </div>
                              )}
                            {activeTab == 'activity' &&
                              (renderOnDisconnect || isDemoMode) && (
                                <ActivityView />
                              )}
                          </div>
                        </div>
                      </div>
                    ) : null}
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
