import Footer from "@/components/navigation/footer";
import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import { useIsClubOwner } from "@/hooks/useClubOwner";
import { AppState } from "@/state";
import { Status } from "@/state/wallet/types";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import ConnectWallet from "src/components/connectWallet";
import Header from "@/components/navigation/header/Header";
import DemoBanner from "../demoBanner";
import ProgressBar from "../ProgressBar";
import SEO from "../seo";
import { useDemoMode } from "@/hooks/useDemoMode";
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
      url: "/clubs",
      navItemText: "Portfolio",
    },
  ],
}) => {
  const {
    web3Reducer: {
      web3: { account, status },
    },
    clubERC20sReducer: { myClubERC20s, otherClubERC20s, loading },
    erc20TokenSliceReducer: {
      erc20Token: { owner, loading: loadingClubDetails },
    },
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const isDemoMode = useDemoMode();

  const {
    pathname,
    isReady,
    query: { clubAddress },
  } = router;

  const isOwner = useIsClubOwner();

  const showCreateProgressBar = router.pathname === "/clubs/create";
  const portfolioPage = router.pathname === "/clubs" || router.pathname === "/";

  const { currentStep, steps, preClubCreationStep } =
    useCreateInvestmentClubContext();

  // get content to occupy the viewport if we are in these states.
  // this will push the footer down to the bottom of the page to make it uniform
  // across the app
  const clubsFound = myClubERC20s.length > 0 || otherClubERC20s.length > 0;
  const fewClubs = myClubERC20s.length + otherClubERC20s.length < 4;
  const onPortfolioPage = clubsFound && fewClubs && portfolioPage;
  const pushFooter =
    onPortfolioPage || !account || loading || loadingClubDetails;

  // we don't need to render the footer on the creation page.
  const createClubPage = router.pathname === "/clubs/create";

  const handleRouting = () => {
    if (pathname.includes("/manage") && !isOwner) {
      router.replace(`/clubs/${clubAddress}`);
    } else if (pathname === "/clubs/[clubAddress]" && isOwner) {
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
  }, [owner, clubAddress, account, loadingClubDetails, status, isReady]);

  return (
    <div
      className={`flex flex-col justify-between ${
        pushFooter ? "h-screen" : ""
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
            showCreateProgressBar ? "bg-black backdrop-filter" : ""
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
            showCreateProgressBar ? "pt-16" : isDemoMode ? "pt-48" : "pt-24"
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
