import Modal from "@/components/modal";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface Props {
  show: boolean;
  handleClose: () => void;
  errorMessage: string;
}

export const ErrorModal = (props: Props) => {
  const { show, handleClose, errorMessage } = props;
  return (
    <Modal
      {...{
        show,
        closeModal: () => handleClose(),
      }}
    >
      <div className="flex justify-center m-auto mb-4">
        <div className="modal-header mb-4 flex-col font-medium text-center flex justify-center leading-8 text-lg">
          <div className="w-full flex justify-center mb-4">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              size="10x"
              className="cursor-pointer h-4 text-red-500 text-7xl"
            />
          </div>
          <p className="text-red-500 text-lg">{errorMessage}</p>
        </div>
      </div>
    </Modal>
  );
};
