import React from "react";
import PropTypes from "prop-types";

export const TopBarIconWrapper = ({ children }) => {
  return <p className="flex px-4 py-1 border rounded-full mr-5">{children}</p>;
};

TopBarIconWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TopBarIconWrapper;
