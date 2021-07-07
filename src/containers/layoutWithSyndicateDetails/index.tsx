import ErrorBoundary from "@/components/errorBoundary";
import Layout from "@/components/layout";
import useOnScreen from "@/components/syndicates/hooks/useOnScreen";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { syndicateActionConstants } from "src/components/syndicates/shared/Constants";
import Head from "src/components/syndicates/shared/HeaderTitle";
import SyndicateDetails from "src/components/syndicates/syndicateDetails";

const LayoutWithSyndicateDetails = ({ children }) => {
  // Retrieve state
  const {
    syndicatesReducer: { syndicate, syndicateFound, syndicateAddressIsValid },
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: { account },
    },
  } = useSelector((state: RootState) => state);

  const router = useRouter();
  const dispatch = useDispatch();

  // used to render right column components on the left column in small devices
  const ref = useRef();
  const isChildVisible = useOnScreen(ref);

  const { syndicateAddress } = router.query;

  const [accountIsManager, setAccountIsManager] = useState<boolean>(false);

  // A manager should not access deposit page but should be redirected
  // to syndicates page
  useEffect(() => {
    // We need to have syndicate loaded so that we know whether it's open to
    // deposit or not.
    if (!router.isReady || !syndicate) return;

    if (syndicateAddress !== undefined && account !== undefined) {
      switch (router.pathname) {
        case "/syndicates/[syndicateAddress]/manage":
          // For a closed syndicate, user should be navigated to withdrawal page
          if (syndicateAddress !== account) {
            if (syndicate?.open) {
              router.replace(`/syndicates/${syndicateAddress}/deposit`);
            } else {
              router.replace(`/syndicates/${syndicateAddress}/withdraw`);
            }
          }
          break;
        case "/syndicates/[syndicateAddress]/deposit":
          if (syndicateAddress === account) {
            router.replace(`/syndicates/${syndicateAddress}/manage`);
          } else if (!syndicate?.open) {
            // when syndicate is closed, go to withdraw page
            router.replace(`/syndicates/${syndicateAddress}/withdraw`);
          }
          break;
        case "/syndicates/[syndicateAddress]/withdraw":
          if (syndicateAddress === account) {
            router.replace(`/syndicates/${syndicateAddress}/manage`);
          }
          break;
        default:
          break;
      }
    }
  }, [account, router.isReady, syndicate]);

  // Syndicate data should be fetched when router is full set.
  // GetterLogicContract is used to retrieve syndicate values while
  // DistributionLogicContract is used to get distributions details for the
  // syndicate.
  useEffect(() => {
    if (
      router.isReady &&
      syndicateContracts?.GetterLogicContract &&
      syndicateContracts?.DistributionLogicContract
    ) {
      dispatch(
        getSyndicateByAddress({ syndicateAddress, ...syndicateContracts }),
      );
    }
  }, [
    router.isReady,
    syndicateContracts?.GetterLogicContract,
    syndicateContracts?.DistributionLogicContract,
    account,
    syndicateAddress,
    account,
  ]);

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
                <div className="w-14 h-14 lg:hover:bg-gray-9 rounded-full py-4 md:mt-6 mt-6 lg:left-auto relative -left-12 hidden md:block lg:fixed lg:active:bg-white lg:active:bg-opacity-20">
                  <Link href="/syndicates">
                    <a>
                      <img
                        className="mx-auto vertically-center relative "
                        style={{ left: "-2px" }}
                        src="/images/back-chevron-large.svg"
                      />
                    </a>
                  </Link>
                </div>
              </div>
              {/* Left Column */}
              <div className="md:w-3/5 w-full pb-6 md:pr-24">
                <div ref={ref} className="w-full md:hidden" />{" "}
                {/* its used as an identifier for ref in small devices */}
                <SyndicateDetails
                  accountIsManager={accountIsManager}
                  isChildVisible={isChildVisible}
                >
                  <div className="w-full md:hidden">{children}</div>
                </SyndicateDetails>
              </div>
              {/* Right Column */}
              <div className="lg:w-2/5 w-96 hidden md:block pt-0">
                <div className="lg:max-w-120 lg:w-full w-96 mx-auto sticky relative top-33">
                  {children}
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

export default LayoutWithSyndicateDetails;