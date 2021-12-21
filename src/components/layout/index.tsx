import Footer from "@/components/navigation/footer";
import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import { AppState } from "@/state";
import { Status } from "@/state/wallet/types";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { SyndicateInBetaBanner } from "src/components/banners";
import ConnectWallet from "src/components/connectWallet";
import Header from "src/components/navigation/header";
import ProgressBar from "../ProgressBar";
import SEO from "../seo";

interface Props {
  backLink?: string;
  showNav?: boolean;
  navItems?: { url: string; urlText: string }[];
}

const Layout: FC<Props> = ({
  children,
  backLink = null,
  showNav = true,
  navItems = [
    {
      url: "/clubs",
      urlText: "Portfolio",
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
  const {
    pathname,
    query: { clubAddress },
  } = router;

  const isOwner = account === owner && account != "" && owner != "";

  const showCreateProgressBar =
    router.pathname === "/clubs/create/clubprivatebetainvite";
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
  const createClubPage =
    router.pathname === "/clubs/create/clubprivatebetainvite";

  const handleRouting = () => {
    if (!account && pathname.includes("/manage")) {
      router.replace(`/clubs/${clubAddress}`);
      return;
    } else {
      if (pathname.includes("/manage") && !isOwner) {
        router.replace(`/clubs/${clubAddress}`);
      } else if (pathname === "/clubs/[clubAddress]" && isOwner) {
        router.replace(`/clubs/${clubAddress}/manage`);
      }
    }
  };

  useEffect(() => {
    if (
      loadingClubDetails ||
      !clubAddress ||
      status === Status.CONNECTING ||
      !owner
    )
      return;

    handleRouting();
  }, [owner, clubAddress, account, loadingClubDetails]);

  return (
    <div
      className={`flex flex-col justify-between ${pushFooter && "h-screen"}`}
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
        <Header backLink={backLink} show={showNav} navItems={navItems} />
        <div
          className={`sticky top-18 z-20 ${
            showCreateProgressBar ? "bg-black z-20 backdrop-filter" : ""
          }`}
        >
          <SyndicateInBetaBanner />
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
            showCreateProgressBar ? "pt-16" : "pt-24"
          } z-20 justify-center items-center my-0 mx-auto`}
        >
          {children}
        </div>
        <ConnectWallet />
      </div>
      {createClubPage ? null : (
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
