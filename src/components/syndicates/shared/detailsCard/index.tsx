import { InfoIcon } from "@/components/iconWrappers";
import React from "react";
import { useSelector } from "react-redux";
import { SkeletonLoader } from "src/components/skeletonLoader";
import { RootState } from "src/redux/store";
import { syndicateDetailsConstants } from "../Constants";
import { SectionCard } from "../sectionCard";

/**
 * @param {} props
 * @returns
 */
export const DetailsCard = (props: {
  sections;
  title: string;
  customStyles: string;
  infoIcon?: boolean;
  customInnerWidth?: string;
  syndicateDetails?: boolean;
  syndicate?: any;
  loadingLPDetails?: boolean;
}) => {
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

  const { syndicateModifiableText } = syndicateDetailsConstants;

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
      syndicate.distributionsEnabled &&
      !distributionTokensAllowanceDetails.length &&
      !syndicateDetails) ||
    (syndicateMemberDetailsLoading && title === "My Stats") ||
    (!syndicateDistributionTokens &&
      title === "My Stats" &&
      syndicate.distributionsEnabled);

  const modifiableTooltip = (
    <div className="relative bg-gray-9 p-4 text-sm">
      <p className="mb-2">
        This means the syndicate manager can manually change:
      </p>
      <li className="ml-2">Deposits while this syndicate is open</li>
      <li className="ml-2">Distributions while this syndicate is closed</li>
    </div>
  );

  return (
    <div className={`h-fit-content ${customStyles}`}>
      {showSkeletonLoader ? (
        <div className="mb-4">
          <SkeletonLoader height="9" width="full" borderRadius="rounded-md" />
        </div>
      ) : (
        <div className={`flex ${customInnerWidth} justify-between`}>
          <p className="fold-bold text-xl">{title}</p>
        </div>
      )}

      {title.toLowerCase() === "details" && syndicate?.modifiable ? (
        <div className="w-full mt-4 mb-2">
          <div className=" w-full rounded-2xl bg-gray-6 border-t-1 border-gray-6 py-4">
            <div className="flex justify-start items-center pl-6 py-2">
              <img src="/images/exclamationDiagonal.svg" className="w-5" />
              <p className="text-lg leading-snug font-light pr-2 ml-6">
                {syndicateModifiableText}
              </p>
              <div className="ml-auto flex-shrink-0">
                <InfoIcon tooltip={modifiableTooltip} />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className={`${customInnerWidth}`}>
        {sections.map((section, index) => (
          <div
            className="flex justify-start visibility-container target-l-12"
            key={index}
          >
            <div className="flex justify-between items-center sm:my-3 my-3 w-full">
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
