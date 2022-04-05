import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { DataStorageToolTip } from './DataStorageToolTip';

export const DataStorageInfo: React.FC = () => {
  const toolTipMessage =
    'Data entered here is obfuscated but publicly viewable off-chain.<br /><br />Do not store PII here until additional privacy options are available.';

  return (
    <div>
      <div className="relative space-x-1 font-whyte text-gray-syn6 text-sm items-center float-right cursor-default">
        <div className="inline-flex" data-tip data-for="info-storage-tip">
          <Image
            src={`/images/activity/question-small.svg`}
            height={14}
            width={14}
          />
          <div className="pl-1 inline-flex font-whyte text-sm text-gray-syn5">
            Who can see this data?
          </div>
        </div>
      </div>
      <DataStorageToolTip id="info-storage-tip" tip={toolTipMessage} />
    </div>
  );
};
