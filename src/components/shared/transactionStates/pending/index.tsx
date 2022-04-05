import { Spinner } from '@/components/shared/spinner';
import React from 'react';
import TransactionStateModal from '../shared';

interface Props {
  show: boolean;
}
/**
 * This is a modal that shows different transaction states
 * @returns an html node in a form of a modal
 */
export const PendingStateModal: React.FC<Props> = (props) => {
  const { children, ...rest } = props;

  return (
    <TransactionStateModal {...rest}>
      <>
        <div className="flex flex-col justify-center m-auto mb-4">
          <Spinner />

          {children}
        </div>
      </>
    </TransactionStateModal>
  );
};

export default PendingStateModal;
