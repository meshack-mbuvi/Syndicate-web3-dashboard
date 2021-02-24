import PropTypes from "prop-types";
import React from "react";

const ContentWrapper = ({ children }) => {
  return (
    <div className="flex w-auto main-content">
      {children}
    </div>
  );
};

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContentWrapper;
