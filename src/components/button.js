import React from "react";
import PropTypes from "prop-types";

export const Button = ({ children }) => {
  return (
    <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white md:py-4 md:text-lg md:px-10 bg-light-green">
      {children}
    </button>
  );
};

// Button.protoTypes = {
//   children: PropTypes.any,
// };

export default Button;
