import React from "react";
import Modal, { ModalStyle } from "@/components/modal";
import { DepositTokenSelect } from "@/containers/createInvestmentClub/shared/DepositTokenSelect";

interface ITokenModal {
  showModal: boolean;
  closeModal: any;
}

const TokenSelectModal: React.FC<ITokenModal> = ({ showModal, closeModal }) => {
  return (
    <Modal
      modalStyle={ModalStyle.DARK}
      show={showModal}
      closeModal={() => closeModal()}
      customWidth="sm:w-564 w-full"
      customClassName="p-0"
      showCloseButton={false}
      outsideOnClick={true}
      showHeader={false}
      overflow="overflow-x-visible"
      overflowYScroll={false}
      isMaxHeightScreen={false}
      alignment="align-top"
      margin="mt-48"
    >
      <DepositTokenSelect toggleTokenSelect={closeModal} />
    </Modal>
  );
};

export default TokenSelectModal;
