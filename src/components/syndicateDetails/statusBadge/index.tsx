import React from "react";

interface Props {
  depositsEnabled: boolean;
  depositExceedTotal?: boolean;
}

const StatusBadge = (props: Props): JSX.Element => {
  const { depositsEnabled, depositExceedTotal } = props;

  let badgeBackgroundColor = "bg-blue-darker";
  let badgeIcon = "depositIcon.svg";
  let titleText = "Open to deposits";
  if (!depositsEnabled) {
    badgeBackgroundColor = "bg-green-dark";
    badgeIcon = "active.svg";
    titleText = "Active";
  } else if (depositExceedTotal) {
    badgeBackgroundColor = "bg-blue-darker";
    badgeIcon = "depositReachedIcon.svg";
    titleText = "Fully deposited";
  }
  return (
    <div className="h-fit-content rounded-3xl bg-gray-syn8">
      <div
        className={`h-20 ring ring-black w-full px-8 py-4 rounded-2xl ${badgeBackgroundColor} flex flex-shrink-0 justify-between items-center`}
      >
        <div className="flex items-center space-x-4">
          <div className="w-6 h-6">
            <img
              src={`/images/syndicateStatusIcons/${badgeIcon}`}
              alt={titleText}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
          <p className="text-xl leading-snug">{titleText}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusBadge;
