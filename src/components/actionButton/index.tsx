import Image from 'next/image';

export const ActionButton = (props: {
  extraClasses?: string;
  label?: string;
  icon?: string;
  width?: number;
  height?: number;
  disabled?: boolean;
  onClick: () => void;
}): JSX.Element => {
  const {
    icon,
    label,
    extraClasses = '',
    width = 16,
    height = 16,
    onClick,
    ...rest
  } = props;

  return (
    <button
      className={`text-blue flex items-center space-x-2 ${extraClasses}`}
      onClick={onClick}
      {...rest}
    >
      {icon ? (
        <Image src={icon} width={width} height={height} alt="" className="" />
      ) : null}
      {label ? <div>{label}</div> : null}
    </button>
  );
};
