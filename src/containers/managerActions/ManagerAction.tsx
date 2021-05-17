import React, { ReactNode } from "react";

interface Props {
  title: string;
  icon: ReactNode;
  description: string;
  onClickHandler: any;
}

const ManagerAction = ({ title, icon, description, onClickHandler }: Props) => {
  const grayBgAction = title === "Distribute tokens back to depositors";
  return (
    <div
      className={`flex mb-4 p-2 rounded-custom ${
        grayBgAction ? "bg-gray-nero" : ""
      }`}>
      <div className="w-6 pt-2">{icon}</div>
      <div className="px-4 w-full">
        <div
          className="font-semibold leading-6 cursor-pointer"
          onClick={onClickHandler}>
          {title}
        </div>
        <div className="text-sm text-gray-manatee leading-6 font-extralight">
          {description}
        </div>
      </div>
    </div>
  );
};

export default ManagerAction;
