import PropTypes from "prop-types";
import React from "react";

const PageHeader = ({ children }) => {
  return <h1 className="text-white text-white text-2xl mb-2">{children}</h1>;
};

PageHeader.propTypes = {
  children: PropTypes.string.isRequired,
};

export default PageHeader;
