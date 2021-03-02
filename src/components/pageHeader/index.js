import React from "react";
import PropTypes from "prop-types";

const PageHeader = ({ children }) => {
  return (
    <h1 className="text-white font-bold text-white text-2xl mb-2">
      {children}
    </h1>
  );
};

PageHeader.propTypes = {
  children: PropTypes.string.isRequired,
};

export default PageHeader;
