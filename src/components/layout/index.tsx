import React, { FC } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import { AppState } from "@/state";
import ConnectWallet from "src/components/connectWallet";
import Header from "src/components/navigation/header";
import ProgressBar from "../ProgressBar";
import SEO from "../seo";
import { SyndicateInBetaBanner } from "src/components/banners";
import Footer from "@/components/navigation/footer";

interface Props {
  backLink?: string;
  showNav?: boolean;
}

const Layout: FC<Props> = ({ children, backLink = null, showNav = true }) => {
  const router = useRouter();
  const {
    web3Reducer: {
      web3: { account },
    },
    clubERC20sReducer: { myClubERC20s, otherClubERC20s, loading },
    erc20TokenSliceReducer: { erc20Token },
  } = useSelector((state: AppState) => state);

  const loadingClubDetails = erc20Token?.loading;

  const showCreateProgressBar =
    router.pathname === "/clubs/create/clubprivatebetainvite";
  const portfolioPage = router.pathname === "/clubs" || router.pathname === "/";

  const { currentStep, steps, showByInvitationOnly } =
    useCreateInvestmentClubContext();

  // get content to occupy the viewport if we are in these states.
  // this will push the footer down to the bottom of the page to make it uniform
  // across the app
  const clubsFound = myClubERC20s.length > 0 || otherClubERC20s.length > 0;
  const fewClubs = myClubERC20s.length + otherClubERC20s.length < 4;
  const onPortfolioPage = clubsFound && fewClubs && portfolioPage;
  const pushFooter =
    onPortfolioPage || !account || loading || loadingClubDetails;

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
        <Header backLink={backLink} show={showNav} />
        <div
          className={`sticky top-18 z-20 ${
            showCreateProgressBar
              ? "bg-black bg-opacity-50 z-20 backdrop-filter"
              : ""
          }`}
        >
          <SyndicateInBetaBanner />
          {showCreateProgressBar && account ? (
            <div className="pt-6 bg-black">
              <ProgressBar
                percentageWidth={
                  showByInvitationOnly
                    ? 0
                    : ((currentStep + 1) / steps.length) * 100
                }
                tailwindColor="bg-green"
              />
            </div>
          ) : null}
        </div>
        <div
          className={`flex w-full flex-col sm:flex-row ${
            showCreateProgressBar ? "pt-16" : "pt-24"
          } z-20 justify-center items-center my-0 mx-auto`}
        >
          {children}
        </div>
        <ConnectWallet />
      </div>
      <div>
        <div className="container mx-auto">
          <Footer extraClasses="mt-24 sm:mt-24 md:mt-40 mb-12" />
        </div>
      </div>
    </div>
  );
};

export default Layout;
