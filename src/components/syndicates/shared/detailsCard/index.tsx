import PropTypes from "prop-types";
import React from "react";
import { InfoIcon } from "src/components/iconWrappers";
import { EditButton } from "src/components/syndicates/shared/editButton";
import { SectionCard } from "../sectionCard";

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
}) => {
  const {
    sections = [],
    title = "My Stats",
    customStyles = "",
    infoIcon,
    customInnerWidth = "",
    syndicateDetails = false,
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
              }`}>
              <SectionCard {...{ ...section }} infoIcon={infoIcon} />
            </div>
            {section?.isEditable ? (
              <div className="sm:my-4 flex w-1/4 items-center">
                <EditButton />
              </div>
            ) : null}
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
