import React from "react";

const PlaceHolder: React.FC<{ title?: string }> = ({ title }) => {
  return <div className="flex w-full pb-20">Placeholder - {title}</div>;
};

export default PlaceHolder;
