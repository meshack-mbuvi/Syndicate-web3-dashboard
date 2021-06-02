import React from "react";
import { InfoIcon } from "src/components/iconWrappers";

// Description of SectionCard props
interface SectionCardProps {
  /** Header text for the section card */
  header: string;
  /** Subtext to render on this component */
  subText: any;
  /** Optional property used to determine whether to
   * render the info icon */
  infoIcon?: boolean;
  tooltip: string;
}

/**
 *
 * @param {object} props
 * @returns
 */
export const SectionCard = (props: SectionCardProps) => {
  const { header, subText, tooltip, infoIcon = true } = props;
  const greenSubtext =
    header === "Total Withdraws / Deposits" ||
    header === "Total Distributions / Deposits";

  return (
    <>
      <div>
        <p className="text-lg text-gray-dim leading-loose">
          {header?.toString()}
        </p>
        <p
          className={
            greenSubtext
              ? "text-base text-green-screamin leading-5"
              : "text-base leading-5"
          }>
          {subText?.toString()}
        </p>
      </div>
      {!infoIcon ? null : (
        <div className="flex">
          <InfoIcon tooltip={tooltip} />
        </div>
      )}
    </>
  );
};
