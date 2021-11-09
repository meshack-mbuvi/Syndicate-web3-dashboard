import Portal from "@/components/shared/Portal";
import React, { FC, useRef, useState } from "react";

// Description of SectionCard props
export interface SectionCardProps {
  /** Header text for the section card */
  header: string;
  /** Subtext to render on this component */
  content: any;
  /** Optional property used to determine whether to
   * render the info icon */
  infoIcon?: boolean;
  tooltip?: string;
  title?: string;
}

/**
 *
 * @param {object} props
 * @returns
 */

export const SectionCard: FC<SectionCardProps> = (props) => {
  const { header, content, tooltip, infoIcon = true } = props;
  const greenSubtext =
    header === "Total Withdraws / Distributions To Date" ||
    header === "Total Distributions / Deposits";

  const [coord, setCoords] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const tooltipRef = useRef(null);

  const open = Boolean(anchorEl);
  return (
    <div className="relative">
      <Portal>
        <div
          className={`absolute z-10 pointer-events-none ${
            open ? "visible" : "invisible"
          } w-56`}
          style={{ ...coord }}
        >
          {!infoIcon ? null : tooltip ? (
            <div
              ref={tooltipRef}
              className="text-sm font-light tooltiptext w-fit-content bg-gray-9 p-4 rounded-lg text-gray-lightManatee max-w-xs"
            >
              {tooltip}
            </div>
          ) : null}
        </div>
      </Portal>
      <div
        onMouseEnter={(e) => {
          handlePopoverOpen(e);
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setCoords({
            left: rect.left, // add half the width of the button for centering
            top: `${rect.y + 60}px`, // add scrollY offset, as soon as getBountingClientRect takes on screen coords
          });
        }}
        onMouseLeave={() => {
          handlePopoverClose();
        }}
      >
        <p className="text-gray-syn4 leading-6 pb-2">{header?.toString()}</p>
        <p
          className={
            greenSubtext ? "text-base text-green-screamin" : "text-base"
          }
        >
          {content}
        </p>
      </div>
    </div>
  );
};
