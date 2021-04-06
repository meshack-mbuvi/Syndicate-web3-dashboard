import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ErrorBoundary from "src/components/errorBoundary";
import Layout from "src/components/layout";
import InvestInSyndicate from "src/components/syndicates/investInSyndicate";
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
    if (syndicateInstance) {
      try {
        syndicateInstance
          .getSyndicateValues(syndicateAddress)
          .then((data) => {
            console.log({ data });
            const closeDate = formatDate(new Date(data.closeDate.toNumber()));
            /**
             * block.timestamp which is the one used to save creationDate is in
             * seconds. We multiply by 1000 to convert to milliseconds and then
             * convert this to javascript date object
             */
            const createdDate = formatDate(
              new Date(data.creationDate.toNumber() * 1000)
            );

            const maxDeposit = data.maxDeposit.toString();
            const profitShareToSyndicateProtocol = fromNumberToPercent(
              etherToNumber(data.syndicateProfitSharePercent.toString())
            );
            const openToDeposits = data.spvOpen;
            const totalDeposits = etherToNumber(data.totalDeposits.toString());

            setSyndicate({
              maxDeposit,
              profitShareToSyndicateProtocol,
              openToDeposits,
              totalDeposits,
              closeDate,
              createdDate,
              inactive: data.inactive,
              allowlistEnabled: data.allowlistEnabled,
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
      <ErrorBoundary>
        <div className="w-full flex flex-col">
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
