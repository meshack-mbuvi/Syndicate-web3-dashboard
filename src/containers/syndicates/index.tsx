import React from "react";
import ErrorBoundary from "src/components/errorBoundary";
import Layout from "src/components/layout";
import MySyndicates from "src/components/syndicates/mySyndicates";
import Head from "src/components/syndicates/shared/HeaderTitle";

/**
 * Diplays all syndicates.
 * The main groups for syndicates are active and inactive
 *
 * At the top-right of the page, there is a create button which opens a modal
 * with a form to create a new syndicate
 */
const Syndicates = () => {
  return (
    <Layout>
      <Head title="My Syndicates" />
      <ErrorBoundary>
        <div className="w-full">
          {/* show my syndicates */}
          <MySyndicates />
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

export default Syndicates;
