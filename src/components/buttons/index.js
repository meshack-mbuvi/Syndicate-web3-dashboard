import React from "react";
import PropTypes from "prop-types";

/**
 * Primary button has a green background and white text
 * @param {*} props
 */
export const PrimaryButton = (props) => {
  const { children, customClasses = "", ...rest } = props;

  return (
    <button
      className={`flex items-center justify-center  border border-transparent text-base font-medium rounded-md text-white focus:outline-none focus:ring bg-light-green ${customClasses}`}
      {...rest}
    >
      {children}
    </button>
  );
};

PrimaryButton.propTypes = {
  children: PropTypes.string.isRequired,
  customClasses: PropTypes.string,
};

export default PrimaryButton;
