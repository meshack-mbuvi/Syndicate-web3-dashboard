import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { ExternalLinkColor } from 'src/components/iconWrappers';
import { CTAButton } from '../CTAButton';
import { Spinner } from '../shared/spinner';

export enum ProgressState {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  CONFIRM = 'CONFIRM',
  TAKING_LONG = 'TAKING_LONG'
}

export const ProgressCard = (props: {
  title: string;
  description?: string | JSX.Element;
  state: ProgressState;
  buttonLabel?: string;
  buttonFullWidth?: boolean;
  buttonOnClick?: () => void;
  transactionHash?: string;
  transactionType?: string;
  explorerLinkText?: string;
  iconcolor?: ExternalLinkColor;
}): React.ReactElement => {
  const {
    title,
    description,
    state,
    buttonLabel,
    buttonOnClick,
    transactionHash,
    transactionType,
    buttonFullWidth = false,
    iconcolor = ExternalLinkColor.BLUE
  } = props;

  let icon;
  switch (state) {
    case ProgressState.CONFIRM:
      icon = <Spinner height="h-16" width="w-16" margin="" strokeWidth="5" />;
      break;

    case ProgressState.PENDING:
      icon = <Spinner height="h-16" width="w-16" margin="" strokeWidth="5" />;
      break;

    case ProgressState.TAKING_LONG:
      icon = <Spinner height="h-16" width="w-16" margin="" strokeWidth="5" />;
      break;

    case ProgressState.SUCCESS:
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

    case ProgressState.FAILURE:
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
    <div className="p-10 max-w-120">
      {icon}
      <p className="text-center mt-10 h3 text-white font-whyte">{title}</p>
      {description && (
        <div className="font-whyte text-center mt-4 leading-5 text-base text-gray-syn4">
          {description}
        </div>
      )}
      {transactionHash && (
        <div className="mt-4 w-full flex justify-center items-center">
          <BlockExplorerLink
            prefix="View on "
            resourceId={transactionHash}
            resource={transactionType}
            iconcolor={iconcolor}
          />
        </div>
      )}

      {buttonLabel && (
        <CTAButton
          onClick={buttonOnClick}
          extraClasses={`flex-shrink block mx-auto mt-8`}
          fullWidth={buttonFullWidth}
        >
          {buttonLabel}
        </CTAButton>
      )}
    </div>
  );
};
