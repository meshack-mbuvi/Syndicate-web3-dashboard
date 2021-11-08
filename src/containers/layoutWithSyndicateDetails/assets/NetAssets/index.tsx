import React from "react";
import ReactTooltip from "react-tooltip";
import { MoreInfoIcon } from "@/components/shared/Icons/index";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { SkeletonLoader } from "@/components/skeletonLoader";

const NetAssets: React.FC<{ totalAssetsValue: string }> = ({
  totalAssetsValue,
}) => {
  return (
    <>
      <div className="flex items-center">
        <p className="text-gray-syn4 mr-2">Net asset value</p>
        <div
          className="flex items-center justify-center flex-shrink-0 w-4 h-4"
          data-tip
          data-for="transfer-member-deposit"
        >
          <MoreInfoIcon />
        </div>
        <ReactTooltip
          id="transfer-member-deposit"
          place="top"
          effect="solid"
          className="actionsTooltip"
          arrowColor="transparent"
          backgroundColor="#222529"
        >
          Estimated based on available <br /> pricing data. Collectibles are{" "}
          <br /> not included.
        </ReactTooltip>
      </div>
      {totalAssetsValue ? (
        <p className="text-white text-lg md:text-2xl pt-2">
          {floatedNumberWithCommas(totalAssetsValue)} USD
        </p>
      ) : (
        <SkeletonLoader height={"8"} width={"44"} />
      )}
    </>
  );
};

export default NetAssets;
