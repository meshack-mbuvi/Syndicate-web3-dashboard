import React from "react";
import PropTypes from "prop-types";

import "./wrapper.css";

export const TopBarIconWrapper = ({ children }) => {
  return <p className="content mr-5">{children}</p>;
};

TopBarIconWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TopBarIconWrapper;
