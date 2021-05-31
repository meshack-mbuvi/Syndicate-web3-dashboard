import PropTypes from "prop-types";
import React from "react";
import { SkeletonLoader } from "src/components/skeletonLoader";
import { InfoIcon } from "src/components/iconWrappers";
import { managerActionTexts } from "@/components/syndicates/shared/Constants/managerActions";

export const BadgeCard = (props: {
  title;
  subTitle;
  text;
  icon?: JSX.Element;
  syndicate?: any;
  openToDeposits?: boolean;
  correctManagerDepositsAllowance?: boolean;
  correctManagerDistributionsAllowance?: boolean;
  distributionsEnabled?: boolean;
  lpIsManager?: boolean;
  showManagerSetAllowancesModal?: () => void;
}) => {
  const {
    title,
    subTitle,
    text,
    icon,
    syndicate,
    correctManagerDepositsAllowance,
    correctManagerDistributionsAllowance,
    distributionsEnabled,
    lpIsManager,
    showManagerSetAllowancesModal,
    openToDeposits,
  } = props;

  const {
    insufficientDistributionsAllowanceBadgeText,
    insufficientDepositsAllowanceBadgeText,
    syndicateClosedBadgeText,
    sufficientDepositsAllowanceTooltipText,
    sufficientDistributionsAllowanceTooltipText,
  } = managerActionTexts;

  let allowanceInfoText = "";
  if (distributionsEnabled && !correctManagerDistributionsAllowance) {
    allowanceInfoText = insufficientDistributionsAllowanceBadgeText;
  } else if (openToDeposits && !correctManagerDepositsAllowance) {
    allowanceInfoText = insufficientDepositsAllowanceBadgeText;
  } else if (!openToDeposits && !distributionsEnabled) {
    allowanceInfoText = syndicateClosedBadgeText;
  }

  let tooltipText = sufficientDepositsAllowanceTooltipText;
  if (distributionsEnabled) {
    tooltipText = sufficientDistributionsAllowanceTooltipText;
  }

  return (
    <div className="w-full mt-4 m-2">
      <p className="text-xl leading-normal py-1">{title}</p>
      <div className="w-full flex items-center">
        <div className="flex w-full items-center">
          {syndicate ? (
            <div className="w-7/12">
              <div
                className={`w-full mr-2 px-6 py-4 ${
                  lpIsManager ? `rounded-t-custom` : `rounded-custom`
                } bg-gray-nero flex flex-shrink-0 bg-black-eerie`}
              >
                {icon}
                <div className="ml-6">
                  <p className="text-lg leading-snug font-light mb-2">
                    {subTitle}
                  </p>
                  <p className="text-sm text-gray-dim font-light leading-snug">
                    {text}
                  </p>
                </div>
              </div>
              {lpIsManager ? (
                <div className="rounded-b-custom bg-gray-nero border-t-1 border-gray-6 px-0 py-2">
                  {(openToDeposits && correctManagerDepositsAllowance) ||
                  (distributionsEnabled &&
                    correctManagerDistributionsAllowance) ? (
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-light ml-14">
                        Correct allowance set.
                      </p>
                      <div className="text-right flex-shrink-0 mt-1">
                        <InfoIcon tooltip={tooltipText} />
                      </div>
                    </div>
                  ) : !openToDeposits && !distributionsEnabled ? (
                    <div className="flex justify-start items-center px-6 py-4">
                      <img
                        src="/images/exclamationDiagonal.svg"
                        className="w-5"
                      />
                      <p className="text-sm font-light text-gray-dim pr-2 ml-4">
                        {allowanceInfoText}
                      </p>
                    </div>
                  ) : (
                    <div className="flex px-6 py-4 ">
                      <div className="flex flex-shrink-0 items-start">
                        <img
                          src="/images/exclamationDiagonal.svg"
                          className="w-5"
                        />
                      </div>

                      <div className="ml-4">
                        <p className="text-sm leading-snug font-light mb-2">
                          Insufficient Allowance
                        </p>
                        <p className="text-sm font-light text-gray-dim leading-snug mb-2">
                          {allowanceInfoText}
                        </p>
                        <p
                          className="text-sm text-blue-cyan font-light cursor-pointer w-fit-content"
                          onClick={showManagerSetAllowancesModal}
                        >
                          Set New Allowance{" "}
                          <img
                            src="/images/right-arrow.svg"
                            className="inline w-5 h-5"
                          />
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="w-full mr-2">
              <SkeletonLoader width="full" height="16" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

BadgeCard.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
};
