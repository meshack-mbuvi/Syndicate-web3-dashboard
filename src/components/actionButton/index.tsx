import { ChevronRightIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import IconPlus from '../icons/plusIcon';

export enum ActionButtonType {
  CHEVRON = 'CHEVRON',
  ADD = 'ADD'
}

export const ActionButton = (props: {
  extraClasses?: string;
  icon?: string;
  width?: number;
  height?: number;
  type?: ActionButtonType;
  disabled?: boolean;
  children?: string | JSX.Element;
  onClick: () => void;
}): JSX.Element => {
  const {
    icon,
    extraClasses = '',
    width = 16,
    height = 16,
    type,
    onClick,
    children,
    ...rest
  } = props;

  return (
    <button
      className={`text-blue flex items-center ${extraClasses}`}
      onClick={onClick}
      {...rest}
    >
      {icon ? (
        <div className="mr-2 flex items-center">
          <Image src={icon} width={width} height={height} alt="" className="" />
        </div>
      ) : type === ActionButtonType.ADD ? (
        <IconPlus extraClasses="mr-2" />
      ) : null}
      {children ? <div>{children}</div> : null}
      {type === ActionButtonType.CHEVRON && (
        <div className="h-4 w-4 ml-0.5">
          <ChevronRightIcon />
        </div>
      )}
    </button>
  );
};
