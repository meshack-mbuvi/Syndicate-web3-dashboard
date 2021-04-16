import React, { ReactNode } from "react";

interface Props {
  title: string;
  icon: ReactNode;
  description: string;
}
const ManagerAction = ({ title, icon, description }: Props) => {
  return (
    <div className="flex my-6">
      <div className="w-6">{icon}</div>
      <div className="px-4 w-full">
        <div className="font-semibold leading-6">{title}</div>
        <div className="text-sm text-gray-manatee leading-6 w-2/3">
          {description}
        </div>
      </div>
    </div>
  );
};

export default ManagerAction;
