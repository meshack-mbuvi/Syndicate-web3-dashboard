import { Spinner } from "@/components/shared/spinner";
import { loaderSubtext } from "@/components/syndicates/shared/Constants";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import React from "react";
import TransactionStateModal from "../shared";

interface Props {
  show: boolean;
  feedbackText: string;
  syndicateAddress: string;
}
/**
 * This is a modal that shows different transaction states
 * @returns an html node in a form of a modal
 */
export const PendingStateModal = (props: Props) => {
  const { feedbackText, syndicateAddress, ...rest } = props;

  return (
    <TransactionStateModal {...rest}>
      <>
        <div className="flex flex-col justify-center m-auto mb-4">
          <Spinner />

          <div className="modal-header mb-4 font-medium text-center leading-8 text-lg">
            {feedbackText}
          </div>
          <div className="flex flex-col justify-center m-auto mb-4">
            <p className="text-sm text-center mx-8 opacity-60">
              {loaderSubtext}
            </p>
          </div>
          <div className="flex justify-center">
            <EtherscanLink contractAddress={syndicateAddress} />
          </div>
        </div>
      </>
    </TransactionStateModal>
  );
};

export default PendingStateModal;
