import React from "react";

/**
 * This icon wrapper contains an inverted exclamation mark sourced from the
 * figma designs on the syndicate form.
 * The wrapper renders an image with src attribute set to the custom svg icon
 * @param {object} props an object containing custom properties for styling
 */
export const InfoIcon = (props: { tooltip?: string | React.ReactNode }) => {
  const { tooltip } = props;
  return (
    <div className="flex-shrink-0 flex items-center justify-center">
      <div className="tooltip px-4">
        <img src="/images/info.svg" {...props} className="image-tooltip" />
        {tooltip ? (
          typeof tooltip === "string" ? (
            <p className="text-sm font-light tooltiptext w-fit-content mt-1">
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
export const ExternalLinkIcon = (props) => (
  <img src="/images/externalLink.svg" {...props} />
);
