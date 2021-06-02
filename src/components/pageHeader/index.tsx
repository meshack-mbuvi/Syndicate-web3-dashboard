import React from "react";

interface Props {
  children: any;
}

const PageHeader = ({ children }: Props) => {
  return <h1 className="text-white text-white text-2xl mb-2">{children}</h1>;
};

export default PageHeader;
