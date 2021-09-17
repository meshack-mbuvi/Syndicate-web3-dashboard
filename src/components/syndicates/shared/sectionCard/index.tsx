import React, { useState } from "react";
import Portal from "@/components/shared/Portal";

// Description of SectionCard props
interface SectionCardProps {
  /** Header text for the section card */
  header: string;
  /** Subtext to render on this component */
  content: any;
  /** Optional property used to determine whether to
   * render the info icon */
  infoIcon?: boolean;
  tooltip: string;
  title?: string;
}

/**
 *
 * @param {object} props
 * @returns
 */
export const SectionCard = (props: SectionCardProps) => {
  const {
    header,
    content,
    tooltip,
    infoIcon = true,
    title = "My Stats",
  } = props;
  const greenSubtext =
    header === "Total Withdraws / Distributions To Date" ||
    header === "Total Distributions / Deposits";

  const [coord, setCoords] = useState({});
  const [isOn, setOn] = useState(false);

  return (
    <div>
      {isOn ? (
        <Portal>
          <div className={`absolute z-10`} style={{ ...coord }}>
            {!infoIcon ? null : (
              <div className="text-sm font-light tooltiptext w-fit-content bg-gray-9 p-4 rounded-lg text-gray-lightManatee max-w-xs">
                {tooltip}
              </div>
            )}
          </div>
        </Portal>
      ) : null}
      <div
        onMouseEnter={(e) => {
          setOn(true);
          const rect = (e.target as HTMLElement).getBoundingClientRect();
          setCoords({
            left: rect.x + rect.width / 2, // add half the width of the button for centering
            top: rect.y + window.scrollY - 50, // add scrollY offset, as soon as getBountingClientRect takes on screen coords
          });
        }}
        onMouseLeave={() => {
          setOn(false);
        }}
      >
        <p className="text-base text-gray-500 leading-loose">
          {header?.toString()}
        </p>
        <p
          className={
            greenSubtext
              ? "text-base text-green-screamin leading-5"
              : "text-base leading-5"
          }
        >
          {content}
        </p>
      </div>
    </div>
  );
};
