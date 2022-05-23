import Layout from '@/components/layout';
import Modal, { ModalStyle } from '@/components/modal';
import { Spinner } from '@/components/shared/spinner';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import Head from '@/components/syndicates/shared/HeaderTitle';
import InvestmentClubCTAs from '@/containers/create/shared/controls/investmentClubCTAs';
import WalletWarnings from '@/containers/createInvestmentClub/walletWarnings';
import GettingStarted from '@/containers/createInvestmentClub/gettingStarted';
import ReviewDetails from '@/containers/createInvestmentClub/reviewDetails';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { AppState } from '@/state';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import AddToCalendar from '@/components/addToCalendar';
import { setDispatchCreateFlow } from '@/state/wallet/actions';

const CreateInvestmentClub: React.FC = () => {
  const {
    steps,
    currentStep,
    waitingConfirmationModal,
    transactionModal,
    processingModalTitle,
    processingModalDescription,
    errorModal,
    warningModal,
    setShowModal,
    handleCreateInvestmentClub,
    preClubCreationStep,
    setPreClubCreationStep
  } = useCreateInvestmentClubContext();

  const parentRef = useRef(null);

  const {
    createInvestmentClubSliceReducer: {
      investmentClubName,
      mintEndTime: { value: endMintTime },
      clubCreationStatus: {
        creationReceipt: { tokenAddress },
        transactionHash
      }
    },
    web3Reducer: {
      dispatchCreateFlow,
      web3: { account, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const formattedDate = moment(endMintTime * 1000).format(
    'dddd, MMM Do YYYY, h:mm A'
  );

  const calEvent = {
    title: `${investmentClubName} closes to deposits on Syndicate`,
    description: '',
    startTime: endMintTime * 1000,
    endTime: moment(endMintTime * 1000)
      .add(1, 'days')
      .valueOf(),
    location: ''
  };

  useEffect(() => {
    if (dispatchCreateFlow && account) {
      setShowModal((prev) => ({
        ...prev,
        warningModal: true
      }));
    }
  }, [dispatchCreateFlow, account]);

  return (
    <Layout>
      <Head title="Create Investment Club" />
      <>
        {preClubCreationStep ? (
          <GettingStarted setClubStep={setPreClubCreationStep} />
        ) : (
          <div className="container mx-auto w-full">
            <h4
              className={`text-center ${
                currentStep === 0 ? '' : 'pb-11'
              } pt-11`}
            >
              Create an investment club
            </h4>
            <div className="flex justify-center w-full ">
              <div className="w-full h-full overflow-y-scroll">
                <div className="flex-grow flex overflow-y-auto overflow-x-hidden justify-between max-w-480 mx-auto h-full no-scroll-bar">
                  <div className="flex flex-col w-full" ref={parentRef}>
                    <ReviewDetails />
                    {steps[currentStep].component}
                    <div className="w-full">
                      <InvestmentClubCTAs key={currentStep} />
                    </div>
                  </div>
                </div>
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
              <BlockExplorerLink
                resourceId={transactionHash}
                resource="transaction"
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
            <p className="text-xl text-center mt-8 mb-2 leading-4 text-white font-whyte">
              Welcome on-chain, {investmentClubName}
            </p>
            <p className="text-sm text-center mb-6 text-white font-whyte">
              Accepting deposits until {formattedDate}
            </p>
            <div className="flex justify-center mb-6 text-sm text-center leading-4 text-blue-navy font-whyte ml-2">
              <AddToCalendar calEvent={calEvent} />
            </div>
          </div>
          <div className="self-center pt-6 pb-3">
            <Link
              href={`/clubs/${tokenAddress}/manage?source=create${
                '&network=' + activeNetwork.chainId
              }`}
            >
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
            warningModal: false
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
              src={'/images/syndicateStatusIcons/transactionFailed.svg'}
              alt="failed"
            />
          </div>
          <div className="flex justify-center items-center w-full text-xl">
            Club creation failed
          </div>
          <div className="h-fit-content rounded-2-half flex justify-center items-center flex-col mt-6">
            <div>
              <p className="text-gray-syn4 px-6-percent md:px-0 text-center md:text-left">
                Please try again and{' '}
                <a
                  className="text-blue outline-none"
                  href="mailto:support@syndicate.io"
                  target="_blank"
                  rel="noreferrer"
                >
                  let us know
                </a>{' '}
                if the issue persists.
              </p>
            </div>
            {transactionHash ? (
              <div className="mt-6">
                <BlockExplorerLink
                  resourceId={transactionHash}
                  resource="transaction"
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

      {/* Wallet warning modals */}
      <Modal
        show={warningModal}
        modalStyle={ModalStyle.DARK}
        closeModal={() => {
          setShowModal(() => ({
            waitingConfirmationModal: false,
            transactionModal: false,
            errorModal: false,
            warningModal: false
          }));
          dispatch(setDispatchCreateFlow(false));
        }}
        showCloseButton={false}
        outsideOnClick={true}
        customWidth="w-11/12 sm:w-100 md:w-1/2 lg:w-100"
        customClassName="py-8 px-10"
        showHeader={false}
      >
        <WalletWarnings />
      </Modal>
    </Layout>
  );
};

export default CreateInvestmentClub;
