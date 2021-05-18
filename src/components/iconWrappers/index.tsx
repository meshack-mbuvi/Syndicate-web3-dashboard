import React from "react";

/**
 * This icon wrapper contains an inverted exclamation mark sourced from the
 * figma designs on the syndicate form.
 * The wrapper renders an image with src attribute set to the custom svg icon
 * @param {object} props an object containing custom properties for styling
 */
export const InfoIcon = (props: { toolTip?: string }) => {
  const { toolTip, ...rest } = props;
  return (
    <div>
      <div className="tooltip">
        <img src="/images/info.svg" {...rest} className="image-tooltip" />
        {toolTip ? (
          <p className="tooltiptext w-fit-content mt-1">{toolTip}</p>
        ) : null}
      </div>
    </div>
  );
};

/**Shows an icon for external links */
export const ExternalLinkIcon = (props) => (
  <img src="/images/externalLink.svg" {...props} />
);
