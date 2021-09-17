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
      className={`flex m-4 mr-4 md:m-3 md:mr-5 mb-3 p-2 pl-0 rounded-custom cursor-pointer hover:bg-white hover:bg-opacity-5 target-l-3 target-r-3 disabled:opacity-50 items-start manager-actions-bg `}
      onClick={onClickHandler}
    >
      <div className="w-5 pt-2">{icon}</div>
      <div className="px-3 w-full">
        <div className="leading-6 my-1">{title}</div>
        <div className="text-sm text-gray-manatee font-extralight">
          {description}
        </div>
      </div>
    </div>
  );
};

export default ManagerAction;
