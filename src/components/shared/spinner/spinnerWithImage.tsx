import React from "react";

interface ISpinner {
  height?: string;
  width?: string;
  strokeWidth?: string;
  icon?: string;
}

/**svg spinner with image/icon at the center. 
 * @param height height of the spinner
 * @param width width of the spinner
 * @param strokeWidth how thick the circle element of the svg should be
 * @param icon the url of the icon. Set this to null if you don't want to display an icon */
export const SpinnerWithImage: React.FC<ISpinner> = (props) => {
  const {
    height = "h-28",
    width = "w-28",
    strokeWidth = "4",
    icon = "/images/metamaskIcon.svg",
  } = props;
  return (
    <div className="flex justify-center">
      <span className={`relative ${height} ${width}`}>
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 spinner"
        >
          <defs>
            <linearGradient id="gradient">
              <stop offset="0%" stopColor="#ffffff"></stop>
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
          ></circle>
        </svg>
        {icon ? (
          <div className="flex justify-center items-center w-full h-full">
            <img alt="icon" src={icon} className="inline w-6 sm:w-10" />
          </div>
        ) : null}
      </span>
    </div>
  );
};
