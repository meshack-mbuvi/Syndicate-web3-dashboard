import { DealStatus, ParticipantStatus } from '@/hooks/deals/types';

export const StatusChip = (props: {
  status: ParticipantStatus | DealStatus;
  extraClasses?: string;
  customLabel?: string;
  customIcon?: string | React.ReactNode;
}): JSX.Element => {
  const { status, extraClasses = '', customIcon, customLabel } = props;

  let bgStyles = '';
  let label = '';
  let dotStyles = '';
  switch (status) {
    case ParticipantStatus.PENDING:
      bgStyles = 'bg-white bg-opacity-10';
      label = 'Pending approval';
      dotStyles = 'border border-gray-syn3';
      break;
    case ParticipantStatus.ACTION_REQUIRED: // TODO [WINGZ]: is this equivalent to when a precommit fails? still in designs?
      bgStyles = 'bg-blue-500 bg-opacity-40';
      label = 'Action required';
      dotStyles = 'bg-blue-500';
      break;
    case ParticipantStatus.ACCEPTED:
      bgStyles = 'bg-blue-neptune bg-opacity-40';
      label = 'Accepted';
      dotStyles = 'bg-blue-neptune';
      break;
    case ParticipantStatus.REJECTED:
      bgStyles = 'bg-white bg-opacity-10';
      label = 'Rejected';
      dotStyles = 'border border-gray-syn3';
      break;
    case DealStatus.CLOSED: // TODO: does it need deal executed and deal open states?
      bgStyles = 'bg-white bg-opacity-10';
      label = 'Deal closed';
      dotStyles = 'border border-gray-syn3';
      break;
    case DealStatus.DISSOLVED:
      bgStyles = 'bg-white bg-opacity-10';
      label = 'Deal dissolved';
      dotStyles = 'border border-gray-syn3';
      break;
    case ParticipantStatus.CUSTOM:
      bgStyles = 'bg-white bg-opacity-10';
      label = 'Pending approval';
      dotStyles = 'border border-gray-syn3';
      break;
  }

  return (
    <div
      className={`${bgStyles} inline-flex items-center space-x-2 rounded-full pl-3 pr-4 ${extraClasses}`}
      style={{ padding: '0.3125rem 0.75rem' }}
    >
      {customIcon ? (
        <>
          {typeof customIcon === 'string' ? (
            <img src={customIcon} alt="Icon" className="w-4 h-4" />
          ) : (
            customIcon
          )}
        </>
      ) : (
        <div className={`${dotStyles} w-2 h-2 rounded-full`}></div>
      )}
      <div className={`text-sm`}>{customLabel ? customLabel : label}</div>
    </div>
  );
};
