import React from "react";
import PropTypes from "prop-types";

import { SectionCard } from "../sectionCard";
import { InfoIcon } from "src/components/iconWrappers";

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
}) => {
  const {
    sections = [],
    title = "My Stats",
    customStyles = "",
    infoIcon,
    customInnerWidth = "",
  } = props;

  return (
    <div className={`h-fit-content ${customStyles}`}>
      <div className={`flex ${customInnerWidth} justify-between`}>
        <p className="fold-bold  text-xl">{title}</p>
        {infoIcon ? (
          <div className="flex align-center">
            <InfoIcon />
          </div>
        ) : null}
      </div>

      <div className={`pl-4 ${customInnerWidth}`}>
        {sections.map((section, index) => (
          <div className="flex justify-between sm:my-4" key={index}>
            <SectionCard {...{ ...section }} infoIcon={!infoIcon} />
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
