import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/layout";
import WalletNotConnected from "@/components/walletNotConnected";
import { MainContent } from "@/containers/create/shared";
import InvestmentClubCTAs from "@/containers/create/shared/controls/investmentClubCTAs";
import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Head from "@/components/syndicates/shared/HeaderTitle";
import ReviewDetails from "@/containers/createInvestmentClub/reviewDetails";
import { useEffect, useRef } from "react";
import Modal, { ModalStyle } from "@/components/modal";
import { Spinner } from "@/components/shared/spinner";

const CreateInvestmentClub: React.FC = () => {
  const {
    steps,
    currentStep,
    animationsRefs: { setParentRef },
    waitingConfirmationModal,
    transactionModal,
    errorModal,
    setShowModal,
  } = useCreateInvestmentClubContext();

  const parentRef = useRef(null);

  useEffect(() => {
    if (parentRef) {
      setParentRef(parentRef);
    }
  }, [parentRef]);

  const {
    web3Reducer: { web3 },
    createInvestmentClubSliceReducer: {
      clubCreationStatus: { creationReceipt: { token } },
    },
  } = useSelector((state: RootState) => state);

  const { account } = web3;

  return (
    <Layout>
      <Head title="Create Investment Club - Syndicate" />
      <>
        {!account ? (
          <WalletNotConnected />
        ) : (
          <div className="container mx-auto w-full">
            <div className="h4 text-center pb-16">
              Create an investment club
            </div>
            <div className="flex justify-center w-full ">
              <div className="hidden lg:block flex-1 w-1/4" />
              <div className="w-full lg:w-3/4">
                <MainContent>
                  <div className="flex-grow flex overflow-y-auto justify-between h-full no-scroll-bar">
                    <div className="flex flex-col w-full" ref={parentRef}>
                      <ReviewDetails />
                      {steps[currentStep].component}
                      <div className="w-full lg:w-2/3">
                        <InvestmentClubCTAs />
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
        customWidth="w-1/3"
        // passing empty string to remove default classes
        customClassName=""
      >
        {/* -mx-4 is used to revert the mx-4 set on parent div on the modal */}
        <div className="flex flex-col justify-center py-10 -mx-4 px-8">
          {/* passing empty margin to remove the default margin set on spinner */}
          <Spinner height="h-16" width="w-16" margin="" />
          <p className="text-xl text-center mt-10 mb-4 leading-4 text-white font-whyte">
            Waiting for confirmation
          </p>
          <div className="font-whyte text-center leading-5 text-base text-gray-lightManatee">
            Please confirm the creation of this investment club in your wallet
          </div>
        </div>
      </Modal>

      {/* Transaction submitted Modal */}
      <Modal
        show={transactionModal}
        modalStyle={ModalStyle.DARK}
        showCloseButton={false}
        customWidth="w-1/3"
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
              Transaction submitted
            </p>
          </div>
          <div className="self-center pt-6 pb-3">
            <Link href={`/syndicates/${token}/manage`}>
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
        outsideOnClick={true}
        customWidth="w-1/3"
      >
        <div className="flex flex-col justify-center py-10 -mx-4 px-8">
          <Image
            src={"/images/errorClose.svg"}
            alt="Error image"
            height="64"
            width="64"
            className="m-auto"
          />
          <p className="text-lg text-center mt-8 mb-1">Error</p>
          <div className="modal-header font-medium text-center leading-8 text-sm text-blue-rockBlue">
            {/* TODO: no designs for this */}
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default CreateInvestmentClub;
