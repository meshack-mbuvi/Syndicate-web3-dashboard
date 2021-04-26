import React from "react";
import Link from "next/link";

const BrandWrapper = () => {
  return (
    <Link href="/">
      <a>
        <img src="/images/logo.svg" className="ml-4" />
      </a>
    </Link>
  );
};

export default BrandWrapper;
