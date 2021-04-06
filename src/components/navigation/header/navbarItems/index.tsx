import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";

export const NavBarNavItem = ({ url, urlText }) => {
  return (
    <Link href={`${url}`}>
      <a className="flex items-center text-white my-1 ml-6 leading-7 font-bold">
        {urlText}
      </a>
    </Link>
  );
};

NavBarNavItem.propTypes = {
  url: PropTypes.string.isRequired,
  urlText: PropTypes.string.isRequired,
};
