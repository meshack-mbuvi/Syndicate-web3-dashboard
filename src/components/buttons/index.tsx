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
}) => {
  const { children, customClasses = "bg-light-green", ...rest } = props;

  return (
    <button
      className={`flex items-center justify-center border border-transparent text-base font-medium rounded-md text-white focus:outline-none focus:ring ${customClasses}`}
      {...rest}>
      {children}
    </button>
  );
};

export default PrimaryButton;
