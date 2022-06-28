import { Spinner } from '../shared/spinner';

export enum ProgressDescriptorState {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PROGRESSING = 'PROGRESSING'
}

interface Props {
  title: string;
  description?: string;
  link?: { label: string; URL: string };
  state: ProgressDescriptorState;
  requiresUserAction?: boolean;
}

export const ProgressDescriptor: React.FC<Props> = ({
  title,
  description,
  link,
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
      {link?.URL && (
        <a
          href={link.URL}
          className="block mt-4 text-blue-neptune flex justify-center space-x-2"
          target="_blank"
          rel="noreferrer"
        >
          <div>{link.label}</div>
          <img src="/images/externalLink.svg" alt="External link icon" />
        </a>
      )}
    </div>
  );
};
