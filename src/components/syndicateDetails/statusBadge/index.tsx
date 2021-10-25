import React from "react";

interface Props {
  distributing: boolean;
  depositsEnabled: boolean;
}

const StatusBadge = (props: Props): JSX.Element => {
  const { distributing, depositsEnabled } = props;

  let badgeBackgroundColor = "bg-blue-darker";
  let badgeIcon = "depositIcon.svg";
  let titleText = "Open to deposits";
  if (distributing) {
    badgeBackgroundColor = "bg-green-darker";
    badgeIcon = "distributeIcon.svg";
    titleText = "Distributing";
  } else if (!depositsEnabled && !distributing) {
    badgeBackgroundColor = "bg-green-dark";
    badgeIcon = "active.svg";
    titleText = "Active";
  }

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
