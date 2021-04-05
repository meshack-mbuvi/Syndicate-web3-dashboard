import React from "react";

import Layout from "src/components/layout";
import SyndicateDetails from "src/components/syndicates/syndicateDetails";
import InvestInSyndicate from "src/components/syndicates/investInSyndicate";

const SyndicateInvestment = () => {
  return (
    <Layout>
      <div className="w-full flex flex-col">
        <div className="w-full flex flex-col sm:flex-row">
          <SyndicateDetails />
          <InvestInSyndicate />
        </div>

        <div className="flex w-full block my-8 justify-center m-auto p-auto">
          <p className="w-2/3 text-center flex justify-center flex-wrap	">
            Syndicate's contract has been formally verified but is still being
            audited. Do not deposit more than you are willing to lose during our
            alpha test. Our audits will be complete soon.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SyndicateInvestment;
