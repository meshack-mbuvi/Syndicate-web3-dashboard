import React from "react";
import Button from "src/components/buttons";
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
const Syndicate = () => {
  return (
    <Layout>
      <Head title="Manage" />
      <ErrorBoundary>
        <div className="w-full">
          <div className="flex justify-between w-full">
            <Button customClasses="bottom-4 right-4 absolute bg-blue-light rounded-full h-16 w-16 p-3 pt-3 text-5xl">
              +
            </Button>
          </div>
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

export default Syndicate;
