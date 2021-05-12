// manager components
import ManagerActions from "@/containers/managerActions";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ErrorBoundary from "src/components/errorBoundary";
import Layout from "src/components/layout";
import InvestInSyndicate from "src/components/syndicates/investInSyndicate";
import { syndicateActionConstants } from "src/components/syndicates/shared/Constants";
import { EtherscanLink } from "src/components/syndicates/shared/EtherscanLink";
import Head from "src/components/syndicates/shared/HeaderTitle";
import SyndicateDetails from "src/components/syndicates/syndicateDetails";
import { formatDate } from "src/utils";
import { ERC20TokenDetails } from "src/utils/ERC20Methods";
import { isZeroAddress } from "src/utils/validators";
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
  const [
    syndicateAddressIsValid,
    setSyndicateAddressIsValid,
  ] = useState<boolean>(true);
  const [syndicateFound, setSyndicateFound] = useState<boolean>(true);

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
            if (isZeroAddress(data.currentManager)) {
              setSyndicateAddressIsValid(true);
              setSyndicateFound(false);
              return;
            }
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
            setSyndicateFound(true);
            setSyndicateAddressIsValid(true);
          })
          .catch((err) => console.log({ err }));
      } catch (err) {
        if (syndicateAddress) {
          setSyndicateAddressIsValid(false);
          setSyndicateFound(true);
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

  // get static text from constants
  const {
    noSyndicateTitleText,
    noSyndicateMessageText,
    syndicateAddressInvalidMessageText,
    syndicateAddressInvalidTitleText,
    backLinkText,
  } = syndicateActionConstants;

  // set texts to display on empty state
  // we'll initialize this to instances where address is not a syndicate.
  // if the address is invalid, this texts will be updated accordingly.
  let emptyStateTitle = noSyndicateTitleText;
  let emptyStateMessage = noSyndicateMessageText;
  if (!syndicateAddressIsValid) {
    emptyStateTitle = syndicateAddressInvalidTitleText;
    emptyStateMessage = syndicateAddressInvalidMessageText;
  }

  // set syndicate empty state.
  // component will be rendered if the address is not a syndicate or
  // if the address is invalid.
  const syndicateEmptyState = (
    <div className="flex justify-center items-center h-full w-full mt-6 sm:mt-10">
      <div className="flex flex-col items-center justify-center sm:w-7/12 md:w-5/12 rounded-custom bg-gray-100 p-10">
        <div className="w-full flex justify-center mb-6">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="h-12 text-gray-500 text-7xl"
          />
        </div>
        <p className="font-semibold text-2xl text-center">{emptyStateTitle}</p>
        <p className="text-sm my-5 font-normal text-gray-dim text-center">
          {emptyStateMessage}
        </p>
        {!syndicateAddressIsValid ? null : (
          <EtherscanLink contractAddress={syndicateAddress} />
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <Head title="Syndicate" />
      <ErrorBoundary>
        <div className="w-full flex flex-col">
          <Link href="/syndicates">
            <a className="text-blue-cyan p-2 my-4 text-sm">{backLinkText}</a>
          </Link>
          {!syndicateFound || !syndicateAddressIsValid ? (
            syndicateEmptyState
          ) : (
            <div className="w-full flex flex-col md:flex-row">
              <SyndicateDetails
                syndicate={syndicate}
                lpIsManager={lpIsManager}
              />
              {lpIsManager ? (
                <ManagerActions />
              ) : (
                <InvestInSyndicate syndicate={syndicate} />
              )}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

const mapStateToProps = ({
  web3Reducer: { web3 },
  syndicateInstanceReducer: { syndicateContractInstance },
}) => {
  return { web3, syndicateContractInstance };
};

export default connect(mapStateToProps)(SyndicateInvestment);
