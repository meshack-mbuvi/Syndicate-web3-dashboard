import React from "react";
import ErrorBoundary from "src/components/errorBoundary";
import Link from "next/link";
import Layout from "src/components/layout";
import Head from "src/components/syndicates/shared/HeaderTitle";
import ManagerActions from "src/components/managerActions";
import SyndicateDetails from "src/components/syndicateDetails";
/**
 * Renders syndicate component with details section on the left and
 * manager actions section on the right
 * @param {object} props
 */

const SyndicateManage = () => {
  return (
    <Layout>
      <Head title="Manage" />
      <ErrorBoundary>
        <div className="w-full flex flex-col">
          <Link href="/syndicates">
            <a className="text-blue-cyan p-2 my-4 text-sm">
              {"< Back To My Syndicates"}
            </a>
          </Link>
          <div className="w-full flex flex-col sm:flex-row">
            <SyndicateDetails />
            <ManagerActions />
          </div>

          <div className="flex w-full block my-8 justify-center m-auto p-auto">
            <p className="w-2/3 text-center flex justify-center flex-wrap	">
              Syndicate&apos;s contract has been formally verified but is still
              being audited. Do not deposit more than you are willing to lose
              during our alpha test. Our audits will be complete soon.
            </p>
          </div>
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

export default SyndicateManage;
