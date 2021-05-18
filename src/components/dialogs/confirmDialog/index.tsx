//import { SyndicateCannotBeReopenedOnceClosedText } from "@/components/syndicates/shared/Constants";
import React from "react";
import { Modal } from "src/components/modal";

interface ConfirmDialogProps {
  titleText: string;
  confirmationWarning: string;
  closeModal: Function;
  cancelActionButtonhandler: Function;
  confirmButtonText: string;
  cancelButtonText: string;
  confirmActionButtonhandler: Function;
  show: boolean;
}
/**
 * This is a generic component that shows a customised confirmation dialog modal
 *  with two buttons
 * namely: cancel and confirm buttons.
 * Clicking cancel button calls the function handling action cancellation while
 * confirm button handles function confirming execution of the specified action.
 * @param {} props an object containing properties required by this component
 * @returns
 */
export const ConfirmDialog = (props: ConfirmDialogProps) => {
  const {
    confirmationWarning,
    closeModal,
    cancelActionButtonhandler,
    confirmButtonText,
    cancelButtonText,
    titleText,
    confirmActionButtonhandler,
    show,
  } = props;

  /**
   * Handle cancellation of the action and close the modal dialog
   */
  const handleCancelButton = () => {
    closeModal();
    cancelActionButtonhandler();
  };

  /**
   * Handle cancellation of the action and close the modal dialog
   */
  const handleConfirmButton = () => {
    closeModal();
    confirmActionButtonhandler();
  };

  return (
    <Modal title={titleText} show={show} closeModal={closeModal}>
      <div className="bg-white top-1/2 left-1/2">
        <div className="my-8 font-medium text-center leading-8 text-lg">
          <p>
            <strong>Important: </strong>
            {confirmationWarning}
          </p>
        </div>
        <div className="flex justify-between mt-8">
          <button
            className={`flex items-center justify-center text-base font-medium rounded-md focus:outline-none focus:ring border px-3 text-gray-500 w-40`}
            onClick={handleCancelButton}>
            {cancelButtonText}
          </button>

          <button
            className="flex items-center justify-center text-base font-medium rounded-md focus:outline-none focus:ring border px-3 py-3 bg-red-700 text-white w-40"
            onClick={handleConfirmButton}>
            {confirmButtonText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
