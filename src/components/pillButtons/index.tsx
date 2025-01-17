import clsx from 'clsx';

export enum PillButtonStyle {
  DARK = 'DARK',
  LIGHT = 'LIGHT'
}

export const PillButton = (props: {
  isActive?: boolean;
  extraClasses?: string;
  style?: PillButtonStyle;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: string | JSX.Element;
}): React.ReactElement => {
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
      className={clsx(
        'inline-flex flex flex-row items-center space-x-1 text-sm px-4 py-1.5 rounded-full text-center hover:ring-1 hover:ring-blue-navy ',
        lightStyles,
        isActive && activeClasses,
        extraClasses
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};
