import React from "react";

/**
 * Primary button has a green background and white text
 * @param {*} props
 */
export const PrimaryButton = (props: {
  children: string;
  disabled?: boolean;
  customClasses: string;
  onClick?: () => void;
  type?;
  approved?: boolean;
}) => {
  const {
    children,
    customClasses = "bg-light-green",
    approved = false,
    ...rest
  } = props;

  return (
    <button
      className={`flex items-center justify-center border border-transparent text-base font-light rounded-md text-white focus:outline-none focus:ring ${customClasses}`}
      {...rest}
    >
      {approved ? (
        <img className="inline w-4 mr-2" src="/images/checkmark.svg" />
      ) : null}
      {children}
    </button>
  );
};

export default PrimaryButton;
