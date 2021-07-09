import React from "react";
import Link from "src/components/syndicates/shared/ActiveLink";
import PropTypes from "prop-types";

export const NavBarNavItem = ({ url, urlText }) => {
  return (
    <Link href={`${url}`}>
      <a className="px-3 text-sm sm:text-base text-white leading-7 font-light active:text-blue hover:text-blue transition-all">
        {urlText}
      </a>
    </Link>
  );
};

NavBarNavItem.propTypes = {
  url: PropTypes.string.isRequired,
  urlText: PropTypes.string.isRequired,
};
