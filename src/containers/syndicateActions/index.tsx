// manager components
import ManagerActions from "@/containers/managerActions";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import ErrorBoundary from "src/components/errorBoundary";
import Layout from "src/components/layout";
import InvestInSyndicate from "src/components/syndicates/investInSyndicate";
import {
  syndicateActionConstants,
  syndicateDetailsConstants,
} from "src/components/syndicates/shared/Constants";
import { EtherscanLink } from "src/components/syndicates/shared/EtherscanLink";
import Head from "src/components/syndicates/shared/HeaderTitle";
import SyndicateDetails from "src/components/syndicates/syndicateDetails";
/**
 * Renders syndicate component with details section on the left and
 * deposit section on the right
 * @param {object} props
 */

const SyndicateInvestment = (props: {
  web3;
  syndicateContractInstance;
  syndicate;
  syndicateFound;
  syndicateAddressIsValid;
}) => {
  const {
    web3: { account },
    syndicateContractInstance,
    syndicate,
    syndicateFound,
    syndicateAddressIsValid,
  } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const { syndicateAddress } = router.query;

  const [lpIsManager, setLpIsManager] = useState<boolean>(false);

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
      dispatch(
        getSyndicateByAddress(syndicateAddress, syndicateContractInstance)
      );
    }
  }, [syndicateContractInstance, syndicateAddress, account]);

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

  const {
    syndicateDetailsFooterText,
    syndicateDetailsLinkText,
  } = syndicateDetailsConstants;

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
      <div className="flex flex-col items-center justify-center sm:w-7/12 md:w-5/12 rounded-custom bg-gray-6 p-10">
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
        <div className="w-full">
          <div className="py-4">
            <Link href="/syndicates">
              <a className="text-blue-cyan text-sm">{backLinkText}</a>
            </Link>
          </div>

          {!syndicateFound || !syndicateAddressIsValid ? (
            syndicateEmptyState
          ) : (
            <div className="w-full flex flex-col md:flex-row">
              <SyndicateDetails
                lpIsManager={lpIsManager}
                syndicate={syndicate}
              />
              {lpIsManager ? (
                <ManagerActions syndicate={syndicate} />
              ) : (
                <InvestInSyndicate syndicate={syndicate} />
              )}
            </div>
          )}
          <div className="flex w-full my-8 justify-center m-auto p-auto">
            <p className="text-center text-sm flex justify-center flex-wrap	font-extralight">
              <span>{syndicateDetailsFooterText}&nbsp;</span>
              <a
                className="font-normal text-blue-cyan"
                href="#"
                target="_blank"
                rel="noreferrer">
                {syndicateDetailsLinkText}
              </a>
            </p>
          </div>
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

const mapStateToProps = ({
  web3Reducer: { web3 },
  syndicateInstanceReducer: { syndicateContractInstance },
  syndicatesReducer: { syndicate, syndicateFound, syndicateAddressIsValid },
}) => {
  return {
    web3,
    syndicateContractInstance,
    syndicate,
    syndicateFound,
    syndicateAddressIsValid,
  };
};

export default connect(mapStateToProps)(SyndicateInvestment);
