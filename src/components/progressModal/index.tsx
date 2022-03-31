import { EtherscanLink } from '@/components/syndicates/shared/EtherscanLink';
import Modal, { ModalStyle } from '../modal';
import { Spinner } from '../shared/spinner';
import { ExternalLinkColor } from 'src/components/iconWrappers';

export enum ProgressModalState {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  CONFIRM = 'CONFIRM'
}

export const ProgressModal = (props: {
  isVisible: boolean;
  title: string;
  description?: any;
  state: ProgressModalState;
  buttonLabel?: string;
  buttonFullWidth?: boolean;
  buttonOnClick?: () => void;
  etherscanHash?: string;
  transactionType?: string;
  etherscanLinkText?: string;
  iconColor?: ExternalLinkColor;
}): React.ReactElement => {
  const {
    title,
    description,
    state,
    buttonLabel,
    buttonOnClick,
    etherscanHash,
    transactionType,
    isVisible = false,
    buttonFullWidth = false,
    etherscanLinkText = 'View on Etherscan',
    iconColor = ExternalLinkColor.BLUE
  } = props;

  let icon;
  switch (state) {
    case ProgressModalState.CONFIRM:
      icon = <Spinner height="h-16" width="w-16" margin="" strokeWidth="5" />;
      break;

    case ProgressModalState.PENDING:
      icon = <Spinner height="h-16" width="w-16" margin="" strokeWidth="5" />;
      break;

    case ProgressModalState.SUCCESS:
      icon = (
        <img
          height="64"
          width="64"
          className="m-auto"
          src="/images/checkCircleGreen.svg"
          alt=""
        />
      );
      break;

    case ProgressModalState.FAILURE:
      icon = (
        <img
          height="64"
          width="64"
          className="m-auto"
          src="/images/syndicateStatusIcons/transactionFailed.svg"
          alt=""
        />
      );
      break;
  }

  return (
    <Modal
      show={isVisible}
      modalStyle={ModalStyle.DARK}
      showCloseButton={false}
      customWidth="w-full max-w-480"
      // passing empty string to remove default classes
      customClassName=""
    >
      {/* -mx-4 is used to revert the mx-4 set on parent div on the modal */}
      <div className="p-10 -mx-4">
        {/* passing empty margin to remove the default margin set on spinner */}
        {icon}
        <p className="text-center mt-10 h3 text-white font-whyte">{title}</p>
        {description && (
          <div className="font-whyte text-center mt-4 leading-5 text-base text-gray-syn4">
            {description}
          </div>
        )}
        {etherscanHash && (
          <div className="mt-4 w-full flex justify-center items-center">
            <EtherscanLink
              etherscanInfo={etherscanHash}
              type={transactionType}
              text={etherscanLinkText}
              iconColor={iconColor}
            />
          </div>
        )}

        {buttonLabel && (
          <button
            onClick={buttonOnClick}
            className={`primary-CTA flex-shrink block mx-auto mt-8 ${
              buttonFullWidth ? 'w-full' : ''
            }`}
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </Modal>
  );
};
