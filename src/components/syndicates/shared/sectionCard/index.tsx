import React from "react";
import PropTypes from "prop-types";

import { InfoIcon } from "src/components/iconWrappers";

// Description of SectionCard props
interface SectionCardProps {
  /** Header text for the section card */
  header: string;
  /** Subtext to render on this component */
  subText: string | number;
  /** Optional property used to determine whether to
   * render the info icon */
  infoIcon?: boolean;
}

/**
 *
 * @param {object} props
 * @returns
 */
export const SectionCard = (props: SectionCardProps) => {
  const { header, subText, infoIcon = true } = props;

  return (
    <>
      <div>
        <p className="text-gray-dim leading-loose">{header?.toString()}</p>
        <p
          className={
            header === "Total Withdraws / Deposits"
              ? "text-green-screamin leading-loose font-ibm"
              : "leading-loose font-ibm"
          }
        >
          {subText?.toString()}
        </p>
      </div>
      {!infoIcon ? null : (
        <div>
          <InfoIcon />
        </div>
      )}
    </>
  );
};

SectionCard.propTypes = {
  header: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
  infoIcon: PropTypes.bool,
  key: PropTypes.number,
};
