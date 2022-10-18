import IconPlus from '@/components/icons/plusIcon';
import { ChevronRightIcon } from '@heroicons/react/outline';
import IconCirclePlus from '../icons/circlePlusIcon';
export enum LinkType {
  CALENDAR = 'CALENDAR',
  MEMBER = 'MEMBER'
}

export const LinkButton = (props: {
  type?: LinkType;
  extraClasses?: string;
  onClick?: () => void;
  URL?: string;
  children?: any;
  showChevron?: boolean;
}): JSX.Element => {
  const {
    type,
    extraClasses = '',
    onClick,
    URL,
    children,
    showChevron,
    ...rest
  } = props;

  let icon;
  let label;
  switch (type) {
    case LinkType.CALENDAR:
      icon = '/images/blue-calendar.svg';
      label = 'Add to calendar';
      break;
    case LinkType.MEMBER:
      icon = <IconCirclePlus />;
      label = 'Add member';
      break;
    default:
      icon = null;
      label = null;
  }

  const innerContent = (
    <div className="flex items-center">
      {type && (
        <div className="flex-shrink-0 mr-2">
          {typeof icon === 'string' ? (
            <img src={icon} alt="" className="" />
          ) : (
            <IconPlus />
          )}
        </div>
      )}
      <div className="flex-grow">{children ? children : label}</div>
      {(URL || showChevron) && (
        <div className="h-4 w-4 ml-0.5">
          <ChevronRightIcon />
        </div>
      )}
    </div>
  );

  return (
    <>
      {URL ? (
        <a
          href={URL}
          className={`text-blue flex items-center space-x-2 ${extraClasses}`}
          onClick={onClick}
          {...rest}
        >
          {innerContent}
        </a>
      ) : (
        <button
          className={`text-blue flex items-center space-x-2 ${extraClasses}`}
          onClick={onClick}
          {...rest}
        >
          {innerContent}
        </button>
      )}
    </>
  );
};
