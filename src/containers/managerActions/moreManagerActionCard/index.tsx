import React, { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  text: string;
  onClickHandler?;
}

const MoreManagerActions = ({ icon, text, onClickHandler }: Props) => {
  return (
    <div 
      className="flex bg-gray-9 h-14 items-center rounded-custom px-6 my-4 cursor-pointer"
      onClick={onClickHandler}
    >
      <div className="mr-4">{icon}</div>
      <div className="text-md font-semibold">
        {text}
      </div>
    </div>
  );
};

export default MoreManagerActions;
