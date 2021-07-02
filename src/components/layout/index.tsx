import { useRouter } from "next/router";
import React from "react";
import {
  DepositsPageBanner,
  SyndicateInBetaBanner,
} from "src/components/banners";
import ConnectWallet from "src/components/connectWallet";
import Header from "src/components/navigation/header";
import SEO from "../seo";

export const Layout = ({ children, backLink = null }) => {
  const router = useRouter();

  const showDepositsPageBanner =
    router.pathname.endsWith("deposit") || router.pathname.endsWith("details");

  return (
    <div>
      <SEO
        keywords={[`next`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />
      <Header backLink={backLink} />
      <div className="sticky top-20 z-10">
        <SyndicateInBetaBanner />
        {showDepositsPageBanner && <DepositsPageBanner key={2} />}
      </div>
      <div className="flex w-full flex-col sm:flex-row md:py-32 py-28 px-4 md:px-6 z-0">
        {children}
      </div>
      <ConnectWallet />
    </div>
  );
};

export default Layout;
