import React, { useEffect, useState } from "react";
import Image from "next/image";
import { DataStorageToolTip } from "./DataStorageToolTip";

export const DataStorageInfo: React.FC = () => {
  const toolTipMessage =
    "Syndicate stores this data. It is not publicly viewable on-chain.<br /><br />Only members of this club can view the data entered in this field.";

  return (
    <div>
      <div className="relative space-x-1 font-whyte text-gray-syn6 text-sm items-center float-right cursor-pointer">
        <div className="inline-flex" data-tip data-for="info-storage-tip">
          <Image
            src={`/images/activity/question-small.svg`}
            height={14}
            width={14}
          />
          <div className="pl-1 inline-flex font-whyte text-sm text-gray-syn4">
            How is this data stored?
          </div>
        </div>
      </div>
      <DataStorageToolTip id="info-storage-tip" tip={toolTipMessage}/>
    </div>
  );
};
