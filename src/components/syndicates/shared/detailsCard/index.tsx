import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import { SectionCard } from "../sectionCard";
import { SkeletonLoader } from "src/components/skeletonLoader";

/**
 * TODO: update propType validation
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
      !distributionTokensAllowanceDetails.length &&
      !syndicateDetails);

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

DetailsCard.propTypes = {
  sections: PropTypes.any,
  title: PropTypes.string,
  customStyles: PropTypes.string,
};
