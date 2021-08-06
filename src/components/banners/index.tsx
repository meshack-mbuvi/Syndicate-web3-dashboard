import { useSyndicateInBetaBannerContext } from "@/context/SyndicateInBetaBannerContext";
import React from "react";
import {
  constants,
  SyndicateInBetaBannerText,
} from "src/components/syndicates/shared/Constants";

export const SyndicateInBetaBanner = () => {
  const { hideBanner, showBanner } = useSyndicateInBetaBannerContext();

  return (
    <div
      className={`pl-4 pr-8 py-3 w-full relative bg-yellow-light text-black text-center ${
        showBanner ? "" : "hidden"
      }`}
      role="alert"
    >
      <div className="flex justify-center container mx-auto text-sm">
        <span className="block sm:inline font-whyte-light mr-2">
          {SyndicateInBetaBannerText}
        </span>
        <span
          className="absolute mx-3 py-1 cursor-pointer absolute right-2"
          onClick={() => hideBanner()}
        >
          <img src="/images/close.svg" alt="close-button" />
        </span>
      </div>
    </div>
  );
};

// banner text to display at the top of the deposit page
const { depositBannerText } = constants;
export const DepositsPageBanner = () => {
  return (
    <div className="w-full bg-blue-dark py-4 text-center">
      <div className="container mx-auto">
        <p className="text-sm">
          <span className="font-medium font-whyte">IMPORTANT: </span>
          <span className="font-whyte-light">{depositBannerText}</span>
        </p>
      </div>
    </div>
  );
};
