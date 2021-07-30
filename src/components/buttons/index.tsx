import React from "react";

/**
 * Primary button has a green background and white text
 * @param {*} props
 */
export const PrimaryButton = (props: {
  children: any;
  disabled?: boolean;
  customClasses: string;
  onClick?: () => void;
  type?;
  approved?: boolean;
  createSyndicate?: boolean;
  textColor?: string;
}) => {
  const {
    children,
    customClasses = "bg-light-green",
    approved = false,
    createSyndicate = false,
    textColor = "text-white",
    ...rest
  } = props;

  return (
    <button
      className={`flex items-center justify-center border text-base font-light rounded-md focus:outline-none focus:ring ${textColor} ${customClasses}`}
      {...rest}>
      {approved ? (
        <img className="inline w-4 mr-2" src="/images/checkmark-approved.svg" alt="Approved"/>
      ) : null}
      {createSyndicate ? (
        <img className="inline w-4 mr-4" src="/images/plus-circle.svg" alt=""/>
      ) : null}
      {children}
    </button>
  );
};

export default PrimaryButton;
