import React from 'react';
import ReactTooltip from 'react-tooltip';

export const DataStorageToolTip: React.FC<{
  id: string;
  tip: string | React.ReactNode;
}> = ({ id, tip }) => {
  return (
    <ReactTooltip
      id={id}
      place="top"
      effect="solid"
      className="actionsTooltip w-76"
      arrowColor="transparent"
      backgroundColor="#232529"
      html={true}
    >
      {tip}
    </ReactTooltip>
  );
};
