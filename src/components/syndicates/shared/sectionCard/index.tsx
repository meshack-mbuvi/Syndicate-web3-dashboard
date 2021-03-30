import React from "react";
import PropTypes from "prop-types";

import { InfoIcon } from "src/components/iconWrappers";

/**
 *
 * @param {object} props
 * @returns
 */
export const SectionCard = (props) => {
  const { header, subText } = props;

  return (
    <>
      <div>
        <p className="text-gray-dim leading-loose">{header?.toString()}</p>
        <p className="leading-loose font-ibm">{subText?.toString()}</p>
      </div>
      <div>
        <InfoIcon />
      </div>
    </>
  );
};

SectionCard.propTypes = {
  header: PropTypes.string.isRequired,
  subText: PropTypes.any.isRequired,
};
