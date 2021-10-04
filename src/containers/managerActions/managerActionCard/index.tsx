import React, { ReactNode, useState } from "react";

interface Props {
  title: string;
  grayIcon: ReactNode;
  whiteIcon: ReactNode;
  description: string;
  onClickHandler: () => void;
}

const ManagerAction = ({
  title,
  grayIcon,
  whiteIcon,
  description,
  onClickHandler,
}: Props) => {
  const [hovering, setHovering] = useState(false);
  return (
    <div
      className={`flex pl-0 mt-5 rounded-custom cursor-pointer disabled:opacity-50 items-start`}
      onClick={onClickHandler}
      onMouseEnter={() => {
        setHovering(true);
      }}
      onMouseLeave={() => {
        setHovering(false);
      }}
    >
      <div className="w-full flex justify-start">
        <div className="mr-3 mt-1">
          <div className="w-4 h-4">{hovering ? whiteIcon : grayIcon}</div>
        </div>
        <div>
          <div>
            <p className="leading-6">{title}</p>
          </div>
          <div className="text-sm text-gray-manatee font-extralight">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerAction;
