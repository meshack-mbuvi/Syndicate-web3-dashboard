import ErrorBoundary from "@/components/errorBoundary";
import Layout from "@/components/layout";
import Footer from "@/components/navigation/footer";
import OnboardingModal from "@/components/onboarding";
import BackButton from "@/components/socialProfiles/backButton";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { syndicateActionConstants } from "src/components/syndicates/shared/Constants";
import Head from "src/components/syndicates/shared/HeaderTitle";
import SyndicateDetails from "src/components/syndicates/syndicateDetails";
import ManageMembers from "../managerActions/manageMembers";
const LayoutWithSyndicateDetails = ({ children }): JSX.Element => {
  // Retrieve state
  const {
    syndicatesReducer: { syndicate, syndicateFound, syndicateAddressIsValid },
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: { account, web3 },
    },
  } = useSelector((state: RootState) => state);

  const [showMembers, setShowMembers] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  // used to render right column components on the left column in small devices
  const ref = useRef();

  const { syndicateAddress } = router.query;

  const [accountIsManager, setAccountIsManager] = useState<boolean>(false);
  const showOnboardingIfNeeded = router.pathname.endsWith("deposit")

  // A manager should not access deposit page but should be redirected
  // to syndicates page
  useEffect(() => {
    // We need to have syndicate loaded so that we know whether it's open to
    // deposit or not.
    if (!router.isReady || !syndicate) return;

    if (
      !isEmpty(syndicate) &&
      syndicateAddress !== undefined &&
      account !== undefined &&
      web3.utils.isAddress(syndicate.syndicateAddress)
    ) {
      switch (router.pathname) {
        case "/syndicates/[syndicateAddress]/manage":
          // For a closed syndicate, user should be navigated to withdrawal page
          if (syndicate.managerCurrent !== account) {
            if (syndicate?.open) {
              router.replace(
                `/syndicates/${syndicate.syndicateAddress}/deposit`,
              );
            } else {
              router.replace(
                `/syndicates/${syndicate.syndicateAddress}/withdraw`,
              );
            }
          }
          setShowMembers(true);
          break;
        case "/syndicates/[syndicateAddress]/deposit":
          if (syndicate?.managerPending === account) {
            router.replace(`/syndicates/${syndicateAddress}/manager_pending`);
          } else if (syndicate.managerCurrent === account) {
            router.replace(`/syndicates/${syndicate.syndicateAddress}/manage`);
          } else if (syndicate.distributing) {
            router.replace(
              `/syndicates/${syndicate.syndicateAddress}/withdraw`,
            );
          }
          setShowMembers(false);
          break;
        case "/syndicates/[syndicateAddress]/withdraw":
          if (syndicate?.managerPending === account) {
            router.replace(`/syndicates/${syndicateAddress}/manager_pending`);
          } else if (syndicate.managerCurrent === account) {
            router.replace(`/syndicates/${syndicate.syndicateAddress}/manage`);
          } else if (syndicate.depositsEnabled || syndicate.open) {
            router.replace(`/syndicates/${syndicate.syndicateAddress}/deposit`);
          }
          setShowMembers(false);
          break;
        // case when address lacks action
        case "/syndicates/[syndicateAddress]/":
          if (syndicate.managerCurrent === account) {
            router.replace(`/syndicates/${syndicate.syndicateAddress}/manage`);
          } else if (syndicate.depositsEnabled || syndicate.open) {
            router.replace(`/syndicates/${syndicate.syndicateAddress}/deposit`);
          } else if (syndicate.distributing) {
            router.replace(
              `/syndicates/${syndicate.syndicateAddress}/withdraw`,
            );
          }
          setShowMembers(false);
          break;
        default:
          if (syndicateAddress && syndicate) {
            if (syndicate.managerCurrent === account) {
              router.replace(
                `/syndicates/${syndicate.syndicateAddress}/manage`,
              );
            } else if (syndicate.depositsEnabled || syndicate.open) {
              router.replace(
                `/syndicates/${syndicate.syndicateAddress}/deposit`,
              );
            } else if (syndicate.distributing) {
              router.replace(
                `/syndicates/${syndicate.syndicateAddress}/withdraw`,
              );
            } else if (
              syndicate.managerCurrent !== account &&
              !syndicate.open
            ) {
              router.replace(
                `/syndicates/${syndicate.syndicateAddress}/details`,
              );
            }
          }
          break;
      }
    }
  }, [account, router.isReady, syndicate]);

  // Syndicate data should be fetched when router is fully set.
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
    if (syndicate && syndicate?.managerCurrent == account) {
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
          <EtherscanLink etherscanInfo={syndicate?.syndicateAddress} />
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <Head title="Syndicate" />
      <ErrorBoundary>
        {showOnboardingIfNeeded && <OnboardingModal/>}
        <div className="w-full">
          {!syndicateFound || !syndicateAddressIsValid ? (
            syndicateEmptyState
          ) : (
            <div className="container mx-auto">
              {/* Two Columns (Syndicate Details + Widget Cards) */}
              <div className="flex flex-col md:flex-row">
                <BackButton topOffset="-1.2rem" />
                {/* Left Column */}
                <div className="md:w-3/5 w-full pb-6 md:pr-24">
                  <div ref={ref} className="w-full md:hidden" />{" "}
                  {/* its used as an identifier for ref in small devices */}
                  {/*
                  we should have an isChildVisible child here,
                  but it's not working as expected
                  */}
                  <SyndicateDetails accountIsManager={accountIsManager}>
                    <div className="w-full md:hidden">{children}</div>
                  </SyndicateDetails>
                </div>
                {/* Right Column */}
                <div className="lg:w-2/5 w-96 hidden md:block pt-0">
                  <div className="lg:max-w-120 lg:w-full w-96 mx-auto sticky relative top-33">
                    {children}
                  </div>
                </div>
              </div>
              <div className="my-10">
                <button className="flex flex-shrink text-blue-600 justify-center py-1 hover:opacity-80">
                  <img
                    src={"/images/eye-open.svg"}
                    alt="icon"
                    className="mr-3 mt-1.5"
                  />
                  <span>Show more details</span>
                </button>
              </div>

              {!isEmpty(syndicate) && <ManageMembers />}

              <Footer extraClasses="mt-24 sm:mt-24 md:mt-40 mb-12" />
            </div>
          )}
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

export default LayoutWithSyndicateDetails;
