import React from "react";
import Link from "src/components/syndicates/shared/ActiveLink";
import PropTypes from "prop-types";

export const NavBarNavItem = ({ url, urlText, customClasses = "" }) => {
  return (
    <Link href={`${url}`} customActive="underline">
      <a className={`${customClasses} text-sm sm:text-base text-white leading-7 font-light mr-3 md:mr-6 lg:mr-9 hover:underline transition-all`}>
        {urlText}
      </a>
    </Link>
  );
};

NavBarNavItem.propTypes = {
  url: PropTypes.string.isRequired,
  urlText: PropTypes.string.isRequired,
};
