import React, { ReactNode } from "react";

interface Props {
  title: string;
  icon: ReactNode;
  description: string;
  onClickHandler: () => void;
}

const ManagerAction = ({ title, icon, description, onClickHandler }: Props) => {
  return (
    <div
      className={`flex mb-4 p-2 pl-0 rounded-custom cursor-pointer hover:bg-white hover:bg-opacity-5 target-l-3 target-r-3 disabled:opacity-50`}
      onClick={onClickHandler}
    >
      <div className="w-6 pt-2">{icon}</div>
      <div className="px-4 w-full">
        <div className="font-semibold leading-6">{title}</div>
        <div className="text-sm text-gray-manatee font-extralight">
          {description}
        </div>
      </div>
    </div>
  );
};

export default ManagerAction;
