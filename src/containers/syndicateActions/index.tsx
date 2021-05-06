// manager components
import ManagerActions from "@/containers/managerActions";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ErrorBoundary from "src/components/errorBoundary";
import Layout from "src/components/layout";
import InvestInSyndicate from "src/components/syndicates/investInSyndicate";
import Head from "src/components/syndicates/shared/HeaderTitle";
import SyndicateDetails from "src/components/syndicates/syndicateDetails";
import { formatDate } from "src/utils";
import { ERC20TokenDetails } from "src/utils/ERC20Methods";
/**
 * Renders syndicate component with details section on the left and
 * deposit section on the right
 * @param {object} props
 */

const SyndicateInvestment = (props: { web3; syndicateContractInstance }) => {
  const {
    web3: { account },
    syndicateContractInstance,
  } = props;
  const router = useRouter();

  const { syndicateAddress } = router.query;

  const [syndicate, setSyndicate] = useState(null);
  const [lpIsManager, setLpIsManager] = useState<boolean>(false);
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);

  // get number of decimal places for the current deposit token
  const getTokenDecimals = async (depositERC20ContractAddress) => {
    const ERC20Details = new ERC20TokenDetails(depositERC20ContractAddress);
    const tokenDecimals = await ERC20Details.getTokenDecimals();
    setTokenDecimals(parseInt(tokenDecimals));
  };

  // A manager should not access deposit page but should be redirected
  // to syndicates page
  useEffect(() => {
    if (syndicateAddress !== undefined && account !== undefined) {
      if (syndicateAddress == account) {
        router.replace(`/syndicates/${syndicateAddress}/manage`);
      }
    }
  }, [account]);

  useEffect(() => {
    if (syndicateContractInstance.methods) {
      try {
        syndicateContractInstance.methods
          .getSyndicateValues(syndicateAddress)
          .call()
          .then((data) => {
            const closeDate = formatDate(
              new Date(parseInt(data.closeDate) * 1000)
            );

            /**
             * block.timestamp which is the one used to save creationDate is in
             * seconds. We multiply by 1000 to convert to milliseconds and then
             * convert this to javascript date object
             */
            const createdDate = formatDate(
              new Date(parseInt(data.creationDate) * 1000)
            );

            const profitShareToSyndicateProtocol =
              parseInt(data.syndicateProfitShareBasisPoints) / 100;
            const profitShareToSyndicateLead =
              parseInt(data.managerPerformanceFeeBasisPoints) / 100;
            const managerManagementFeeBasisPoints =
              parseInt(data.managerManagementFeeBasisPoints) / 100;
            const depositERC20ContractAddress =
              data.depositERC20ContractAddress;

            getTokenDecimals(depositERC20ContractAddress);

            const openToDeposits = data.syndicateOpen;
            const currentManager = data.currentManager;
            const syndicateOpen = data.syndicateOpen;
            const distributionsEnabled = data.distributionsEnabled;
            const maxDeposit =
              parseFloat(data.maxTotalDeposits) / Math.pow(10, tokenDecimals);

            const totalDeposits =
              parseFloat(data.totalDeposits) / Math.pow(10, tokenDecimals);

            const totalDepositors = data.totalLPs;

            setSyndicate({
              maxDeposit,
              profitShareToSyndicateProtocol,
              profitShareToSyndicateLead,
              openToDeposits,
              totalDeposits,
              closeDate,
              createdDate,
              allowlistEnabled: data.allowlistEnabled,
              depositERC20ContractAddress,
              currentManager,
              syndicateOpen,
              distributionsEnabled,
              managerManagementFeeBasisPoints,
              totalDepositors,
            });
          })
          .catch((err) => console.log({ err }));
      } catch (err) {
        if (syndicateAddress) {
          setSyndicate(null);
        }
      }
    }
  }, [syndicateContractInstance, syndicateAddress, tokenDecimals]);

  // check whether the current connected wallet account is the manager of the syndicate
  // we'll use this information to load the manager view
  useEffect(() => {
    if (syndicate && syndicate.currentManager == account) {
      setLpIsManager(true);
    } else {
      setLpIsManager(false);
    }
  }, [syndicate, account]);

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
          <div className="w-full flex flex-col md:flex-row">
            <SyndicateDetails syndicate={syndicate} lpIsManager={lpIsManager} />

            {lpIsManager ? (
              <ManagerActions />
            ) : (
              <InvestInSyndicate syndicate={syndicate} />
            )}
          </div>
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

const mapStateToProps = ({
  web3Reducer,
  syndicateInstanceReducer: { syndicateContractInstance },
}) => {
  const { web3 } = web3Reducer;
  return { web3, syndicateContractInstance };
};

export default connect(mapStateToProps)(SyndicateInvestment);
