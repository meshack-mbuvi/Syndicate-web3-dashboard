import React from 'react';
import ReactTooltip from 'react-tooltip';

export const SettingsDisclaimerTooltip: React.FC<{
  id: string;
  tip: string | React.ReactNode;
}> = ({ id, tip }) => {
  return (
    <ReactTooltip
      id={id}
      place="right"
      effect="solid"
      className="actionsTooltip"
      arrowColor="#222529"
      backgroundColor="#222529"
    >
      {tip}
    </ReactTooltip>
  );
};
