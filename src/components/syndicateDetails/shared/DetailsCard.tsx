import React from "react";
import PropTypes from "prop-types";
import { InfoIcon } from "src/components/iconWrappers";

/**
 * TODO: update propType validation
 * @param {} props
 * @returns
 */
export const DetailsCard = (props: { sections; title: string }) => {
  const { sections = [], title = "My Stats" } = props;

  return (
    <>
      <p className="text-xl font-semibold pt-6">{title}</p>
      {sections.map(({ header, subText, isEditable }, index) => (
        <div className="w-full flex items-center" key={index}>
          <div className="w-1/2 pl-6 pt-6">
            <div className="text-gray-dim leading-loose">{header}</div>
            <div className={"leading-loose font-ibm"}>{subText}</div>
          </div>
          <div className="w-10">
            <InfoIcon />
          </div>
          {isEditable && (
            <button className="ml-12 px-9 py-2 h-10 rounded-3xl bg-blue-deepAzure text-blue-light">
              Edit
            </button>
          )}
        </div>
      ))}
    </>
  );
};

DetailsCard.propTypes = {
  sections: PropTypes.any,
  title: PropTypes.string,
};
