export enum PillButtonStyle {
  DARK = 'DARK',
  LIGHT = 'LIGHT'
}

export const PillButton = (props: {
  isActive?: boolean;
  extraClasses?: string;
  style?: PillButtonStyle;
  onClick: (e) => void;
  children: any;
}) => {
  const {
    isActive = false,
    extraClasses = '',
    style = PillButtonStyle.DARK,
    onClick,
    children,
    ...rest
  } = props;
  const activeClasses = 'ring-1 ring-blue-navy';

  const lightStyles = `${
    style === PillButtonStyle.DARK
      ? 'bg-gray-syn7 text-gray-syn4'
      : 'bg-white bg-opacity-80 text-black backdrop-filter backdrop-blur-xl'
  }`;

  return (
    <button
      className={`inline-flex flex flex-row items-center space-x-1 text-sm px-4 py-1.5 rounded-full text-center ${lightStyles} hover:ring-1 hover:ring-blue-navy ${
        isActive && activeClasses
      } ${extraClasses}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};
