export enum CalloutType {
  REGULAR = 'REGULAR',
  WARNING = 'WARNING'
}

export const Callout: React.FC<{
  type?: CalloutType;
  extraClasses?: string;
  showIcon?: boolean;
}> = ({
  type = CalloutType.REGULAR,
  extraClasses = 'rounded-xl p-4',
  showIcon = true,
  children
}) => {
  let styles = `bg-blue-navy bg-opacity-20 text-blue-navy`;
  let icon;
  switch (type) {
    case CalloutType.REGULAR:
      styles = 'bg-blue-navy bg-opacity-20 text-blue-navy';
      break;
    case CalloutType.WARNING:
      icon = '/images/syndicateStatusIcons/warning-triangle-yellow.svg';
      styles = 'bg-yellow-warning bg-opacity-20 text-yellow-warning';
      break;
  }

  return (
    <div className={`${styles} flex items-center space-x-3.5 ${extraClasses}`}>
      {showIcon && icon && <img src={icon} className="w-5 h-5" alt="Icon" />}
      <div className="w-full">{children}</div>
    </div>
  );
};
