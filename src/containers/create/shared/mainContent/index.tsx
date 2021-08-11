import { useSyndicateInBetaBannerContext } from "@/context/SyndicateInBetaBannerContext";
import React from "react";

export const MainContent: React.FC = (props) => {
  const { showBanner } = useSyndicateInBetaBannerContext();

  return (
    <div
      id="center-column"
      className="px-12 pt-3 pr-16 w-1/2 pb-3 h-3/4 flex flex-col"
    >
      <div
        className={`relative px-4 pb-4 no-scroll-bar overflow-y-scroll h-full`}
      >
        {props.children}
      </div>
    </div>
  );
};
