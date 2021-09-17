import React from "react";
import { useSelector } from "react-redux";
import { SkeletonLoader } from "src/components/skeletonLoader";
import { RootState } from "src/redux/store";
import { SectionCard } from "../sectionCard";

/**
 * @param {} props
 * @returns
 */
export const DetailsCard = (props: {
  sections;
  title?: string;
  customStyles: string;
  infoIcon?: boolean;
  customInnerWidth?: string;
  syndicateDetails?: boolean;
  syndicate?: any;
  loadingLPDetails?: boolean;
}): JSX.Element => {
  const {
    sections = [],
    title = "My Stats",
    customStyles = "",
    infoIcon,
    customInnerWidth = "",
    syndicateDetails = false,
    syndicate,
    loadingLPDetails,
  } = props;

  const {
    tokenDetailsReducer: { distributionTokensAllowanceDetails },
    syndicateMemberDetailsReducer: {
      syndicateMemberDetailsLoading,
      syndicateDistributionTokens,
    },
  } = useSelector((state: RootState) => state);

  //conditions under which the skeleton loader should be rendered.
  const showSkeletonLoader =
    !syndicate ||
    (loadingLPDetails && !syndicateDetails) ||
    (syndicate &&
      syndicate.distributing &&
      !distributionTokensAllowanceDetails.length &&
      !syndicateDetails) ||
    (syndicateMemberDetailsLoading && title === "My Stats") ||
    (!syndicateDistributionTokens &&
      title === "My Stats" &&
      syndicate?.distributing);

  return (
    <div className={`h-fit-content ${customStyles}`}>
      {showSkeletonLoader ? (
        <div className="mb-4">
          <SkeletonLoader height="9" width="full" borderRadius="rounded-md" />
        </div>
      ) : (
        <div className={`flex ${customInnerWidth} justify-between`}>
          <p className="fold-bold text-xl">
            {title !== "Details" ? title : ""}
          </p>
        </div>
      )}

      <div className={`${customInnerWidth}`}>
        {sections.map((section, index) => (
          <div
            className={`flex justify-start visibility-container target-l-12`}
            key={index}
          >
            <div className="flex justify-between items-start sm:my-3 my-3 w-full relative">
              {showSkeletonLoader ? (
                <SkeletonLoader
                  height="9"
                  width="full"
                  borderRadius="rounded-md"
                />
              ) : (
                <SectionCard
                  {...{ ...section }}
                  infoIcon={infoIcon}
                  title={title}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
