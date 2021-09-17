import React from "react";

interface Props {
  badgeBackgroundColor: string;
  badgeIcon: string;
  titleText: string;
}

const StatusBadge = (props: Props): JSX.Element => {
  const { badgeBackgroundColor, badgeIcon, titleText } = props;
  return (
    <div className="h-fit-content rounded-3xl bg-gray-9">
      <div
        className={`h-20 border-b-2 border-black w-full px-8 py-4 rounded-2xl ${badgeBackgroundColor} flex flex-shrink-0 justify-between items-center`}
      >
        <div className="flex items-center">
          <div
            className="w-6 h-6 mr-3"
            style={{
              backgroundImage: `url(/images/syndicateStatusIcons/${badgeIcon})`,
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></div>
          <p className="text-sm sm:text-lg leading-snug">{titleText}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusBadge;
