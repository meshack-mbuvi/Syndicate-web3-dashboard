import Modal, { ModalStyle } from '@/components/modal';

interface Props {
  isModalVisible: boolean;
  handleModalClose: () => void;
  onClick: () => void;
}

export const DistributionsDisclaimerModal: React.FC<Props> = ({
  isModalVisible,
  handleModalClose,
  onClick
}) => {
  return (
    <Modal
      show={isModalVisible}
      closeModal={handleModalClose}
      modalStyle={ModalStyle.DARK}
      customWidth="w-102"
      customClassName="pt-8"
      showHeader={false}
    >
      <div className="m-h-screen">
        <h4 className="mb-4 px-10">Distributions</h4>
        <div className="px-10 text-gray-syn4">
          I confirm that I have reviewed the distributions and had the
          opportunity to consult with legal, financial, and other advisors for
          compliance within my club&apos;s jurisdiction. Distributing proceeds
          to members who did not invest in the original asset may have adverse
          legal consequences. This distribution cannot be reversed.
        </div>
        <div className="px-10 mb-10">
          <button onClick={onClick} className="green-CTA mt-6 w-full">
            I confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};
