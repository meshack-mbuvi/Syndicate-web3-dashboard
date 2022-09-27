import Footer from '@/components/navigation/footer';
import Header from '@/components/navigation/header/Header';
import { PortfolioSideNav } from '@/components/syndicates/shared/PortfolioSideNav';
import { CreateSteps } from '@/context/CreateInvestmentClubContext/steps';
import { useTokenOwner } from '@/hooks/clubs/useClubOwner';
import { useDemoMode } from '@/hooks/useDemoMode';
import useWindowSize from '@/hooks/useWindowSize';
import { useGetNetwork } from '@/hooks/web3/useGetNetwork';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
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
  hideWalletAndEllipsis?: boolean;
  showCloseButton?: boolean;
  customClasses?: string;
  showNavButton?: boolean;
  showCreateProgressBar?: boolean;
  showSideNav?: boolean;
  nextBtnDisabled?: boolean;
  handleNext?: (index?: number) => void;
  showDotIndicatorLabels?: boolean;
  handlePrevious?: (index?: number) => void;
}

const Layout: FC<Props> = ({
  children,
  activeIndex = 0,
  dotIndicatorOptions,
  handleExitClick,
  managerSettingsOpen = false,
  showBackButton = false,
  showNav = true,
  hideWalletAndEllipsis = false,
  showCloseButton = false,
  showCreateProgressBar = false,
  customClasses,
  showSideNav = false,
  nextBtnDisabled = true,
  showDotIndicatorLabels = true,
  handleNext,
  handlePrevious,
  navItems = [
    {
      url: '/',
      navItemText: 'Portfolio'
    }
  ],
  showNavButton = false
}) => {
  const {
    web3Reducer: {
      web3: { account, status, activeNetwork, web3 }
    },
    clubERC20sReducer: { myClubERC20s, otherClubERC20s, loading },
    erc20TokenSliceReducer: {
      erc20Token: { owner, loading: loadingClubDetails }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const { chain } = router.query;
  const urlNetwork = useGetNetwork(chain);

  const isDemoMode = useDemoMode();
  const { height } = useWindowSize();

  const {
    pathname,
    isReady,
    query: { clubAddress }
  } = router;

  const portfolioPage = router.pathname === '/clubs' || router.pathname === '/';

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

  // we don't need to render the footer on the creation/modification and
  // distribution pages.
  const createClubPage = router.pathname === '/clubs/create';
  const modifyClubPage =
    router.pathname === `/collectives/[collectiveAddress]/modify`;
  const distributionPage =
    router.pathname === `/clubs/[clubAddress]/distribute`;

  const { isOwner, isLoading } = useTokenOwner(
    clubAddress as string,
    web3,
    activeNetwork,
    account
  );

  const handleRouting = () => {
    if (isLoading) return;

    if (pathname.includes('/manage') && !isOwner) {
      router.replace(
        `/clubs/${clubAddress}${
          '?chain=' + urlNetwork?.network || activeNetwork.network
        }`
      );
    } else if (
      (pathname === '/clubs/[clubAddress]' || pathname.includes('/member')) &&
      isOwner
    ) {
      router.replace(
        `/clubs/${clubAddress}/manage${
          '?chain=' + urlNetwork?.network || activeNetwork.network
        }`
      );
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
          title="Syndicate"
        />

        <Header
          showBackButton={showBackButton}
          showNav={showNav}
          navItems={navItems}
          dotIndicatorOptions={dotIndicatorOptions}
          handleExitClick={handleExitClick}
          activeIndex={activeIndex || 0}
          handlePrevious={handlePrevious}
          hideWalletAndEllipsis={hideWalletAndEllipsis}
          showCloseButton={showCloseButton}
          showNavButton={showNavButton}
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
              dotIndicatorOptions={dotIndicatorOptions}
              handleExitClick={handleExitClick}
              handleBack={handlePrevious}
              handleNext={handleNext}
              activeIndex={activeIndex}
              nextBtnDisabled={nextBtnDisabled}
              showDotIndicatorLabels={showDotIndicatorLabels}
            />
          </div>
        ) : null}
        <div
          className={`flex w-full bg-black flex-col sm:flex-row ${
            showCreateProgressBar ? 'pt-16' : isDemoMode ? 'pt-48' : 'pt-24'
          } z-20 justify-center items-start my-0 mx-auto ${customClasses}`}
        >
          {children}
        </div>
        <ConnectWallet />
      </div>

      {/* need to add in a check for collectives settings open because it uses Layout component */}
      {createClubPage ||
      modifyClubPage ||
      managerSettingsOpen ||
      distributionPage ? null : (
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
