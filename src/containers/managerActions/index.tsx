import React, { useState } from "react";
import ErrorBoundary from "../../components/errorBoundary";
import DistributeToken from "./distributeToken";
import ManagerAction from "./ManagerAction";
import MoreManagerActions from "./MoreManagerActions";
import PreApproveDepositor from "./preApproveDepositor";

const moreActions = [
  {
    icon: <img src="/images/invertedInfo.svg" />,
    text: "Overwrite syndicate cap table",
  },
  {
    icon: <img src="/images/exclamation-triangle.svg" />,
    text: "Reject deposit or depositor address",
  },
  {
    icon: <img src="/images/settings.svg" />,
    text: "Change syndicate settings",
  },
];

const ManagerActions = () => {
  const [showDistributeToken, setShowDistributeToken] = useState(false);
  const [showPreApproveDepositor, setShowPreApproveDepositor] = useState(false);

  const actions = [
    {
      icon: <img src="/images/server.svg" />,
      title: "Distribute tokens back to depositors",
      onClickHandler: () => setShowDistributeToken(true),
      description:
        "Distribute tokens back to depositors and make them available for withdraw.",
    },
    {
      icon: <img src="/images/UserPlus.svg" />,
      title: "Pre-approve depositor addresses",
      onClickHandler: () => setShowPreApproveDepositor(true),
      description:
        "Pre-approve accredited investor addresses that can deposit into this syndicate.",
    },
    {
      icon: <img src="/images/socialProfile.svg" />,
      title: "Create a public-facing social profile",
      onClickHandler: () => console.log("move to create social profile"),
      description:
        "Help others understand this syndicate by requesting a social profile. We’ll help you create it.",
    },
  ];

  return (
    <ErrorBoundary>
      <div className="w-full lg:w-2/5 mt-4 sm:mt-0">
        <div className="h-fit-content rounded-custom p-4 md:mx-2 md:p-6 bg-gray-9 mt-6 md:mt-0">
          <div className="text-xl font-inter">Manager Actions</div>
          <div className="flex h-12 rounded-custom items-center">
            <img src="/images/rightPointedHand.svg" className="mr-2" />
            <div className="text-gray-dim leading-snug">
              You manage this syndicate
            </div>
          </div>
          {actions.map(({ icon, title, description, onClickHandler }) => {
            return (
              <div key={title}>
                <ManagerAction
                  title={title}
                  description={description}
                  icon={icon}
                  onClickHandler={onClickHandler}
                />
              </div>
            );
          })}
        </div>
        <div className="p-0 md:p-2">
          <div className="font-semibold tracking-widest text-sm leading-6 text-gray-matterhorn my-6 mx-4">
            MORE
          </div>
          {moreActions.map(({ icon, text }) => (
            <MoreManagerActions key={text} icon={icon} text={text} />
          ))}
        </div>
        {showDistributeToken ? (
          <DistributeToken
            {...{ showDistributeToken, setShowDistributeToken }}
          />
        ) : showPreApproveDepositor ? (
          <PreApproveDepositor
            {...{ showPreApproveDepositor, setShowPreApproveDepositor }}
          />
        ) : null}
      </div>
    </ErrorBoundary>
  );
};

export default ManagerActions;
