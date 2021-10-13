import React, { ReactNode, useState } from "react";

interface Props {
  whiteIcon: ReactNode;
  grayIcon: ReactNode;
  text: string;
  onClickHandler?;
}

const MoreManagerActions = ({
  whiteIcon,
  grayIcon,
  text,
  onClickHandler,
}: Props) => {
  const [hovering, setHovering] = useState(false);
  return (
    <div
      className="flex mb-2 p-4 pr-4 md:p-6 md:pr-5 bg-gray-syn8 bg-opacity-75 h-16 items-center rounded-2xl px-6 my-4 cursor-pointer hover:bg-opacity-100 manager-actions-bg "
      onClick={onClickHandler}
      onMouseEnter={() => {
        setHovering(true);
      }}
      onMouseLeave={() => {
        setHovering(false);
      }}
    >
      <div className="w-4 h-4 mr-4">
        <div className="w-4 h-4">{hovering ? whiteIcon : grayIcon}</div>
      </div>
      <div className="text-base">{text}</div>
    </div>
  );
};

export default MoreManagerActions;
