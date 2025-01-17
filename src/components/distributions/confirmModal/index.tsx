import Modal, { ModalStyle } from '@/components/modal';
import { StepsOutline } from '@/components/stepsOutline';
import { L2 } from '@/components/typography';

interface Props {
  steps: { title: string; description?: string; isInErrorState?: boolean }[];
  activeStepIndex: number;
  children: JSX.Element | string;
  isModalVisible: boolean;
  handleModalClose: () => void;
  showCloseButton?: boolean;
}

export const ConfirmDistributionsModal: React.FC<Props> = ({
  steps,
  activeStepIndex,
  children,
  isModalVisible,
  handleModalClose,
  showCloseButton = false
}) => {
  return (
    <Modal
      show={isModalVisible}
      closeModal={handleModalClose}
      modalStyle={ModalStyle.DARK}
      customWidth="w-102"
      customClassName="pt-8"
      showHeader={false}
      outsideOnClick={true}
      showCloseButton={showCloseButton}
    >
      <div className="m-h-screen">
        <L2 extraClasses="mb-10 px-10">Confirm distributions</L2>
        <StepsOutline
          steps={steps}
          activeIndex={activeStepIndex}
          extraClasses="px-10"
        />
        <div className="px-5 pb-5 mt-6">{children}</div>
      </div>
    </Modal>
  );
};
