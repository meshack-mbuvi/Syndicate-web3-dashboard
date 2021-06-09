import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import React from "react";
import Button from "src/components/buttons";
import TransactionStateModal from "../shared";

interface Props {
  show: boolean;
  handleCloseModal: Function;
  icon: any;
  buttonText: string;
  feedbackText?: string;
  headerText?: string;
  address: string;
}

/**
 * This is a modal that shows different transaction states
 * @returns an html node in a form of a modal
 */
export const FinalStateModal = (props: Props) => {
  const {
    handleCloseModal,
    icon,
    buttonText,
    feedbackText,
    headerText,
    address,
    ...rest
  } = props;

  return (
    <TransactionStateModal {...rest}>
      <>
        <div className="flex flex-col justify-center m-auto mb-4">
          <div className="flex justify-center my-5">
            <img src={icon} className="w-14" />
          </div>

          {headerText ? (
            <p className="modal-header mb-4 font-medium text-center leading-8s text-lg">
              {headerText}
            </p>
          ) : null}

          {feedbackText ? (
            <p className="mb-4 text-center font-whyte text-sm mx-6">
              {feedbackText}
            </p>
          ) : null}

          {address ? (
            <div className="flex justify-center">
              <EtherscanLink contractAddress={address} />
            </div>
          ) : (
            ""
          )}

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
