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

  const { distributionTokensAllowanceDetails } = useSelector(
    (state: RootState) => state.tokenDetailsReducer
  );

  const { syndicateAction } = useSelector(
    (state: RootState) => state.web3Reducer
  );

  const { withdraw } = syndicateAction;

  //conditions under which the skeleton loader should be rendered.
  const showSkeletonLoader =
    !syndicate ||
    (loadingLPDetails && !syndicateDetails) ||
    (withdraw &&
      syndicate &&
      syndicate.distributionsEnabled &&
      !distributionTokensAllowanceDetails.length &&
      !syndicateDetails);

  const modifiableTooltip = (
    <div className="text-left text-sm">
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
        <div className="pl-4 mb-4">
          <SkeletonLoader height="9" width="full" borderRadius="rounded-md" />
        </div>
      ) : (
        <div className={`flex ${customInnerWidth} justify-between`}>
          <p className="fold-bold text-xl">{title}</p>
        </div>
      )}

      {title.toLowerCase() === "details" && syndicate?.modifiable ? (
        <div className="w-full mt-4 m-2">
          <div className=" w-7/12 rounded-custom bg-gray-nero border-t-1 border-gray-6 py-2">
            <div className="flex justify-start items-center pl-4 py-2">
              <img src="/images/exclamationDiagonal.svg" className="w-5" />
              <p className="text-sm leading-snug font-whyte-light pr-2 ml-6">
                {syndicateModifiableText}
              </p>
              <div className="ml-auto flex-shrink-0">
                <InfoIcon tooltip={modifiableTooltip} />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className={`pl-4 ${customInnerWidth}`}>
        {sections.map((section, index) => (
          <div className="flex justify-start" key={index}>
            <div
              className={`flex justify-between items-center sm:my-4 ${
                syndicateDetails ? "w-7/12" : "w-full"
              }`}
            >
              {showSkeletonLoader ? (
                <SkeletonLoader
                  height="9"
                  width="full"
                  borderRadius="rounded-md"
                />
              ) : (
                <SectionCard {...{ ...section }} infoIcon={infoIcon} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
