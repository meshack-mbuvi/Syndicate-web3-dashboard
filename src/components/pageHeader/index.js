import React from "react";
import PropTypes from "prop-types";

import "./header.css";

const PageHeader = ({ children }) => {
  return <h1 className="page-heading text-white">{children}</h1>;
};

PageHeader.propTypes = {
  children: PropTypes.string.isRequired,
};

export default PageHeader;
