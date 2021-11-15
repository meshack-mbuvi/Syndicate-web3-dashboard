import React, { FC } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import { RootState } from "@/redux/store";
import ConnectWallet from "src/components/connectWallet";
import Header from "src/components/navigation/header";
import ProgressBar from "../ProgressBar";
import SEO from "../seo";
import { SyndicateInBetaBanner } from "src/components/banners";

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
  } = useSelector((state: RootState) => state);

  const showCreateProgressBar =
    router.pathname === "/clubs/create/clubprivatebetainvite";

  const { currentStep, steps, showByInvitationOnly } =
    useCreateInvestmentClubContext();
  return (
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
  );
};

export default Layout;
