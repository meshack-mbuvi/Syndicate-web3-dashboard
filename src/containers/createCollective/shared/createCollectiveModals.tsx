import React, { FC, useEffect, useMemo, useState } from 'react';
import Modal, { ModalStyle } from '@/components/modal';
import Image from 'next/image';
import {
  useCreateState,
  useSubmitCollective,
  useSubmitToContracts
} from '@/hooks/collectives/useCreateCollective';
import { Spinner } from '@/components/shared/spinner';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import {
  setCollectiveTransactionError,
  setIpfsError
} from '@/state/createCollective/slice';
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
  const [errorModalDescription, setErrorModalDescription] = useState('');

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
      setProcessingModalTitle('Approving');
      setProcessingModalDescription(
        'This could take anywhere from seconds to hours depending on network congestion and gas fees. You can safely leave this page while you wait.'
      );
      setShowModal(true);
    }
    if (creationStatus.transactionSuccess) {
      setShowModal(false);
    }
  }, [
    creationStatus.waitingForConfirmation,
    creationStatus.submittingToIPFS,
    creationStatus.confirmed
  ]);

  useEffect(() => {
    if (creationStatus.ipfsError) {
      setErrorModalTitle('Media Upload Failed');
      setErrorModalDescription('');
      setShowErrorModal(true);
      setShowModal(false);
    }
    if (creationStatus.transactionError) {
      setErrorModalTitle('Collective Creation Failed');
      setErrorModalDescription('');
      setShowErrorModal(true);
      setShowModal(false);
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
