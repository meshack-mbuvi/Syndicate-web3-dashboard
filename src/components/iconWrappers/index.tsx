import React from "react";
import { omit } from "lodash";

/**
 * This icon wrapper contains an inverted exclamation mark sourced from the
 * figma designs on the syndicate form.
 * The wrapper renders an image with src attribute set to the custom svg icon
 * @param {object} props an object containing custom properties for styling
 */
export const InfoIcon = (props: {
  tooltip?: string | React.ReactNode;
  side?: string;
  iconSize?: string;
}) => {
  const { tooltip, side, iconSize } = props;
  return (
    <div className="flex-shrink-0 flex items-center justify-center">
      <div className="tooltip px-4">
        <img
          src="/images/info.svg"
          {...props}
          className={`image-tooltip ${iconSize ? iconSize : ``}`}
        />
        {tooltip ? (
          typeof tooltip === "string" ? (
            <p
              className={`${
                side === "left" ? "left" : ""
              } text-sm font-light tooltiptext w-fit-content bg-gray-9 p-4 mt-1`}
            >
              {tooltip}
            </p>
          ) : (
            <div className="tooltiptext">{tooltip}</div>
          )
        ) : null}
      </div>
    </div>
  );
};

/**Shows an icon for external links */
export const ExternalLinkIcon = (props) => {
  const { grayIcon } = props;
  omit(props, "grayIcon");
  return !grayIcon ? (
    <img src="/images/externalLink.svg" {...props} alt="extenal-link" />
  ) : (
    <img src="/images/externalLinkGray.svg" {...props} alt="extenal-link" />
  );
};
