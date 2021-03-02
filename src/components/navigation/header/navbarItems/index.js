import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

export const NavBarNavItem = ({ url, urlText }) => {
  return (
    <Link
      to={`${url}`}
      className="flex items-center text-white my-1 ml-6 leading-7 font-bold active:text-purple-600"
      activeClassName="active"
    >
      {urlText}
    </Link>
  );
};

NavBarNavItem.propTypes = {
  url: PropTypes.string.isRequired,
  urlText: PropTypes.string.isRequired,
};
