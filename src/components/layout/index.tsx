import React, { FC } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import { RootState } from "@/redux/store";
import { SyndicateInBetaBanner } from "src/components/banners";
import ConnectWallet from "src/components/connectWallet";
import Header from "src/components/navigation/header";
import ProgressBar from "../ProgressBar";
import SEO from "../seo";

interface Props {
  backLink?: string;
  showNav?: boolean;
}

const Layout: FC<Props> = ({ children, backLink = null, showNav = true }) => {
  const router = useRouter();
  const {
    syndicatesReducer: { syndicateFound, syndicateAddressIsValid },
    web3Reducer: {
      web3: { account },
    },
  } = useSelector((state: RootState) => state);

  const showCreateProgressBar = router.pathname === "/syndicates/create/clubs";

  const { currentStep, steps } = useCreateInvestmentClubContext();
  return (
    <div>
      <SEO
        keywords={[`next`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />
      <Header backLink={backLink} show={showNav} />
      <div className="sticky top-20 z-20">
        <SyndicateInBetaBanner />
        {showCreateProgressBar && account ? (
          <ProgressBar
            percentageWidth={((currentStep + 1) / steps.length) * 100}
            tailwindColor="bg-green"
          />
        ) : null}
      </div>
      <div className="flex w-full flex-col sm:flex-row py-24 z-20 justify-center items-center my-0 mx-auto">
        {children}
      </div>
      <ConnectWallet />
    </div>
  );
};

export default Layout;
