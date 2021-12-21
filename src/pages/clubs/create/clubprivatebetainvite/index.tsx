import Layout from "@/components/layout";
import Modal, { ModalStyle } from "@/components/modal";
import { Spinner } from "@/components/shared/spinner";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import Head from "@/components/syndicates/shared/HeaderTitle";
import WalletNotConnected from "@/components/walletNotConnected";
import { MainContent } from "@/containers/create/shared";
import InvestmentClubCTAs from "@/containers/create/shared/controls/investmentClubCTAs";
import ByInvitationOnly from "@/containers/createInvestmentClub/byInvitationOnly";
import GettingStarted from "@/containers/createInvestmentClub/gettingStarted";
import ReviewDetails from "@/containers/createInvestmentClub/reviewDetails";
import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import useClubERC20s from "@/hooks/useClubERC20s";
import { AppState } from "@/state";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const CreateInvestmentClub: React.FC = () => {
  const {
    steps,
    currentStep,
    waitingConfirmationModal,
    transactionModal,
    processingModalTitle,
    processingModalDescription,
    errorModal,
    setShowModal,
    handleCreateInvestmentClub,
    preClubCreationStep,
    setPreClubCreationStep,
  } = useCreateInvestmentClubContext();
  const router = useRouter();

  const { accountHasClubs } = useClubERC20s();

  // Redirect to portfolio if user has clubs
  useEffect(() => {
    if (accountHasClubs) {
      router.replace("/clubs");
    }
  }, [accountHasClubs, router.isReady]);

  const parentRef = useRef(null);

  const {
    web3Reducer: { web3 },
    createInvestmentClubSliceReducer: {
      clubCreationStatus: {
        creationReceipt: { tokenAddress },
        transactionHash,
      },
    },
  } = useSelector((state: AppState) => state);

  const { account } = web3;

  return (
    <Layout>
      <Head title="Create Investment Club" />
      <>
        {!account ? (
          <WalletNotConnected />
        ) : preClubCreationStep ? (
          preClubCreationStep === "invite" ? (
            <ByInvitationOnly setClubStep={setPreClubCreationStep} />
          ) : (
            <GettingStarted setClubStep={setPreClubCreationStep} />
          )
        ) : (
          <div className="container mx-auto w-full">
            <div
              className={`h4 text-center ${
                currentStep === 0 ? "" : "pb-16"
              } pt-11`}
            >
              Create an investment club
            </div>
            <div className="flex justify-center w-full ">
              <div className="hidden lg:block flex-1 w-1/4" />
              <div className="w-full lg:w-3/4">
                <MainContent>
                  <div className="flex-grow flex overflow-y-auto justify-between h-full no-scroll-bar px-1">
                    <div className="flex flex-col w-full" ref={parentRef}>
                      <ReviewDetails />
                      {steps[currentStep].component}
                      <div className="w-full lg:w-2/3">
                        <InvestmentClubCTAs key={currentStep} />
                      </div>
                    </div>
                  </div>
                </MainContent>
              </div>
            </div>
          </div>
        )}
      </>

      {/* Waiting for confirmation Modal */}
      <Modal
        show={waitingConfirmationModal}
        modalStyle={ModalStyle.DARK}
        showCloseButton={false}
        customWidth="w-11/12 md:w-1/2 lg:w-1/3"
        // passing empty string to remove default classes
        customClassName=""
      >
        {/* -mx-4 is used to revert the mx-4 set on parent div on the modal */}
        <div className="flex flex-col justify-center py-10 -mx-4 px-8">
          {/* passing empty margin to remove the default margin set on spinner */}
          <Spinner height="h-16" width="w-16" margin="" />
          <p className="text-xl text-center mt-10 mb-4 leading-4 text-white font-whyte">
            {processingModalTitle}
          </p>
          <div className="font-whyte text-center leading-5 text-base text-gray-lightManatee">
            {processingModalDescription}
          </div>

          {transactionHash ? (
            <div className="flex justify-center mt-4">
              <EtherscanLink
                etherscanInfo={transactionHash}
                text="View on Etherscan"
                type="transaction"
              />
            </div>
          ) : null}
        </div>
      </Modal>

      {/* Transaction submitted Modal */}
      <Modal
        show={transactionModal}
        modalStyle={ModalStyle.DARK}
        showCloseButton={false}
        customWidth="w-11/12 md:w-1/2 lg:w-1/3"
        // passing empty string to remove default classes
        customClassName=""
      >
        {/* -mx-4 is used to revert the mx-4 set on parent div on the modal */}
        <div className="flex flex-col py-10 -mx-4 px-8">
          {/* passing empty margin to remove the default margin set on spinner */}
          <div className="flex flex-col justify-center">
            <Image
              height="64"
              width="64"
              className="m-auto"
              src="/images/checkCircleGreen.svg"
              alt=""
            />
            <p className="text-xl text-center mt-10 mb-6 leading-4 text-white font-whyte">
              Club Successfully Created
            </p>
          </div>
          <div className="self-center pt-6 pb-3">
            <Link href={`/clubs/${tokenAddress}/manage?source=create`}>
              <span className="px-8 py-4 bg-white rounded-md text-black text-center text-base cursor-pointer self-center w-1/2">
                View club dashboard
              </span>
            </Link>
          </div>
        </div>
      </Modal>

      {/* Error modal */}
      <Modal
        show={errorModal}
        modalStyle={ModalStyle.DARK}
        closeModal={() =>
          setShowModal(() => ({
            waitingConfirmationModal: false,
            transactionModal: false,
            errorModal: false,
          }))
        }
        showCloseButton={false}
        outsideOnClick={true}
        customWidth="w-11/12 md:w-1/2 lg:w-1/3"
        customClassName="p-0"
        showHeader={false}
      >
        <div>
          <div className="flex justify-center items-center w-full mt-10 mb-8">
            <Image
              width={64}
              height={64}
              src={"/images/syndicateStatusIcons/transactionFailed.svg"}
              alt="failed"
            />
          </div>
          <div className="flex justify-center items-center w-full text-xl">
            Club creation failed
          </div>
          <div className="h-fit-content rounded-2-half flex justify-center items-center flex-col mt-6">
            <div>
              <p className="text-gray-syn4">
                Please try again and{" "}
                <a
                  className="text-blue"
                  href="mailto:support@syndicate.io"
                  target="_blank"
                  rel="noreferrer"
                >
                  let us know
                </a>{" "}
                if the issue persists.
              </p>
            </div>
            {transactionHash ? (
              <div className="mt-6">
                <EtherscanLink
                  etherscanInfo={transactionHash}
                  text="View on Etherscan"
                  type="transaction"
                />
              </div>
            ) : null}
            <div className="mt-7 mb-10">
              <button
                type="button"
                className="bg-white rounded-custom text-black py-4 w-full px-8"
                onClick={handleCreateInvestmentClub}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default CreateInvestmentClub;
