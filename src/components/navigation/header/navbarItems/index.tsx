import React from "react";
import Link from "src/components/syndicates/shared/ActiveLink";
import PropTypes from "prop-types";

export const NavBarNavItem = ({ url, urlText }) => {
  return (
    <Link href={`${url}`}>
      <a className="px-3 text-white leading-7 font-light active:text-purple-600">
        {urlText}
      </a>
    </Link>
  );
};

NavBarNavItem.propTypes = {
  url: PropTypes.string.isRequired,
  urlText: PropTypes.string.isRequired,
};
