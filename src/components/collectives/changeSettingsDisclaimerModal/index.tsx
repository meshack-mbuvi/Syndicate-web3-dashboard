import { CTAButton, CTAType } from '@/components/CTAButton';
import Modal, { ModalStyle } from '@/components/modal';
import { B2, L2 } from '@/components/typography';

interface Props {
  isModalVisible: boolean;
  handleModalClose: () => void;
  onClick: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => void;
}

export const ChangeSettingsDisclaimerModal: React.FC<Props> = ({
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
        <L2 extraClasses="mb-4 px-10">Change Settings</L2>
        <div className="mx-10 text-gray-syn4 h-46 overflow-y-scroll no-scroll-bar">
          <B2>
            By submitting this change, I represent that my access and use of
            Syndicate’s app and its protocol will fully comply with all
            applicable laws and regulations, including United States securities
            laws, and that I will not access or use the protocol to conduct,
            promote, or otherwise facilitate any illegal activity.
          </B2>
        </div>
        <div className="px-10 mb-10 space-y-6">
          <CTAButton
            onClick={onClick}
            fullWidth={true}
            extraClasses="mt-6"
            type={CTAType.TRANSACTIONAL}
          >
            Submit
          </CTAButton>
        </div>
      </div>
    </Modal>
  );
};
