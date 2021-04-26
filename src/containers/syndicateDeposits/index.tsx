import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ErrorBoundary from "src/components/errorBoundary";
import Layout from "src/components/layout";
import InvestInSyndicate from "src/components/syndicates/investInSyndicate";
import Head from "src/components/syndicates/shared/HeaderTitle";
import SyndicateDetails from "src/components/syndicates/syndicateDetails";
import { etherToNumber, formatDate, fromNumberToPercent } from "src/utils";

/**
 * Renders syndicate component with details section on the left and
 * deposit section on the right
 * @param {object} props
 */

const SyndicateInvestment = (props) => {
  const {
    web3: { syndicateInstance, account },
  } = props;
  const router = useRouter();

  const { syndicateAddress } = router.query;

  const [syndicate, setSyndicate] = useState(null);

  useEffect(() => {
    if (syndicateInstance && syndicateAddress) {
      try {
        syndicateInstance
          .getSyndicateValues(syndicateAddress)
          .then((data) => {
            console.log({ data });
            const closeDate = formatDate(
              new Date(data.closeDate.toNumber() * 1000)
            );

            /**
             * block.timestamp which is the one used to save creationDate is in
             * seconds. We multiply by 1000 to convert to milliseconds and then
             * convert this to javascript date object
             */
            const createdDate = formatDate(
              new Date(data.creationDate.toNumber() * 1000)
            );

            const maxDeposit = data.maxTotalDeposits.toString();

            const profitShareToSyndicateProtocol = data.syndicateProfitShareBasisPoints.toNumber();
            const profitShareToSyndicateLead = data.managerPerformanceFeeBasisPoints.toNumber();
            const depositERC20ContractAddress =
              data.depositERC20ContractAddress;

            const openToDeposits = data.syndicateOpen;
            const currentManager = data.currentManager;
            const syndicateOpen = data.syndicateOpen;
            const distributionsEnabled = data.distributionsEnabled;

            const totalDeposits = etherToNumber(data.totalDeposits.toString());

            setSyndicate({
              maxDeposit,
              profitShareToSyndicateProtocol,
              profitShareToSyndicateLead,
              openToDeposits,
              totalDeposits,
              closeDate,
              createdDate,
              active: data.active,
              allowlistEnabled: data.allowlistEnabled,
              depositERC20ContractAddress,
              currentManager,
              syndicateOpen,
              distributionsEnabled,
            });
          })
          .catch((err) => console.log({ err }));
      } catch (err) {
        console.log({ err });
      }
    }
  }, [syndicateInstance, account]);

  return (
    <Layout>
      <Head title="Syndicate" />
      <ErrorBoundary>
        <div className="w-full flex flex-col">
          <Link href="/syndicates">
            <a className="text-blue-cyan p-2 my-4 text-sm">
              {"< Back To My Syndicates"}
            </a>
          </Link>
          <div className="w-full flex flex-col sm:flex-row">
            <SyndicateDetails syndicate={syndicate} />

            <InvestInSyndicate syndicate={syndicate} />
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

SyndicateInvestment.propTypes = {
  web3: PropTypes.object,
};

const mapStateToProps = ({ web3Reducer }) => {
  const { web3 } = web3Reducer;
  return { web3 };
};

export default connect(mapStateToProps)(SyndicateInvestment);
