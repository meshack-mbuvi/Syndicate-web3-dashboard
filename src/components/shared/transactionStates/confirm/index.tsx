import { Spinner } from '@/components/shared/spinner';
import { confirmWalletText } from '@/components/syndicates/shared/Constants';
import React from 'react';
import TransactionStateModal from '../shared';

interface Props {
  show: boolean;
  spinnerHeight?: string;
  spinnerWidth?: string;
  modalStyle?: string;
  width?: string;
}
/**
 * This is a modal that shows different transaction states
 * @returns an html node in a form of a modal
 */
export const ConfirmStateModal: React.FC<Props> = (props) => {
  const { children, spinnerHeight, spinnerWidth, modalStyle, width, ...rest } =
    props;
  return (
    <TransactionStateModal {...rest} modalStyle={modalStyle} width={width}>
      <>
        <div className="flex flex-col justify-center m-auto mb-4">
          <Spinner height={spinnerHeight} width={spinnerWidth} />

          <div className="modal-header mb-4 font-medium text-center leading-8 text-lg">
            {confirmWalletText}
          </div>
          {children}
        </div>
      </>
    </TransactionStateModal>
  );
};

export default ConfirmStateModal;
