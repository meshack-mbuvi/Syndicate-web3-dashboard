import React from "react";
import Modal from "@/components/modal";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import { Spinner } from "@/components/shared/spinner";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { EtherscanLink } from "../EtherscanLink";

const ProcessingModal: React.FC = () => {
  const { modalInfo } = useCreateSyndicateContext();

  const {
    showProcessingModal,
    setShowProcessingModal,
    transactionsCount,
    currentTransaction,
    processingModalMessage,
    showErrorMessage,
    errorMessage,
    currentTxHash,
    processingModalTitle,
    setShowErrorMessage,
  } = modalInfo;

  // when the close button is clicked on the modal,
  // the error state needs to be reset as well.
  const closeProcessingModal = () => {
    // dismiss error first
    setShowErrorMessage(false);
    setShowProcessingModal(false);
  };

  return (
    <Modal
      {...{
        show: showProcessingModal,
        closeModal: () => closeProcessingModal(),
        customClassName: "bg-gray-blackRussian text-white",
        showCloseButton: showErrorMessage,
        outsideOnClick: showErrorMessage,
        closeButtonClassName: "text-white",
      }}
    >
      <div className="flex flex-col justify-center items-center m-auto mb-12">
        {currentTransaction > 1 && transactionsCount > 0 ? (
          <div className="mb-4 flex-shrink-0 h-6 relative flex items-center justify-center text-blue-rockBlue text-center text-sm">
            <CheckCircleIcon className="h-full" />
            <span className="ml-2">First transaction confirmed</span>
          </div>
        ) : null}
        {/* Show loading icon */}
        {!showErrorMessage ? <Spinner height="h-16" width="w-16" /> : null}
        {/* Show error icon */}
        {showErrorMessage ? (
          <div className="flex flex-col items-center justify-center mt-7">
            <img
              className="mb-4 h-12 w-12"
              src="/images/errorClose.svg"
              alt="error"
            />
            <p className="font-semibold text-2xl text-center">
              Transaction rejected.
            </p>

            <p className="text-base my-5 font-normal text-gray-dim text-center">
              {errorMessage}
            </p>
          </div>
        ) : (
          <>
            <div className="modal-header font-medium text-center leading-8 text:lg sm:text-xl">
              <span>{processingModalTitle} &nbsp;</span>
              <span>
                {currentTransaction}/{transactionsCount}
              </span>
            </div>
            <div className="mt-4 mb-2 text-blue-rockBlue text-center text-sm sm:text-base">
              {processingModalMessage}
            </div>
            {currentTxHash ? (
              <EtherscanLink etherscanInfo={currentTxHash} type="transaction" />
            ) : null}
          </>
        )}
      </div>
    </Modal>
  );
};

export default ProcessingModal;
