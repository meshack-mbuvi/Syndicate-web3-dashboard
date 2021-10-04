import React from "react";

interface Props {
  badgeBackgroundColor: string;
  badgeIcon: string;
  titleText: string;
}

const StatusBadge = (props: Props): JSX.Element => {
  const { badgeBackgroundColor, badgeIcon, titleText } = props;
  return (
    <div className="h-fit-content rounded-3xl bg-gray-syn8">
      <div
        className={`h-20 border-b-2 border-black w-full px-6 py-4 rounded-2xl ${badgeBackgroundColor} flex flex-shrink-0 justify-between items-center`}
      >
        <div className="flex items-center">
          <div className="w-6 h-6">
            <img
              src={`/images/syndicateStatusIcons/${badgeIcon}`}
              alt={titleText}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
          <p className="text-sm sm:text-lg leading-snug ml-3">{titleText}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusBadge;
