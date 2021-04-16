import React, { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  text: string;
}

const MoreManagerActions = ({ icon, text }: Props) => {
  return (
    <div className="flex bg-gray-9 h-14 items-center rounded-md px-6 my-4">
      <div className="mr-4">{icon}</div>
      <div className="text-md font-semibold">{text}</div>
    </div>
  );
};

export default MoreManagerActions;
