import Modal, { ModalStyle } from '../modal';
import { ExternalLinkColor } from 'src/components/iconWrappers';
import { ProgressCard, ProgressState } from '../progressCard';

export const ProgressModal = (props: {
  isVisible: boolean;
  title: string;
  description?: any;
  state: ProgressState;
  buttonLabel?: string;
  buttonFullWidth?: boolean;
  buttonOnClick?: () => void;
  transactionHash?: string;
  transactionType?: string;
  explorerLinkText?: string;
  iconcolor?: ExternalLinkColor;
  showCloseButton?: boolean;
  closeModal?: () => void;
  outsideOnClick?: boolean;
}): React.ReactElement => {
  const {
    title,
    description,
    state,
    buttonLabel,
    buttonOnClick,
    transactionHash,
    transactionType,
    isVisible = false,
    buttonFullWidth = false,
    iconcolor = ExternalLinkColor.BLUE,
    showCloseButton = false,
    closeModal,
    outsideOnClick
  } = props;

  return (
    <Modal
      show={isVisible}
      modalStyle={ModalStyle.DARK}
      showCloseButton={showCloseButton}
      closeModal={closeModal}
      outsideOnClick={outsideOnClick}
      customWidth="w-full max-w-480"
      // passing empty string to remove default classes
      customClassName=""
    >
      <div className="-mx-4">
        {/* -mx-4 is used to revert the mx-4 set on parent div on the modal */}
        <ProgressCard
          title={title}
          description={description}
          buttonLabel={buttonLabel}
          buttonOnClick={buttonOnClick}
          iconcolor={iconcolor}
          transactionHash={transactionHash}
          transactionType={transactionType}
          buttonFullWidth={buttonFullWidth}
          state={state}
        />
      </div>
    </Modal>
  );
};
