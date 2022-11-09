import { amplitudeLogger, Flow } from '@/components/amplitude';
import { COLLECTIVE_CREATION } from '@/components/amplitude/eventNames';
import Modal, { ModalStyle } from '@/components/modal';
import { Spinner } from '@/components/shared/spinner';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { B2, H4 } from '@/components/typography';
import {
  useCreateState,
  useSubmitToContracts
} from '@/hooks/collectives/useCreateCollective';
import {
  setCollectiveTransactionError,
  setCollectiveTransactionTakingTooLong,
  setIpfsError
} from '@/state/createCollective/slice';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

interface Props {
  handleReSubmit: () => void;
}

const CreateCollectiveModals: FC<Props> = ({ handleReSubmit }) => {
  const dispatch = useDispatch();
  const { creationStatus } = useCreateState();
  const { submit: submitToContracts } = useSubmitToContracts();

  const [showModal, setShowModal] = useState(false);
  const [processingModalTitle, setProcessingModalTitle] = useState('');
  const [processingModalDescription, setProcessingModalDescription] =
    useState('');

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalTitle, setErrorModalTitle] = useState('');

  useEffect(() => {
    if (creationStatus.submittingToIPFS) {
      setProcessingModalTitle('Processing');
      setProcessingModalDescription('');
      setShowModal(true);
    }
    if (creationStatus.waitingForConfirmation) {
      setProcessingModalTitle('Confirm in Wallet');
      setProcessingModalDescription(
        'Confirm the collective creation in your wallet'
      );
      setShowModal(true);
    }
    if (creationStatus.confirmed) {
      setProcessingModalTitle('Creating Collective');
      setProcessingModalDescription(
        'This could take a little while. You can safely leave this page while you wait. Once complete, your Collective will appear in your dashboard.'
      );
      setShowModal(true);
    }
    if (creationStatus.transactionTakingTooLong) {
      setProcessingModalTitle('Transaction is taking a while');
      setProcessingModalDescription(
        'The network is busy, so this may take a while. Your wallet can speed up this transaction. Once complete, your Collective will appear in your dashboard.'
      );
      setShowModal(true);
    }
    if (creationStatus.transactionSuccess) {
      setShowModal(false);
      amplitudeLogger(COLLECTIVE_CREATION, {
        flow: Flow.COLLECTIVE_CREATE,
        transaction_status: 'Success'
      });
    }
  }, [
    creationStatus.waitingForConfirmation,
    creationStatus.submittingToIPFS,
    creationStatus.confirmed
  ]);

  useEffect(() => {
    if (creationStatus.ipfsError) {
      setErrorModalTitle('Media Upload Failed');
      setShowErrorModal(true);
      setShowModal(false);
      amplitudeLogger(COLLECTIVE_CREATION, {
        flow: Flow.COLLECTIVE_CREATE,
        transaction_status: 'Failure'
      });
    }
    if (creationStatus.transactionError) {
      setErrorModalTitle('Collective Creation Failed');
      setShowErrorModal(true);
      setShowModal(false);
      amplitudeLogger(COLLECTIVE_CREATION, {
        flow: Flow.COLLECTIVE_CREATE,
        transaction_status: 'Failure'
      });
    }
  }, [creationStatus.ipfsError, creationStatus.transactionError]);

  const handleCloseErrorModal = () => {
    if (creationStatus.ipfsError) {
      dispatch(setIpfsError(false));
    }
    if (creationStatus.transactionError) {
      dispatch(setCollectiveTransactionError(false));
    }
    setShowErrorModal(false);
  };

  const handleRetry = () => {
    if (creationStatus.ipfsError) {
      dispatch(setIpfsError(false));
      setShowErrorModal(false);
      handleReSubmit();
    }
    if (creationStatus.transactionError) {
      dispatch(setCollectiveTransactionError(false));
      setShowErrorModal(false);
      submitToContracts();
    }
  };

  return (
    <>
      {/* Waiting for confirmation Modal */}
      <Modal
        show={showModal}
        modalStyle={ModalStyle.DARK}
        showCloseButton={creationStatus.transactionTakingTooLong}
        customWidth="w-11/12 md:w-1/2 lg:w-1/3 max-w-120"
        // passing empty string to remove default classes
        customClassName=""
        closeModal={() => {
          setShowModal(false);
          dispatch(setCollectiveTransactionTakingTooLong(false));
        }}
      >
        {/* -mx-4 is used to revert the mx-4 set on parent div on the modal */}
        <div className="flex flex-col justify-center py-10 -mx-4 px-8">
          {/* passing empty margin to remove the default margin set on spinner */}
          <Spinner height="h-16" width="w-16" margin="" />
          {/* <p className="text-xl text-center mt-10 mb-4 leading-4 text-white font-whyte"></p> */}
          <H4 extraClasses="text-center mt-10 mb-4 leading-4 text-white">
            {processingModalTitle}
          </H4>
          <B2 extraClasses="text-center leading-5 text-gray-lightManatee">
            {processingModalDescription}
          </B2>

          {creationStatus.transactionHash ? (
            <div className="flex justify-center mt-4">
              <BlockExplorerLink
                resourceId={creationStatus.transactionHash}
                resource="transaction"
              />
            </div>
          ) : null}
        </div>
      </Modal>

      {/* Error modal */}
      <Modal
        show={showErrorModal}
        modalStyle={ModalStyle.DARK}
        closeModal={handleCloseErrorModal}
        showCloseButton={false}
        outsideOnClick={true}
        customWidth="w-11/12 md:w-1/2 xl:w-1/3 max-w-120"
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
            {errorModalTitle}
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
            {creationStatus.transactionError &&
            creationStatus.transactionHash ? (
              <div className="mt-6">
                <BlockExplorerLink
                  resourceId={creationStatus.transactionHash}
                  resource="transaction"
                />
              </div>
            ) : null}
            <div className="mt-7 mb-10">
              <button
                type="button"
                className="bg-white rounded-custom text-black py-4 w-full px-8"
                onClick={handleRetry}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateCollectiveModals;
