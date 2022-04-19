interface Props {
  onClick: () => void;
  children: any;
}

export const PillButtonOutlined: React.FC<Props> = ({
  onClick,
  children,
  ...rest
}) => {
  return (
    <button
      className={`inline-flex flex flex-row items-center space-x-2 text-base py-2 px-4 border border-gray-syn6 rounded-full text-center text-gray-syn4 transition-all`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};
