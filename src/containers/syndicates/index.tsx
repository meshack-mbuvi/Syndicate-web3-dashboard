import PortfolioAndDiscover from "@/components/syndicates/portfolioAndDiscover";
import React from "react";
import ErrorBoundary from "@/components/errorBoundary";
import Layout from "@/components/layout";
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
        <input type="checkbox" name="attachLLCManually" />
      </form>
      <ErrorBoundary>
        <div className="w-full">
          {/* show my syndicates */}
          <div className="container mx-auto">
            <PortfolioAndDiscover />
          </div>
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

export default SyndicatesComponent;
