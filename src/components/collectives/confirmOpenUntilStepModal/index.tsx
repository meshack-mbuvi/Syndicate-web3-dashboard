import Modal, { ModalStyle } from '@/components/modal';
import { StepsOutline } from '@/components/stepsOutline';
import { L2 } from '@/components/typography';

interface Props {
  steps: { title: string; description?: string; isInErrorState?: boolean }[];
  activeStepIndex: number;
  children: any;
  isModalVisible: boolean;
  handleModalClose: (e?: any) => void;
  showCloseButton?: boolean;
  outsideOnClick?: boolean;
}

export const OpenUntilStepModal: React.FC<Props> = ({
  steps,
  activeStepIndex,
  children,
  isModalVisible,
  handleModalClose,
  showCloseButton = false,
  outsideOnClick
}) => {
  return (
    <Modal
      show={isModalVisible}
      closeModal={handleModalClose}
      modalStyle={ModalStyle.DARK}
      customWidth="w-102"
      customClassName="pt-8"
      showHeader={false}
      outsideOnClick={outsideOnClick}
      showCloseButton={showCloseButton}
    >
      <div className="m-h-screen">
        <L2 extraClasses="mb-10 px-10">Modify collective</L2>
        <StepsOutline
          steps={steps}
          activeIndex={activeStepIndex}
          extraClasses="px-10"
        />
        <div className="px-5 pb-5">{children}</div>
      </div>
    </Modal>
  );
};
