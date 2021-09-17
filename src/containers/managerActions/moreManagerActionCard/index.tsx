import React, { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  text: string;
  onClickHandler?;
}

const MoreManagerActions = ({ icon, text, onClickHandler }: Props) => {
  return (
    <div
      className="flex mb-2 p-4 pr-4 md:p-6 md:pr-5 bg-gray-9 bg-opacity-75 h-16 items-center rounded-2xl px-6 my-4 cursor-pointer hover:bg-opacity-100 manager-actions-bg "
      onClick={onClickHandler}
    >
      <div className="mr-4">{icon}</div>
      <div className="text-base">{text}</div>
    </div>
  );
};

export default MoreManagerActions;
