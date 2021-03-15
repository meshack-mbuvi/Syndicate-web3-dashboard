import React from "react";
import PropTypes from "prop-types";

export const TopBarIconWrapper = ({ children }) => {
  return (
    <div className="flex px-4 py-2 bg-gray rounded-full mr-5 cursor-pointer">
      {children}
    </div>
  );
};

TopBarIconWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TopBarIconWrapper;
