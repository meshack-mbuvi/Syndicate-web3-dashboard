import { Spinner } from "@/components/shared/spinner";
import {
  confirmWalletSubText,
  confirmWalletText,
} from "@/components/syndicates/shared/Constants";
import React from "react";
import TransactionStateModal from "../shared";

interface Props {
  show: boolean;
}
/**
 * This is a modal that shows different transaction states
 * @returns an html node in a form of a modal
 */
export const ConfirmStateModal = (props: Props) => {
  return (
    <TransactionStateModal {...props}>
      <>
        <div className="flex flex-col justify-center m-auto mb-4">
          <Spinner />

          <div className="modal-header mb-4 font-medium text-center leading-8 text-lg">
            {confirmWalletText}
          </div>
          <div className="flex flex-col justify-center m-auto mb-4">
            <p className="text-sm text-center mx-8 opacity-60">
              {confirmWalletSubText}
            </p>
          </div>
        </div>
      </>
    </TransactionStateModal>
  );
};

export default ConfirmStateModal;
