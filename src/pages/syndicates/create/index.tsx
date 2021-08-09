import { Syndicate } from "@/@types/syndicate";
import { Layout } from "@/components/layout";
import Steps from "@/components/syndicates/create/Steps";
import ProcessingModal from "@/components/syndicates/shared/processingModal";
import SuccessCreateSyndicate from "@/components/syndicates/shared/successCreateSyndicate";
import WalletNotConnected from "@/components/walletNotConnected";
import { ContentInfo, MainContent } from "@/containers/create/shared";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import { useSyndicateInBetaBannerContext } from "@/context/SyndicateInBetaBannerContext";
import { getSyndicates } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { ArrowNarrowLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "src/components/syndicates/shared/HeaderTitle";

const CreateSyndicate: React.FC = () => {
  const {
    steps,
    currentSubStep,
    handleBack,
    handleNext,
    buttonsDisabled,
    showSuccessView,
    currentStep,
    handleFinish,
    continueDisabled,
  } = useCreateSyndicateContext();

  const { showBanner } = useSyndicateInBetaBannerContext();

  // TODO
  // Improve this instead of hardcoding
  const lastStep = currentStep === 2;

  const firstStep = currentStep === 0;

  const hideContinueButton = currentStep > 2;

  const dispatch = useDispatch();

  const router = useRouter();

  const {
    initializeContractsReducer: { syndicateContracts },
    syndicatesReducer: { syndicates = [] },
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

  /**
   * We need to be sure syndicateContracts is initialized before retrieving events.
   */
  useEffect(() => {
    if (syndicateContracts?.GetterLogicContract) {
      dispatch(getSyndicates({ ...web3, ...syndicateContracts }));
    }
  }, [syndicateContracts?.GetterLogicContract, account]);

  // Assume by default this user has an open syndicate
  const [managerWithOpenSyndicate, setManagerWithOpenSyndicate] = useState(
    false,
  );

  useEffect(() => {
    if (syndicates) {
      // Check is there is a syndicate with the same address
      const hasSyndicate = syndicates.some(
        (syndicate: Syndicate) => syndicate.syndicateAddress == account,
      );
      setManagerWithOpenSyndicate(hasSyndicate);
    }
  }, [account, syndicates]);

  // TODO: Fix this to redirect
  useEffect(() => {
    // Redirect to the syndicates page
    if (managerWithOpenSyndicate && !showSuccessView) {
      router.replace("/syndicates");
    }
  }, [managerWithOpenSyndicate, showSuccessView]);

  const TERMS_OF_SERVICE_LINK = process.env.NEXT_PUBLIC_TERMS_OF_SERVICE_LINK;

  const handleCancel = () => {
    // Go to the syndicates page
    router.replace("/syndicates");
  };

  return (
    <Layout>
      <Head title="Create - Syndicate" />
      <>
        {!account ? (
          <WalletNotConnected />
        ) : (
          <>
            <ProcessingModal />
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
            {!showSuccessView ? (
              <div
                className={`bg-black fixed  bottom-0
           w-2/5 flex flex-col`}
              >
                <div className="relative flex mx-4 justify-between items-center border-t-1 border-gray-erieBlack h-20">
                  <button
                    className={`flex items-center px-12 py-3.5 text-gray-dim hover:text-white focus:outline-none ${
                      buttonsDisabled ? "cursor-not-allowed" : ""
                    }`}
                    onClick={firstStep ? handleCancel : handleBack}
                    disabled={buttonsDisabled}
                  >
                    <ArrowNarrowLeftIcon className="w-4" />
                    <span className="ml-2">
                      {firstStep ? " Cancel" : "Back"}
                    </span>
                  </button>
                  {!hideContinueButton ? (
                    <button
                      className={`${
                        lastStep ? "bg-green-400" : "bg-white"
                      } text-black px-12 py-3.5 rounded-lg focus:outline-none ${
                        buttonsDisabled || continueDisabled
                          ? "cursor-not-allowed opacity-70"
                          : "hover:opacity-80"
                      }`}
                      onClick={lastStep ? handleFinish : handleNext}
                      disabled={buttonsDisabled || continueDisabled}
                    >
                      {lastStep ? "Finish" : "Continue"}
                    </button>
                  ) : null}
                </div>
                {lastStep ? (
                  <div className="self-center pb-4">
                    <p className="flex text-gray-400 justify-center text-sm">
                      By creating a syndicate, you agree to the{" "}
                      <a
                        className="font-whyte text-center ml-1 font-medium  underline hover bg-light-green"
                        href={TERMS_OF_SERVICE_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        terms of service.
                      </a>
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </>
    </Layout>
  );
};

export default CreateSyndicate;
