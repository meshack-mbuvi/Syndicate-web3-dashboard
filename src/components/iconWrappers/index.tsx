import { omit } from "lodash";
import React from "react";

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
  src?: string;
}): JSX.Element => {
  const { tooltip, side, iconSize, src = "/images/info.svg" } = props;
  return (
    <div className="flex-shrink-0 flex items-center justify-center">
      <div className="tooltip pl-2">
        <img
          src={src}
          {...props}
          className={`image-tooltip ${iconSize ? iconSize : ``}`}
          alt=""
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

export const CopyLinkIcon = (props: {
  color?: string;
  width?: string;
  height?: string;
}): JSX.Element => {
  const { color = "#000", width = "16", height = "16" } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={color}
    >
      <path
        d="M7.90569 11.1011L8.90911 10.0848C7.91324 10.0095 7.26441 9.70841 6.77402 9.21908C5.45373 7.90167 5.46128 6.0347 6.76647 4.73234L9.22598 2.27819C10.5463 0.968301 12.4022 0.960773 13.7225 2.27819C15.0428 3.5956 15.0277 5.45504 13.7225 6.7574L12.2438 8.2329C12.455 8.7147 12.5003 9.27178 12.4248 9.7611L14.6429 7.55537C16.4461 5.74863 16.4612 3.19661 14.6354 1.36729C12.8021 -0.462035 10.2369 -0.446978 8.42626 1.35976L5.85359 3.93437C4.04291 5.74111 4.02782 8.30065 5.86113 10.1224C6.33644 10.5967 6.94 10.9355 7.90569 11.1011ZM8.09431 4.89796L7.09089 5.91425C8.08676 5.99706 8.73559 6.29066 9.22598 6.77998C10.5463 8.0974 10.5387 9.96436 9.23353 11.2667L6.76647 13.7209C5.45373 15.0308 3.59778 15.0383 2.2775 13.7284C0.95721 12.4035 0.964754 10.5516 2.2775 9.24166L3.75622 7.76616C3.54497 7.29189 3.49216 6.72728 3.57515 6.23796L1.35707 8.44369C-0.446067 10.2504 -0.461156 12.81 1.36461 14.6318C3.19793 16.4611 5.76306 16.446 7.56619 14.6468L10.1464 12.0647C11.9571 10.258 11.9722 7.69841 10.1389 5.87661C9.66356 5.40234 9.06 5.06358 8.09431 4.89796Z"
        className="fill-current"
      />
    </svg>
  );
};

export const CopiedLinkIcon = ({
  color = "text-green",
  width = "16",
  height = "16",
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={color}
    >
      <path
        d="M5.3125 13.8125C5.72656 13.8125 6.04688 13.6406 6.27344 13.3047L13.6172 1.86719C13.7812 1.60938 13.8516 1.39062 13.8516 1.17969C13.8516 0.625 13.4609 0.242188 12.8984 0.242188C12.5156 0.242188 12.2812 0.382812 12.0469 0.75L5.27344 11.4922L1.79688 7.03125C1.5625 6.72656 1.32031 6.60156 0.976562 6.60156C0.414062 6.60156 0.0078125 7 0.0078125 7.54688C0.0078125 7.78906 0.09375 8.02344 0.296875 8.26562L4.34375 13.3125C4.61719 13.6562 4.90625 13.8125 5.3125 13.8125Z"
        className="fill-current"
      />
    </svg>
  );
};

export const LockIcon = ({
  color = "text-green",
  width = "16",
  height = "16",
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={color}
    >
      <path
        d="M2.08084 16H9.91916C10.9813 16 11.5 15.4751 11.5 14.327V8.30753C11.5 7.27422 11.0719 6.74116 10.1909 6.65095V4.58432C10.1909 1.49257 8.15719 0 6 0C3.84281 0 1.80913 1.49257 1.80913 4.58432V6.69195C1.00225 6.81497 0.5 7.33983 0.5 8.30753V14.327C0.5 15.4751 1.01871 16 2.08084 16ZM3.13473 4.4121C3.13473 2.35366 4.46033 1.26294 6 1.26294C7.53967 1.26294 8.86527 2.35366 8.86527 4.4121V6.64275L3.13473 6.65095V4.4121Z"
        className="fill-current"
      />
    </svg>
  );
};
