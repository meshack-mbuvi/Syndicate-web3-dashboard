import PropTypes from "prop-types";
import React from "react";
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

  return (
    <div className={`h-fit-content ${customStyles}`}>
      <div className={`flex ${customInnerWidth} justify-between`}>
        <p className="fold-bold text-xl">{title}</p>
      </div>

      <div className={`pl-4 ${customInnerWidth}`}>
        {sections.map((section, index) => (
          <div className="flex justify-start" key={index}>
            <div
              className={`flex justify-between items-center sm:my-4 ${
                syndicateDetails ? "w-7/12" : "w-full"
              }`}
            >
              {!syndicate || (loadingLPDetails && !syndicateDetails )? (
                <SkeletonLoader height="8" width="full" />
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
