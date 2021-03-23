import React from "react";
import PropTypes from "prop-types";

import { SectionCard } from "../sectionCard";

/**
 * TODO: update propType validation
 * @param {} props
 * @returns
 */
export const DetailsCard = (props) => {
  const { sections = [], title = "My Stats", customStyles = "" } = props;

  return (
    <div className={`h-fit-content bg-gray-9 ${customStyles}`}>
      <p className="fold-bold text-xl">{title}</p>

      <div className="pl-4 w-full">
        {sections.map((section, index) => (
          <div className="flex justify-between sm:my-4" key={index}>
            <SectionCard {...{ ...section }} />
          </div>
        ))}
      </div>
    </div>
  );
};

DetailsCard.propTypes = {
  props: PropTypes.any,
};
