import { Spinner } from '../shared/spinner';
import { BlockExplorerLink } from '../syndicates/shared/BlockExplorerLink';

export enum ProgressDescriptorState {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PROGRESSING = 'PROGRESSING'
}

interface Props {
  title: string;
  description?: string;
  transactionHash?: string;
  state: ProgressDescriptorState;
  requiresUserAction?: boolean;
}

export const ProgressDescriptor: React.FC<Props> = ({
  title,
  description,
  transactionHash,
  state,
  requiresUserAction = false
}) => {
  let icon;
  switch (state) {
    case ProgressDescriptorState.PENDING:
      icon = <Spinner height="h-10" width="w-10" margin="" strokeWidth="5" />;
      break;

    case ProgressDescriptorState.SUCCESS:
      icon = (
        <img
          height="40"
          width="40"
          className="m-auto"
          src="/images/checkCircleGreen.svg"
          alt=""
        />
      );
      break;

    case ProgressDescriptorState.FAILURE:
      icon = (
        <img
          height="40"
          width="40"
          className="m-auto"
          src="/images/syndicateStatusIcons/transactionFailed.svg"
          alt=""
        />
      );
      break;
  }

  return (
    <div
      className={`px-4 py-6 rounded-custom rounded-custom text-center ${
        requiresUserAction ? 'bg-blue-midnightExpress' : 'bg-gray-syn7'
      }`}
    >
      <div className={`mb-4`}>{icon}</div>
      <div>{title}</div>
      {description && (
        <div className="text-sm text-gray-syn4 mt-2">{description}</div>
      )}
      {transactionHash ? (
        <div className="flex justify-center mt-4">
          <div className="w-fit-content">
            <BlockExplorerLink
              resourceId={transactionHash}
              resource="transaction"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};
