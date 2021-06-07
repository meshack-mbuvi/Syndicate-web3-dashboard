// manager components
import ManagerActions from "@/containers/managerActions";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "src/components/errorBoundary";
import Layout from "src/components/layout";
import InvestInSyndicate from "src/components/syndicates/investInSyndicate";
import { syndicateActionConstants } from "src/components/syndicates/shared/Constants";
import { EtherscanLink } from "src/components/syndicates/shared/EtherscanLink";
import Head from "src/components/syndicates/shared/HeaderTitle";
import SyndicateDetails from "src/components/syndicates/syndicateDetails";
/**
 * Renders syndicate component with details section on the left and
 * deposit section on the right
 * @param {object} props
 */

const SyndicateInvestment = () => {
  // retrieve state
  const {
    web3: { account },
  } = useSelector((state: RootState) => state.web3Reducer);

  const { syndicateContractInstance } = useSelector(
    (state: RootState) => state.syndicateInstanceReducer
  );

  const { syndicate, syndicateFound, syndicateAddressIsValid } = useSelector(
    (state: RootState) => state.syndicatesReducer
  );

  const router = useRouter();
  const dispatch = useDispatch();

  const { syndicateAddress } = router.query;

  const [accountIsManager, setAccountIsManager] = useState<boolean>(false);

  // A manager should not access deposit page but should be redirected
  // to syndicates page
  useEffect(() => {
    if (!router.isReady) return;

    if (syndicateAddress !== undefined && account !== undefined) {
      if (syndicateAddress == account) {
        router.replace(`/syndicates/${syndicateAddress}/manage`);
      }
    }
  }, [account]);

  useEffect(() => {
    if (router.isReady && syndicateContractInstance.methods) {
      dispatch(
        getSyndicateByAddress(syndicateAddress, syndicateContractInstance)
      );
    }
  }, [router.isReady, syndicateContractInstance, syndicateAddress, account]);

  // check whether the current connected wallet account is the manager of the syndicate
  // we'll use this information to load the manager view
  useEffect(() => {
    if (syndicate && syndicate.managerCurrent == account) {
      setAccountIsManager(true);
    } else {
      setAccountIsManager(false);
    }
  }, [syndicate, account]);

  // get static text from constants
  const {
    noSyndicateTitleText,
    noSyndicateMessageText,
    syndicateAddressInvalidMessageText,
    syndicateAddressInvalidTitleText,
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
          {!syndicateFound || !syndicateAddressIsValid ? (
            syndicateEmptyState
          ) : (
            <div className="container mx-auto flex flex-col md:flex-row">
              {/* Left Gutter */}
              <div className="lg:w-24 md:w-12 w-24 flex-shrink-0 lg:static fixed">
                <div className="w-14 h-14 lg:hover:bg-gray-9 rounded-full py-4 md:mt-6 mt-6 lg:left-auto relative -left-12 hidden md:block lg:fixed">
                  <Link href="/syndicates">
                    <a><img className="mx-auto vertically-center relative " style={{left: '-2px'}} src="/images/back-chevron-large.svg"/></a>
                  </Link>
                </div>
              </div>
              {/* Left Column */}
              <div className="md:w-3/5 w-full pb-6 pt-28 md:pt-0 md:pr-24">
                <SyndicateDetails
                  accountIsManager={accountIsManager}
                  syndicate={syndicate}
                />
              </div>
              {/* Right Column */}
              <div className="lg:w-2/5 w-96 hidden md:block pt-0">
                <div className="lg:max-w-120 lg:w-full w-96 mx-auto sticky relative top-33">
                  {accountIsManager ? (
                    <ManagerActions />
                  ) : (
                    <InvestInSyndicate />
                  )}
                </div>
              </div>
              {/* Right Gutter */}
              {/* <div className="lg:w-24 w-24 md:w-12 lg:block hidden flex-shrink-0"></div> */}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

export default SyndicateInvestment;
