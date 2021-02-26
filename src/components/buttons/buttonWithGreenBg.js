import React from "react";
import PropTypes from "prop-types";

export const ButtonWithGreenBg = (props) => {
  const { children, customClass = "", ...rest } = props;
  return (
    <button
      className={`flex items-center justify-center  border border-transparent text-base font-medium rounded-md text-white md:text-lg  bg-light-green ${customClass}`}
      {...rest}
    >
      {children}
    </button>
  );
};

ButtonWithGreenBg.propTypes = {
  children: PropTypes.node.isRequired,
  customClass: PropTypes.string,
};

export default ButtonWithGreenBg;
