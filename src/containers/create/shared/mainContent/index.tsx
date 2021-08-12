import { useSyndicateInBetaBannerContext } from "@/context/SyndicateInBetaBannerContext";
import React from "react";

export const MainContent: React.FC = (props) => {
  const { showBanner } = useSyndicateInBetaBannerContext();

  return (
    <div
      id="center-column"
      className={`px-12 pt-3 pr-16 w-1/2 h-3/4 flex flex-col ${
        showBanner ? "pb-10" : "pb-3"
      }`}
    >
      <div
        className={`relative px-4 pb-4 no-scroll-bar overflow-y-scroll h-full pl-2`}
      >
        {props.children}
      </div>
    </div>
  );
};
