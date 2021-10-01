import { ConnectModal } from "@/components/connectWallet/connectModal";
import Layout from "@/components/layout";
import { Spinner } from "@/components/shared/spinner";
import { useFirstRender } from "@/components/syndicates/hooks/useFirstRender";
import SuccessCreateSyndicate from "@/components/syndicates/shared/successCreateSyndicate";
import WalletNotConnected from "@/components/walletNotConnected";
import { ContentInfo } from "@/containers/create/shared";
import { TemplateMainContent } from "@/containers/create/shared/mainContent";
import TemplateControls from "@/containers/create/syndicateTemplates/templateControls";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import { useSyndicateInBetaBannerContext } from "@/context/SyndicateInBetaBannerContext";
import { withLoggedInUser } from "@/lib/withAuth";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Head from "src/components/syndicates/shared/HeaderTitle";

const CreateSyndicate: React.FC = () => {
  const {
    steps,
    templateSteps,
    currentTemplateStep,
    showSuccessView,
    hideControls,
    currentTemplateSubstep,
    resetCreateSyndicateStore,
  } = useCreateSyndicateContext();
  const firstRender = useFirstRender();

  const { showBanner } = useSyndicateInBetaBannerContext();

  const router = useRouter();

  const {
    initializeContractsReducer: { syndicateContracts },
    syndicateOffChainDataReducer: {
      createSyndicate: {
        syndicateOffChainData: { syndicateTemplateTitle },
      },
    },
    web3Reducer: { web3 },
  } = useSelector((state: RootState) => state);

  const { account } = web3;
  const [checkedForSyndicates, setCheckedForSyndicates] = useState(false);
  const [managerWithOpenSyndicate, setManagerWithOpenSyndicate] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const getSyndicates = async (GetterLogicContract: any) => {
    // get syndicate managed by connected account
    setLoading(true);
    const { isManager } = await GetterLogicContract.getManagerInfo(account);
    if (isManager) {
      setManagerWithOpenSyndicate(true);
    } else {
      setManagerWithOpenSyndicate(false);
    }
    setLoading(false);
    setCheckedForSyndicates(true);
  };

  useEffect(() => {
    if (syndicateContracts?.GetterLogicContract && !firstRender && account) {
      getSyndicates(syndicateContracts.GetterLogicContract);
    }
  }, [syndicateContracts?.GetterLogicContract, account]);

  useEffect(() => {
    // Redirect to the syndicates page
    if (managerWithOpenSyndicate) {
      router.replace("/syndicates");
    } else if (!managerWithOpenSyndicate && checkedForSyndicates) {
      router.replace("/syndicates/create");
    }
  }, [managerWithOpenSyndicate, checkedForSyndicates, account]);

  const closeLoader = () => {
    return;
  };

  useEffect(() => {
    // Cleanup on unmounting
    return () => {
      resetCreateSyndicateStore();
    };
  }, []);

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
      <Head title="Confirm everything" />
      <>
        {!account ? (
          <WalletNotConnected />
        ) : (
          <>
            <div
              id="container"
              className={
                "container mx-auto flex fixed top-0 h-screen justify-between w-full" +
                `${showSuccessView ? " md:-mt-32 -mt-28" : ""} ${
                  showBanner ? "pt-36" : "pt-24"
                }`
              }
            >
              {showSuccessView ? (
                <SuccessCreateSyndicate account={account} />
              ) : (
                <>
                  <div id="left-column" className="flex-1 w-1/6m flex p-1">
                    {/* Nav steps are not rendered on the value confirmation page or when
                    settings are being modified from the summary page, hence this check. */}

                    {/* {currentTemplateStep > 0 &&
                    !currentTemplateSubstep.length ? (
                      <TemplateNavSteps
                        templateSteps={templateSteps}
                        currentTemplateStep={currentTemplateStep}
                      />
                    ) : null} */}
                  </div>

                  <TemplateMainContent>
                    <div
                      id="main-content"
                      className="flex-grow flex overflow-y-auto justify-between h-full no-scroll-bar px-1"
                    >
                      {/* Displays component based on template step or substep*/}
                      {currentTemplateSubstep.length
                        ? steps?.[currentTemplateSubstep[0]].subSteps?.[
                            currentTemplateSubstep[1]
                          ].component
                        : templateSteps?.[currentTemplateStep]?.component
                        ? templateSteps?.[currentTemplateStep]?.component
                        : null}
                    </div>
                    {!showSuccessView && syndicateTemplateTitle ? (
                      !hideControls ? (
                        <TemplateControls />
                      ) : null
                    ) : null}
                  </TemplateMainContent>

                  {/* Content info */}
                  <ContentInfo>
                    {currentTemplateSubstep.length
                      ? steps?.[currentTemplateSubstep[0]].subSteps?.[
                          currentTemplateSubstep[1]
                        ].contentInfo
                      : templateSteps?.[currentTemplateStep]?.contentInfo
                      ? templateSteps?.[currentTemplateStep]?.contentInfo
                      : null}
                  </ContentInfo>
                </>
              )}
            </div>
          </>
        )}
      </>
    </Layout>
  );
};

export default withLoggedInUser(CreateSyndicate);
