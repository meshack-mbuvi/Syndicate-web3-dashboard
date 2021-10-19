import React from "react";
import Link from "src/components/syndicates/shared/ActiveLink";
import PropTypes from "prop-types";

export const NavBarNavItem = ({ url, urlText, customClasses = "" }) => {
  return (
    <Link href={`${url}`} customActive="border-b-1 hover:border-opacity-100">
      <div className="h-full mr-3 md:mr-6 lg:mr-9 hover:border-b-1 hover:border-opacity-50 cursor-pointer">
        <a className={`${customClasses} text-sm sm:text-base text-white leading-7 vertically-center inline-block transition-all`}>
          {urlText}
        </a>
      </div>
    </Link>
  );
};

NavBarNavItem.propTypes = {
  url: PropTypes.string.isRequired,
  urlText: PropTypes.string.isRequired,
};
