import { useState } from 'react';
import Image from 'next/image';

import Modal, { ModalStyle } from '@/components/modal';
import { Spinner } from '@/components/shared/spinner';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { CTAButton } from '@/components/CTAButton';
import { ExternalLinkColor } from '@/components/iconWrappers';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';

const RUG_PFP_CLAIM_MODULE = process.env
  .NEXT_PUBLIC_RUG_PFP_CLAIM_MODULE as string;

export default function AllowanceModal() {
  const {
    web3Reducer: {
      web3: { account }
    },
    initializeContractsReducer: {
      syndicateContracts: { RugToken }
    }
  } = useSelector((state: AppState) => state);

  const [confirm, setConfirm] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [userRejectedTransaction] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(true);
  const [processingFailed, setProcessingFailed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transactionRejected, setTransactionRejected] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Show processing transaction when user confirms transaction on wallet.
  const onTxConfirm = () => {
    setProcessing(true);
    setConfirm(false);
  };

  const onTxReceipt = () => {
    setProcessing(false);
    setConfirm(false);
    setProcessed(true);
  };

  const onTxFail = (error: any): void => {
    const { code } = error;

    if (code == 4001) {
      setTransactionRejected(true);
    } else {
      setTransactionRejected(false);
    }

    setProcessing(false);
    setConfirm(false);
    setShowModal(false);
    setProcessed(false);
    setShowErrorModal(true);
  };

  const handleCloseErrorModal = (): void => {
    setShowErrorModal(false);
    setShowModal(false);
  };

  /**
   * Function to close transaction modal
   */
  const handleCloseSuccessModal = (): void => {
    setConfirm(false);
    setProcessing(false);
    modalContent = <></>;
    setProcessed(false);
    setProcessing(false);
    setProcessingFailed(false);
    setShowErrorModal(false);
    setShowModal(false);
  };

  const handleSetAllowance = async (event: any): Promise<void> => {
    event.preventDefault();

    setConfirm(true);
    setShowModal(true);
    await RugToken.setUnlimitedAllowance(
      account as string,
      RUG_PFP_CLAIM_MODULE,
      onTxConfirm,
      onTxReceipt,
      onTxFail,
      setTransactionHash
    );
  };

  /**
   * Modal content depending on what state the process is in.
   */
  let modalContent = (
    <div className="space-y-10">
      <div>
        <Spinner width="w-10" height="h-10" margin="m-0" />
      </div>
      <div className="space-y-4 font-whyte">
        <p className="text-center text-xl">Confirm in wallet</p>
        <p className="text-gray-syn4 text-center text-base">
          Please confirm the allowance transaction in your wallet.
        </p>
      </div>
    </div>
  );

  if (confirm) {
    modalContent = (
      <div className="space-y-10">
        <div>
          <Spinner width="w-10" height="h-10" margin="m-0" />
        </div>
        <div className="space-y-4 font-whyte">
          <p className="text-center text-xl">Confirm in wallet</p>
          <p className="text-gray-syn4 text-center text-base">
            Please confirm the allowance transaction in your wallet.
          </p>
        </div>
      </div>
    );
  } else if (processing) {
    modalContent = (
      <div className="space-y-10">
        <div>
          <Spinner width="w-10" height="h-10" margin="m-0" />
        </div>
        <div className="space-y-4 font-whyte">
          <p className="text-center text-xl">Setting allowance</p>

          <div className="text-base flex justify-center items-center hover:opacity-80">
            <BlockExplorerLink
              resourceId={transactionHash}
              resource="transaction"
              suffix=" transaction"
            />
          </div>
        </div>
      </div>
    );
  } else if (processed) {
    modalContent = (
      <div className="space-y-10">
        <div className="flex justify-center">
          <img
            className="h-16 w-16"
            src="/images/syndicateStatusIcons/checkCircleGreen.svg"
            alt="checkmark"
          />
        </div>
        <div className="space-y-4 font-whyte">
          <p className="text-center text-xl">Allowance set</p>
          <p className="text-gray-syn4 text-center text-base leading-6">
            {`You just claimed the RugRadio NFT
            successfully. It’s in your wallet.`}
          </p>
          <div className="text-base flex justify-center items-center hover:opacity-80">
            <BlockExplorerLink
              resourceId={transactionHash}
              resource="transaction"
              suffix=" transaction"
            />
          </div>
        </div>
        <CTAButton
          buttonType="button"
          fullWidth={true}
          onClick={handleCloseSuccessModal}
        >
          Done
        </CTAButton>
      </div>
    );
  } else if (processingFailed) {
    modalContent = (
      <div className="space-y-10">
        <div className="flex justify-center">
          <img
            className="h-16 w-16"
            src="/images/syndicateStatusIcons/transactionFailed.svg"
            alt="checkmark"
          />
        </div>
        <div className="space-y-4 font-whyte">
          <p className="text-center text-xl">Allowance transaction failed.</p>
          {!userRejectedTransaction ? (
            <div className="text-base flex justify-center items-center hover:opacity-80">
              <BlockExplorerLink
                resourceId={transactionHash}
                resource="transaction"
                iconcolor={ExternalLinkColor.GRAY}
              />
            </div>
          ) : (
            ''
          )}
        </div>
        <CTAButton
          fullWidth={true}
          buttonType="button"
          onClick={handleCloseSuccessModal}
        >
          Close
        </CTAButton>
      </div>
    );
  }

  return (
    <>
      <CTAButton onClick={handleSetAllowance} extraClasses="mt-4">
        Set Allowance
      </CTAButton>
      {/* Confirm, Processing */}
      <Modal
        {...{
          show: showErrorModal,
          modalStyle: ModalStyle.DARK,
          showCloseButton: false,
          customWidth: 'w-full max-w-480',
          outsideOnClick: false,
          customClassName: 'p-10',
          showHeader: false,
          overflowYScroll: false,
          overflow: 'overflow-visible'
        }}
      >
        <div
          className={`bg-red-error rounded-md bg-opacity-10 mt-4 py-6 flex flex-col justify-center px-5`}
        >
          <div className="flex justify-center items-center w-full">
            <Image
              width={48}
              height={48}
              src={'/images/syndicateStatusIcons/transactionFailed.svg'}
              alt="failed"
            />
          </div>
          <div className={`mt-4 mb-6 text-center`}>
            <span className="text-base">{`${`Transaction ${
              transactionRejected ? 'rejected' : 'failed'
            }`}`}</span>
          </div>
          <button
            className="w-full rounded-lg text-base py-4 bg-white text-black"
            onClick={handleCloseErrorModal}
          >
            Close
          </button>
        </div>
      </Modal>

      <Modal
        {...{
          show: showModal,
          modalStyle: ModalStyle.DARK,
          showCloseButton: false,
          customWidth: 'w-full max-w-480',
          outsideOnClick: false,
          customClassName: 'p-10',
          showHeader: false,
          overflowYScroll: false,
          overflow: 'overflow-visible'
        }}
      >
        {modalContent}
      </Modal>
    </>
  );
}
