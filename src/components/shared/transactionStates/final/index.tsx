import React from "react";
import Button from "src/components/buttons";
import TransactionStateModal from "../shared";

interface Props {
  show: boolean;
  handleCloseModal: Function;
  icon: any;
  buttonText: string;
  feedbackText: string;
}

/**
 * This is a modal that shows different transaction states
 * @returns an html node in a form of a modal
 */
export const FinalStateModal = (props: Props) => {
  const { handleCloseModal, icon, buttonText, feedbackText, ...rest } = props;
  return (
    <TransactionStateModal {...rest}>
      <>
        <div className="flex flex-col justify-center m-auto mb-4">
          <div className="flex justify-center my-5">
            <img src={icon} className="w-14" />
          </div>

          <div className="modal-header mb-4 font-medium text-center leading-8 text-lg">
            {feedbackText}
          </div>
          <div className="flex justify-center my-5">
            <Button
              customClasses="bg-blue-cyan w-40 p-2 rounded-full"
              onClick={() => handleCloseModal()}>
              {buttonText}
            </Button>
          </div>
        </div>
      </>
    </TransactionStateModal>
  );
};

export default FinalStateModal;
