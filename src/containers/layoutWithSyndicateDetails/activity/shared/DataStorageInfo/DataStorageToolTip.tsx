import React from "react";
import ReactTooltip from "react-tooltip";

export const DataStorageToolTip: React.FC<{
  id: string;
  tip: string | React.ReactNode;
  tipSize? : number
}> = ({ id, tip , tipSize}) => {
  return (
    <ReactTooltip
      id={id}
      place="top"
      effect="solid"
      className="actionsTooltip w-76"
      arrowColor="transparent"
      overridePosition={({top}) => ({left: tipSize, top})}
      backgroundColor="#232529"
      html={true}
    >
      {tip}
    </ReactTooltip>
  );
};
