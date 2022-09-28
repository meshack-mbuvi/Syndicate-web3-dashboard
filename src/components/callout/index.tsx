import IconInfo from '../icons/info';
import IconWarning from '../icons/warning';
import { B3 } from '../typography';

export enum CalloutType {
  REGULAR = 'REGULAR',
  WARNING = 'WARNING',
  OUTLINE = 'OUTLINE'
}

export enum CalloutIconPosition {
  TOP = 'TOP',
  INLINE = 'INLINE'
}

interface Props {
  type?: CalloutType;
  extraClasses?: string;
  showIcon?: boolean;
  icon?: string | undefined | null | React.ReactNode;
  iconPosition?: CalloutIconPosition;
  children?: any;
  textColor?: string;
  backgroundOpacity?: string;
  backgroundColor?: string;
}

export const Callout: React.FC<Props> = ({
  type = CalloutType.REGULAR,
  extraClasses = '',
  showIcon = true,
  icon = null,
  backgroundOpacity = 'bg-opacity-10',
  textColor = 'text-white',
  iconPosition = CalloutIconPosition.INLINE,
  backgroundColor = 'bg-blue-stratosphere',
  children,
  ...rest
}: Props) => {
  let styles = `${backgroundColor} bg-opacity-${backgroundOpacity} ${textColor}`;
  let calloutIcon: string | any = icon;
  switch (type) {
    case CalloutType.REGULAR:
      if (iconPosition === CalloutIconPosition.TOP) {
        calloutIcon = icon ? (
          icon
        ) : (
          <IconInfo
            width={22}
            height={22}
            textColorClass="text-blue-stratosphere"
          />
        );
      }
      styles = `${backgroundColor} ${backgroundOpacity} ${textColor}`;
      break;
    case CalloutType.WARNING:
      if (iconPosition === CalloutIconPosition.TOP) {
        calloutIcon = icon
          ? icon
          : '/images/syndicateStatusIcons/warning-triangle-yellow.svg';
      }
      styles = `bg-yellow-warning ${backgroundOpacity} ${textColor}`;
      break;
    case CalloutType.OUTLINE:
      if (iconPosition === CalloutIconPosition.TOP) {
        calloutIcon = icon ? (
          icon
        ) : (
          <IconWarning
            width={22}
            height={22}
            textColorClass="text-white"
            extraClasses="opacity-15"
          />
        );
      }
      styles = `border border-gray-syn6 ${textColor}`;
      break;
  }

  return (
    <div
      className={`${styles} ${
        iconPosition === CalloutIconPosition.INLINE
          ? 'flex items-start space-x-4'
          : iconPosition === CalloutIconPosition.TOP
          ? 'space-y-3.5'
          : ''
      } rounded-xl px-5 py-4 ${extraClasses}`}
      {...rest}
    >
      {showIcon && calloutIcon && typeof calloutIcon === 'string' ? (
        <img
          src={calloutIcon}
          className={`${
            iconPosition === CalloutIconPosition.INLINE
              ? 'w-5 h-5'
              : iconPosition === CalloutIconPosition.TOP
              ? 'w-5.5 h-5.5'
              : ''
          }}`}
          alt="Icon"
        />
      ) : (
        calloutIcon
      )}
      <B3 className="w-full">{children}</B3>
    </div>
  );
};