import Modal, { ModalStyle } from '@/components/modal';
import React from 'react';
import { NFTChecker } from '../shared/NFTchecker';

export const ClaimCheckModal: React.FC = () => {
  return (
    <Modal
      {...{
        show: true,
        modalStyle: ModalStyle.DARK,
        showCloseButton: false,
        customWidth: 'w-full max-w-480',
        outsideOnClick: false,
        showHeader: false,
        closeModal: () => console.log('Does not close'),
        overflowYScroll: false,
        customClassName: 'p-8 pt-6',
        overflow: 'overflow-visible'
      }}
    >
      <NFTChecker />
    </Modal>
  );
};
