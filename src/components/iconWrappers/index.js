import React from "react";
import info from "src/images/info.svg";
import externalLink from "src/images/externalLink.svg";

/**
 * This icon wrapper contains an inverted exclamation mark sourced from the
 * figma designs on the syndicate form.
 * The wrapper renders an image with src attribute set to the custom svg icon
 * @param {object} props an object containing custom properties for styling
 */
export const InfoIcon = (props) => <img src={info} {...props} />;

/**Shows an icon for external links */
export const ExternalLinkIcon = (props) => (
  <img src={externalLink} {...props} />
);
