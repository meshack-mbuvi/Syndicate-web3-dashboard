import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import Footer from '@/components/navigation/footer';
import Header from '@/components/navigation/header/Header';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { CLUB_TOKEN_QUERY } from '@/graphql/queries';
import { getDepositDetails, setERC20Token } from '@/helpers/erc20TokenDetails';
import { useAccountTokens } from '@/hooks/useAccountTokens';
import { useClubDepositsAndSupply } from '@/hooks/useClubDepositsAndSupply';
import { useIsClubOwner } from '@/hooks/useClubOwner';
import { useDemoMode } from '@/hooks/useDemoMode';
import { AppState } from '@/state';
import { setClubMembers } from '@/state/clubMembers';
import {
  setERC20TokenContract,
  setERC20TokenDepositDetails,
  setERC20TokenDetails
} from '@/state/erc20token/slice';
import { Status } from '@/state/wallet/types';
import { isZeroAddress } from '@/utils';
import { mockActiveERC20Token, mockDepositERC20Token } from '@/utils/mockdata';
import { NetworkStatus, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConnectWallet from 'src/components/connectWallet';
import DemoBanner from '../demoBanner';
import ProgressBar from '../ProgressBar';
import SEO from '../seo';

interface Props {
  showBackButton?: boolean;
  managerSettingsOpen?: boolean;
  showNav?: boolean;
  navItems?: { navItemText: string; url?: string; isLegal?: boolean }[];
}

const Layout: FC<Props> = ({
  children,
  managerSettingsOpen = false,
  showBackButton = false,
  showNav = true,
  navItems = [
    {
      url: '/clubs',
      navItemText: 'Portfolio'
    }
  ]
}) => {
  const {
    web3Reducer: {
      web3: { account, status, web3, activeNetwork }
    },
    initializeContractsReducer: {
      syndicateContracts: { SingleTokenMintModule, DepositTokenMintModule }
    },
    clubERC20sReducer: { myClubERC20s, otherClubERC20s, loading },
    erc20TokenSliceReducer: {
      erc20TokenContract,
      depositDetails: { nativeDepositToken },
      erc20Token: { owner, address, loading: loadingClubDetails }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const isDemoMode = useDemoMode();

  const {
    pathname,
    isReady,
    query: { clubAddress }
  } = router;

  // fetch member account tokens
  useAccountTokens();

  const isOwner = useIsClubOwner();

  const showCreateProgressBar = router.pathname === '/clubs/create';
  const portfolioPage = router.pathname === '/clubs' || router.pathname === '/';

  const { currentStep, steps, preClubCreationStep } =
    useCreateInvestmentClubContext();

  // get content to occupy the viewport if we are in these states.
  // this will push the footer down to the bottom of the page to make it uniform
  // across the app
  const clubsFound = myClubERC20s.length > 0 || otherClubERC20s.length > 0;
  const fewClubs = myClubERC20s.length + otherClubERC20s.length < 4;
  const onPortfolioPage = clubsFound && fewClubs && portfolioPage;
  const pushFooter =
    onPortfolioPage ||
    !account ||
    (loading && !managerSettingsOpen) ||
    loadingClubDetails;

  // we don't need to render the footer on the creation page.
  const createClubPage = router.pathname === '/clubs/create';

  const handleRouting = () => {
    if (pathname.includes('/manage') && !isOwner) {
      router.replace(`/clubs/${clubAddress}`);
    } else if (
      (pathname === '/clubs/[clubAddress]' || pathname.includes('/member')) &&
      isOwner
    ) {
      router.replace(`/clubs/${clubAddress}/manage`);
    }
  };

  useEffect(() => {
    if (
      loadingClubDetails ||
      !clubAddress ||
      status === Status.CONNECTING ||
      !owner ||
      !isReady
    )
      return;

    handleRouting();
  }, [
    owner,
    clubAddress,
    account,
    loadingClubDetails,
    status,
    isReady,
    isOwner
  ]);

  // Load club details if we are on the club page
  const dispatch = useDispatch();

  const { totalDeposits, refetch: refetchSingleClubDetails } =
    useClubDepositsAndSupply(address);

  const {
    loading: queryLoading,
    data,
    networkStatus,
    stopPolling
  } = useQuery(CLUB_TOKEN_QUERY, {
    variables: {
      syndicateDaoId: address.toLocaleLowerCase()
    },
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId },
    notifyOnNetworkStatusChange: true,
    skip: !address || loading,
    fetchPolicy: 'no-cache'
  });

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
      // fallback for if single club details query doesn't initally work
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
    if (!activeNetwork.chainId || !clubAddress || status == Status.CONNECTING)
      return;

    if (
      clubAddress &&
      !isZeroAddress(clubAddress as string) &&
      web3.utils.isAddress(clubAddress as string) &&
      DepositTokenMintModule
    ) {
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
      dispatch(setERC20TokenDetails(mockActiveERC20Token));
    }
  }, [
    clubAddress,
    account,
    nativeDepositToken,
    status,
    DepositTokenMintModule,
    activeNetwork.chainId
  ]);

  return (
    <div
      className={`flex flex-col justify-between ${
        pushFooter ? 'h-screen' : ''
      }`}
    >
      <div>
        <SEO
          keywords={[
            `syndicate`,
            `crypto`,
            `invest`,
            `fund`,
            `social`,
            `ethereum`,
            `ETH`,
            `polygon`,
            `MATIC`
          ]}
          title="Home"
        />

        <Header
          showBackButton={showBackButton}
          showNav={showNav}
          navItems={navItems}
        />
        <DemoBanner />

        <div
          className={`sticky top-18 ${
            showCreateProgressBar ? 'bg-black backdrop-filter' : ''
          }`}
        >
          {showCreateProgressBar && account ? (
            <div className="pt-6 bg-black">
              <ProgressBar
                percentageWidth={
                  preClubCreationStep
                    ? 0
                    : ((currentStep + 1) / steps.length) * 100
                }
                tailwindColor="bg-green"
              />
            </div>
          ) : null}
        </div>

        <div
          className={`flex w-full bg-black flex-col sm:flex-row ${
            showCreateProgressBar ? 'pt-16' : isDemoMode ? 'pt-48' : 'pt-24'
          } z-20 justify-center items-center my-0 mx-auto`}
        >
          {children}
        </div>
        <ConnectWallet />
      </div>

      {createClubPage || managerSettingsOpen ? null : (
        <div>
          <div className="container mx-auto">
            <Footer extraClasses="mt-24 sm:mt-24 md:mt-40 mb-12" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
