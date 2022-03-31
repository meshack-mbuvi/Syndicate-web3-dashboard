export const PillButton = (props: {
  isActive?: boolean;
  extraClasses?: string;
  onClick: () => void;
  children: any;
}) => {
  const {
    isActive = false,
    extraClasses = '',
    onClick,
    children,
    ...rest
  } = props;
  const activeClasses = 'ring-1 ring-blue-navy';

  return (
    <button
      className={`inline-flex flex flex-row items-center space-x-1 text-sm px-4 py-1.5 bg-gray-syn7 rounded-full text-center text-gray-syn4 hover:ring-1 hover:ring-blue-navy ${
        isActive && activeClasses
      } ${extraClasses}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};
