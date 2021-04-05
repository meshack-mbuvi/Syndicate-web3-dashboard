import React from "react";
import Link from "next/link";

const BrandWrapper = () => {
  return (
    <Link href="/">
      <a>
        <img src="/images/brand.svg" className="ml-4" />
      </a>
    </Link>
  );
};

export default BrandWrapper;
