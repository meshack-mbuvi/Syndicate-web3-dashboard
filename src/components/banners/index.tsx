import React from "react";
import { SyndicateInBetaBannerText } from "src/components/syndicates/shared/Constants";

export const SyndicateInBetaBanner = () => {
  return (
    <div className="flex flex-wrap items-center justify-center flex-1 space-x-1 mx-auto w-fit-content">
      <div className="rounded-full py-2 px-4 beta flex items-center justify-center bg-gray-syn7">
        {SyndicateInBetaBannerText}
      </div>
    </div>
  );
};
