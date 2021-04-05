import React from "react";

/**
 * This icon wrapper contains an inverted exclamation mark sourced from the
 * figma designs on the syndicate form.
 * The wrapper renders an image with src attribute set to the custom svg icon
 * @param {object} props an object containing custom properties for styling
 */
export const InfoIcon = (props) => <img src="/images/info.svg" {...props} />;

/**Shows an icon for external links */
export const ExternalLinkIcon = (props) => (
  <img src="/images/externalLink.svg" {...props} />
);
