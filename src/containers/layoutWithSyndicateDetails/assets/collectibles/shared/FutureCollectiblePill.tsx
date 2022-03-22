import React from "react";
import Tooltip from "react-tooltip-lite";

const FutureCollectiblePill: React.FC = () => {
  return (
    <div className="rounded-full bg-white text-black flex justify-end items-center px-3 py-0">
      <div className="mr-2">This is a future collectible</div>
      <Tooltip
        content={<div className="text-sm text-gray-syn4">Available soon.</div>}
        arrow={false}
        tipContentClassName="actionsTooltip"
        background="#131416"
        padding="12px"
        distance={10}
        className="cursor-default"
      >
        <img src="/images/morseCodeNfts/Info-exclamation.svg" alt="info" className="w-4 h-4" />
      </Tooltip>
    </div>
  );
};

export default FutureCollectiblePill;
