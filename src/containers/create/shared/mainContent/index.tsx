import React from "react";
import { useSyndicateInBetaBannerContext } from "@/context/SyndicateInBetaBannerContext";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";

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

// adding another main content for templates
// The intention here is to widen the middle section since input fields
// on the template page are rendered next to each other.
// Also mixing up these two components just makes the code a bit harder to follow.
export const TemplateMainContent: React.FC = (props) => {
  const { showBanner } = useSyndicateInBetaBannerContext();
  const { currentTemplateSubstep } = useCreateSyndicateContext();

  return (
    <div
      id="center-column"
      className={`px-2 mr-7 pt-3 ${
        currentTemplateSubstep.length ? "w-2/5" : "w-1/2"
      } h-3/4 flex flex-col ${
        showBanner && !currentTemplateSubstep.length ? "pb-20" : "pb-8"
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
