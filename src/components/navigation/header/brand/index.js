import React from "react";
import { Link } from "gatsby";
import brand from "src/images/brand.svg";

const BrandWrapper = () => {
  return (
    <Link to="/" className="m-4">
      <img src={brand} className="ml-2" />
    </Link>
  );
};

export default BrandWrapper;
