import { Syndicate } from "@/@types/syndicate";
import { Layout } from "@/components/layout";
import Steps from "@/components/syndicates/create/Steps";
import SuccessCreateSyndicate from "@/components/syndicates/shared/successCreateSyndicate";
import WalletNotConnected from "@/components/walletNotConnected";
import { ContentInfo, MainContent } from "@/containers/create/shared";
import Controls from "@/containers/create/shared/controls";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import { getSyndicates } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "src/components/syndicates/shared/HeaderTitle";
import { ConnectModal } from "@/components/connectWallet/connectModal";
import { Spinner } from "@/components/shared/spinner";
import { useFirstRender } from "@/components/syndicates/hooks/useFirstRender";

const CreateSyndicate: React.FC = () => {
  const {
    steps,
    currentSubStep,
    showSuccessView,
    currentStep,
    resetCreateSyndicateStore,
  } = useCreateSyndicateContext();

  const dispatch = useDispatch();
  const firstRender = useFirstRender();
  const router = useRouter();

  const {
    initializeContractsReducer: { syndicateContracts },
    syndicatesReducer: { syndicates = [] },
    loadingReducer: { loading },
    web3Reducer: { web3 },
    tokenAndDepositLimitReducer: {
      createSyndicate: {
        tokenAndDepositsLimits: {
          depositTokenDetails: { depositTokenAddress },
        },
      },
    },
  } = useSelector((state: RootState) => state);

  const { account } = web3;
  const [checkedForSyndicates, setCheckedForSyndicates] = useState(false);

  /**
   * We need to be sure syndicateContracts is initialized before retrieving events.
   */
  useEffect(() => {
    if (syndicateContracts?.GetterLogicContract && !firstRender) {
      dispatch(getSyndicates({ ...web3, ...syndicateContracts }));
      setCheckedForSyndicates(true);
    }
  }, [syndicateContracts?.GetterLogicContract, account]);

  // Assume by default this user has an open syndicate
  const [managerWithOpenSyndicate, setManagerWithOpenSyndicate] =
    useState(false);

  useEffect(() => {
    if (syndicates.length) {
      // Check is there is a syndicate with the same address
      const hasSyndicate = syndicates.some(
        (syndicate: Syndicate) => syndicate.managerCurrent == account,
      );

      if (hasSyndicate) {
        setManagerWithOpenSyndicate(hasSyndicate);
      } else if (!hasSyndicate) {
        // account has syndicates but isn't managing any
        // redirect to the first step of the create flow.
        resetCreateSyndicateStore();
        setCheckedForSyndicates(false);
      }
    } else if (!syndicates.length && checkedForSyndicates && !loading) {
      // account doesn't have syndicates,
      // redirect to the first step in the create flow.
      resetCreateSyndicateStore();
      setCheckedForSyndicates(false);
    }
  }, [account, syndicates]);

  // TODO: Fix this to redirect
  useEffect(() => {
    // Redirect to the syndicates page
    if (managerWithOpenSyndicate) {
      router.replace("/syndicates");
    }
  }, [managerWithOpenSyndicate, router]);

  useEffect(() => {
    // Cleanup on unmounting
    return () => {
      resetCreateSyndicateStore();
    };
  }, []);

  const closeLoader = () => {
    return;
  };

  return (
    <Layout>
      <ConnectModal
        {...{
          show: loading,
          showCloseButton: false,
          closeModal: closeLoader,
          height: "h-80",
        }}
      >
        <div className="h-3/4 flex flex-col items-center justify-center text-base">
          <Spinner height="h-16" width="w-16" />
          <p className="mt-1">Fetching syndicates, please wait...</p>
        </div>
      </ConnectModal>
      <Head title="Create - Syndicate" />
      <>
        {!account ? (
          <WalletNotConnected />
        ) : (
          <>
            <div
              id="container"
              className={
                "container mx-auto flex fixed h-screen justify-between w-full" +
                `${showSuccessView ? " md:-mt-32 -mt-28" : ""}`
              }
            >
              {showSuccessView ? (
                <SuccessCreateSyndicate account={account} />
              ) : (
                <>
                  <div
                    id="left-columnm"
                    className="flex-1 w-1/6m flex p-1 pr-1 mr-8"
                  >
                    <Steps
                      steps={steps}
                      currentStep={currentStep}
                      currentSubStep={currentSubStep}
                      disableConfirmClick={!depositTokenAddress}
                    />
                  </div>

                  <MainContent>
                    <div
                      id="main-content"
                      className="flex-1 flex overflow-y-auto justify-between h-full no-scroll-bar"
                    >
                      {/* Displays component in step or substep */}
                      {steps?.[currentStep]?.component
                        ? steps?.[currentStep]?.component
                        : steps?.[currentStep]?.subSteps?.[currentSubStep]
                            ?.component}
                    </div>
                  </MainContent>

                  {/* Content info */}
                  <ContentInfo>
                    {steps?.[currentStep]?.component
                      ? steps?.[currentStep]?.contentInfo
                      : steps?.[currentStep]?.subSteps?.[currentSubStep]
                          ?.contentInfo}
                  </ContentInfo>
                </>
              )}
            </div>
            {!showSuccessView ? <Controls /> : null}
          </>
        )}
      </>
    </Layout>
  );
};

export default CreateSyndicate;
