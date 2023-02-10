import Footer from '@/components/navigation/footer';
import Header from '@/components/navigation/header/Header';
import { PortfolioSideNav } from '@/components/syndicates/shared/PortfolioSideNav';
import { CreateSteps } from '@/context/CreateInvestmentClubContext/steps';
import { getNetworkByName } from '@/helpers/getNetwork';
import useAdminClubs from '@/hooks/clubs/useAdminClubs';
import { useTokenOwner } from '@/hooks/clubs/useClubOwner';
import useMemberClubs from '@/hooks/clubs/useMemberClubs';
import { useDemoMode } from '@/hooks/useDemoMode';
import useWindowSize from '@/hooks/useWindowSize';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { getFirstOrString } from '@/utils/stringUtils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ConnectWallet from 'src/components/connectWallet';
import DemoBanner from '../demoBanner';
import SEO from '../seo';

interface Props {
  showBackButton?: boolean;
  managerSettingsOpen?: boolean;
  dotIndicatorOptions?: CreateSteps[] | string[];
  handleExitClick?: () => void;
  showNav?: boolean;
  activeIndex?: number;
  navItems?: { navItemText: string; url?: string; isLegal?: boolean }[];
  hideWallet?: boolean;
  hideEllipsis?: boolean;
  showCloseButton?: boolean;
  keepLogoCentered?: boolean;
  customClasses?: string;
  showNavButton?: boolean;
  showCreateProgressBar?: boolean;
  showSideNav?: boolean;
  nextBtnDisabled?: boolean;
  hideFooter?: boolean;
  handleNext?: (index?: number) => void;
  showDotIndicators?: boolean;
  showDotIndicatorLabels?: boolean;
  handlePrevious?: (index?: number) => void;
  showSideNavButton?: boolean;
  sideNavLogo?: React.ReactElement;
  handleGoToStep?: (step: number) => void;
  showDotIndicatorsTooltip?: boolean;
}

