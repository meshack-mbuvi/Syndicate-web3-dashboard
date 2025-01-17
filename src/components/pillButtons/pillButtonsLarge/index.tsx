import { ReactNode } from 'react';

type TPillButton = {
  extraClasses?: string;
  onClick: () => void;
  children: string | ReactNode;
};
export const PillButtonLarge = (props: TPillButton): JSX.Element => {
  const { extraClasses = '', onClick, children, ...rest } = props;

  return (
    <button
      className={`inline-flex flex flex-row items-center space-x-3 text-base py-3.5 px-5 bg-gray-syn7 rounded-full text-center text-white transition-all ${extraClasses}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};
