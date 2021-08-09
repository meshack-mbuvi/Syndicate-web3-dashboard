import React from "react";
import Modal from "@/components/modal";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import { Spinner } from "@/components/shared/spinner";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  } = modalInfo;

  return (
    <Modal
      {...{
        show: showProcessingModal,
        closeModal: () => setShowProcessingModal(false),
        customClassName: "bg-gray-blackRussian text-white",
        showCloseButton: showErrorMessage,
        outsideOnClick: showErrorMessage,
      }}
    >
      <div className="flex flex-col justify-center items-center m-auto w-96 mb-12">
        {currentTransaction > 1 && transactionsCount > 0 ? (
          <div className="mb-4 flex-shrink-0 h-6 relative flex items-center justify-center text-blue-rockBlue text-center text-sm">
            <CheckCircleIcon className="h-full" />
            <span className="ml-2">First transaction confirmed</span>
          </div>
        ) : null}
        {/* Show loading icon */}
        {!showErrorMessage ? <Spinner /> : null}
        {/* Show error icon */}
        {showErrorMessage ? (
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size="10x"
            className="cursor-pointer h-4 text-red-500 text-7xl"
          />
        ) : null}
        {/* Show Error Message */}
        {showErrorMessage ? (
          <p className="text-red-500 text-lg">{errorMessage}</p>
        ) : (
          <>
            <div className="modal-header font-medium text-center leading-8 text-lg">
              <span>Waiting for confirmation &nbsp;</span>
              <span>
                {currentTransaction}/{transactionsCount}
              </span>
            </div>
            <div className="mt-4 text-blue-rockBlue text-center text-sm">
              {processingModalMessage}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ProcessingModal;