const Layout: FC<Props> = ({
  children,
  activeIndex = 0,
  dotIndicatorOptions,
  handleExitClick,
  managerSettingsOpen = false,
  showBackButton = false,
  showNav = true,
  hideWallet = false,
  hideEllipsis = false,
  showCloseButton = false,
  keepLogoCentered = false,
  showCreateProgressBar = false,
  customClasses = 'items-start',
  showSideNav = false,
  nextBtnDisabled = true,
  showDotIndicatorLabels = true,
  hideFooter = false,
  handleNext,
  handlePrevious,
  navItems = [
    {
      url: '/',
      navItemText: 'Portfolio'
    }
  ],
  showNavButton = false,
  showSideNavButton = true,
  sideNavLogo = (
    <Link href="/" passHref>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a>
        <img src="/images/logo.svg" alt="Syndicate Logo" />
      </a>
    </Link>
  ),
  showDotIndicators = true,
  showDotIndicatorsTooltip = false,
  handleGoToStep
}) => {
  const {
    web3Reducer: {
      web3: { account, status, activeNetwork, web3 }
    },
    erc20TokenSliceReducer: {
      erc20Token: { owner, loading: loadingClubDetails }
    }
  } = useSelector((state: AppState) => state);

  const { adminClubs, loading: adminClubsLoading } = useAdminClubs();
  const { memberClubs, memberClubsLoading } = useMemberClubs();
  const loading = adminClubsLoading || memberClubsLoading;

  const router = useRouter();
  const isDemoMode = useDemoMode();
  const { height } = useWindowSize();

  const { pathname, isReady } = router;

  const clubAddress = getFirstOrString(router.query.clubAddress);

  const portfolioPage = router.pathname === '/clubs' || router.pathname === '/';

  // get content to occupy the viewport if we are in these states.
  // this will push the footer down to the bottom of the page to make it uniform
  // across the app
  const clubsFound = adminClubs.length > 0 || memberClubs.length > 0;
  const fewClubs = adminClubs.length + memberClubs.length < 4;
  const onPortfolioPage = clubsFound && fewClubs && portfolioPage;
  const pushFooter =
    onPortfolioPage ||
    !account ||
    (loading && !managerSettingsOpen) ||
    loadingClubDetails;

  // we don't need to render the footer on the creation/modification and
  // distribution pages.
  const createClubPage = router.pathname === '/clubs/create';
  const isCreateCollectivePage = router.pathname === '/collectives/create';
  const modifyClubPage =
    router.pathname === `/collectives/[collectiveAddress]/modify`;
  const distributionPage =
    router.pathname === `/clubs/[clubAddress]/distribute`;

  // show a slightly lighter shade of background color on the create flow pages
  const isCreateFlowPage = router.pathname.includes('create');

  const { isOwner, isLoading } = useTokenOwner(
    clubAddress || '',
    web3,
    activeNetwork,
    account
  );

  const handleRouting = (): void => {
    const { chain, ...rest } = router.query;

    const clubAddress = getFirstOrString(router.query.clubAddress);

    if (isLoading || !router.isReady || !clubAddress) return;

    const chainName = getNetworkByName(chain);

    if (pathname.includes('/manage') && !isOwner) {
      void router.replace({
        pathname: `/clubs/${clubAddress}`,
        query: { chain: chainName?.network || activeNetwork.network, ...rest }
      });
    } else if (
      (pathname === '/clubs/[clubAddress]' || pathname.includes('/member')) &&
      isOwner &&
      clubAddress
    ) {
      void router.replace({
        pathname: `/clubs/${clubAddress}/manage`,
        query: { chain: chainName?.network || activeNetwork.network, ...rest }
      });
    }
  };

  useEffect(() => {
    if (
      loadingClubDetails ||
      !clubAddress ||
      status === Status.CONNECTING ||
      !owner ||
      !isReady ||
      isDemoMode ||
      isLoading
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
    isDemoMode
  ]);

  return (
    <div
      className={`flex flex-col justify-between w-full ${
        pushFooter ? 'h-screen' : ''
      }`}
    >
      <div
        className={`${isCreateCollectivePage ? 'h-screen bg-gray-syn9' : ''}`}
      >
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
          title="Syndicate"
        />

        <Header
          showBackButton={showBackButton}
          showNav={showNav}
          navItems={navItems}
          showDotIndicators={showDotIndicators}
          dotIndicatorOptions={dotIndicatorOptions}
          handleExitClick={handleExitClick}
          activeIndex={activeIndex || 0}
          handlePrevious={handlePrevious}
          hideWallet={hideWallet}
          hideEllipsis={hideEllipsis}
          showCloseButton={showCloseButton}
          showNavButton={showNavButton}
          keepLogoCentered={keepLogoCentered}
          showCreateProgressBar={showCreateProgressBar}
          showLogo={!showSideNav}
          showSideNav={showSideNav}
          handleNext={handleNext}
          nextBtnDisabled={nextBtnDisabled}
        />
        <DemoBanner />
        <div className="sticky top-18"></div>
        {/* left side nav for the create flow
         * z-50 allows it to appear above the top nav.
         * height = screen height - top and bottom padding(40 + 38)
         * */}
        {showSideNav ? (
          <div
            className="fixed left-0 top-10 text-white z-50 hidden md:block"
            style={{ height: height ? height - 78 : '' }}
          >
            <PortfolioSideNav
              // @ts-expect-error TS(2322): Type 'CreateSteps[] | string[] | undefined' is not assig ... Remove this comment to see the full error message
              dotIndicatorOptions={dotIndicatorOptions}
              // @ts-expect-error TS(2322): Type '(() => void) | undefined' is not assignable ... Remove this comment to see the full error message
              handleExitClick={handleExitClick}
              // @ts-expect-error TS(2322): Type '((index?: number | undefined) => void) | undefined' is not assig ... Remove this comment to see the full error message
              handleBack={handlePrevious}
              // @ts-expect-error TS(2322): Type '((index?: number | undefined) => void) | undefined' is not assig ... Remove this comment to see the full error message
              handleNext={handleNext}
              activeIndex={activeIndex}
              nextBtnDisabled={nextBtnDisabled}
              showDotIndicatorLabels={showDotIndicatorLabels}
              showSideNavButton={showSideNavButton}
              sideNavLogo={sideNavLogo}
              showDotIndicators={showDotIndicators}
              handleGoToStep={handleGoToStep}
              showDotIndicatorsTooltip={showDotIndicatorsTooltip}
            />
          </div>
        ) : null}
        <div
          className={`flex w-full ${
            isCreateFlowPage ? 'bg-gray-syn9' : 'bg-black'
          } flex-col sm:flex-row ${
            showCreateProgressBar ? 'pt-16' : isDemoMode ? 'pt-48' : 'pt-24'
          } z-20 justify-center my-0 mx-auto ${customClasses}`}
        >
          {children}
        </div>
        <ConnectWallet />
      </div>

      {/* need to add in a check for collectives settings open because it uses Layout component */}
      {hideFooter ||
      createClubPage ||
      modifyClubPage ||
      managerSettingsOpen ||
      distributionPage ? null : (
        <div className={`${isCreateFlowPage ? 'bg-gray-syn9' : 'bg-black'}`}>
          <div className="container mx-auto">
            <Footer extraClasses="mt-24 sm:mt-24 md:mt-40 mb-12" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
