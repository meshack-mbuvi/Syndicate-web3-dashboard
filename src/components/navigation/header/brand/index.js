import React from "react";
import { Link } from "gatsby";
import brand from "../../../../images/brand.svg";

const BrandWrapper = () => {
  return (
    <Link to="/" className="m-4">
      <img src={brand} className="brand ml-2" />
    </Link>
  );
};

export default BrandWrapper;
