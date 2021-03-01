import PropTypes from "prop-types";
import React from "react";

const ContentWrapper = ({ children }) => {
  return <div className="flex w-auto w-5/6 py-4 px-8 ">{children}</div>;
};

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContentWrapper;
