import PortfolioAndDiscover from "@/components/syndicates/portfolioAndDiscover";
import React from "react";
import ErrorBoundary from "src/components/errorBoundary";
import Layout from "src/components/layout";
import Head from "src/components/syndicates/shared/HeaderTitle";

/**
 * Diplays all syndicates.
 * The main groups for syndicates are active and inactive
 *
 * At the top-right of the page, there is a create button which opens a modal
 * with a form to create a new syndicate
 */
const SyndicatesComponent = () => {
  return (
    <Layout>
      <Head title="My Syndicates" />
      {/* help for the Netlify post-processing bots */}
      <form
        name="offChainData"
        data-netlify="true"
        netlify-honeypot="bot-field"
        hidden>
        <input type="text" name="fullName" />
        <input type="text" name="emailAddress" />
        <input type="text" name="syndicateAddress" />
      </form>
      <ErrorBoundary>
        <div className="w-full">
          {/* show my syndicates */}
          <PortfolioAndDiscover />
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

export default SyndicatesComponent;
