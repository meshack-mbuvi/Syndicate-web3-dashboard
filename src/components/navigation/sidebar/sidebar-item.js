import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

export const SideBarNavItem = ({ url, urlText }) => {
  return (
    <div className="link">
      <Link
        to={`${url}`}
        className="flex items-center text-white link"
        activeClassName="active"
      >
        {urlText}
      </Link>
    </div>
  );
};

SideBarNavItem.propTypes = {
  url: PropTypes.string.isRequired,
  urlText: PropTypes.string.isRequired,
};
