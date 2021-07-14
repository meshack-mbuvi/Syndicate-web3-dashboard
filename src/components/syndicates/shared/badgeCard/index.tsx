import { useSelector } from "react-redux";
import { managerActionTexts } from "@/components/syndicates/shared/Constants/managerActions";
import React from "react";
import { SkeletonLoader } from "src/components/skeletonLoader";
import { ProgressIndicator } from "src/components/syndicates/shared/progressIndicator";
import { RootState } from "@/redux/store";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { divideIfNotByZero, isUnlimited } from "@/utils/conversions";
const moment = require("moment");
import "moment-precise-range-plugin";

export const BadgeCard = (props: {
  correctManagerDepositsAllowance?: boolean;
  correctManagerDistributionsAllowance?: boolean;
  accountIsManager?: boolean;
  showManagerSetAllowancesModal?: () => void;
}) => {
  const {
    correctManagerDepositsAllowance,
    correctManagerDistributionsAllowance,
    accountIsManager,
    showManagerSetAllowancesModal,
  } = props;

  const {
    syndicateMemberDetailsReducer: { syndicateDistributionTokens },
    syndicatesReducer: { syndicate },
  } = useSelector((state: RootState) => state);

  // DEFINITIONS
  if (syndicate) {
    var {
      depositTotal,
      depositTotalMax,
      depositERC20TokenSymbol,
      numMembersCurrent,
      distributing,
      depositERC20TokenSymbol,
      closeDate,
      depositsEnabled,
    } = syndicate;

    // get syndicate duration to closure
    const now = moment();
    const closeDateCountdown = moment(closeDate, "DD/MM/YYYY");
    // get precise duration difference using moment's precise range plugin
    // https://momentjs.com/docs/#/plugins/preciserange/
    const durationRemaining = moment.preciseDiff(now, closeDateCountdown, true);

    // destructuring to get values we need
    // The result will otherwise have duration difference all the way down to seconds.
    const { years, months, days } = durationRemaining;
    const durationYears = years
      ? `${years} ${years > 1 ? "years" : "year"}`
      : "";
    const durationMonths = months
      ? `${months} ${months > 1 ? "months" : "month"}`
      : "";
    const durationDays = days ? `${days} ${days > 1 ? "days" : "day"}` : "0 days";
    var remainingDuration = `${durationYears} ${durationMonths} ${durationDays}`.trim();

    // checking if depositsMax is unlimited.
    var depositsMaxIsUnlimited = isUnlimited(depositTotalMax);

    // get percentage of deposits made to the syndicate
    if (!depositsMaxIsUnlimited) {
      var depositsPercentage =
        divideIfNotByZero(depositTotal, depositTotalMax) * 100;
      var currentDepositsPercentage = parseInt(depositsPercentage.toString());
    }
  }

  const {
    insufficientDistributionsAllowanceBadgeText,
    insufficientDepositsAllowanceBadgeText,
  } = managerActionTexts;

  let allowanceInfoText = "";
  if (syndicate?.distributing && !correctManagerDistributionsAllowance) {
    allowanceInfoText = insufficientDistributionsAllowanceBadgeText;
  } else if (depositsEnabled && !correctManagerDepositsAllowance) {
    allowanceInfoText = insufficientDepositsAllowanceBadgeText;
  }

  // set badge background color, title text, and icon based on status of syndicate
  let badgeBackgroundColor = "bg-blue-darker";
  let badgeIcon = "depositIcon.svg";
  let titleText = "Open to deposits";
  if (distributing) {
    badgeBackgroundColor = "bg-green-darker";
    badgeIcon = "distributeIcon.svg";
    titleText = "Distributing";
  } else if (!depositsEnabled && !distributing) {
    badgeBackgroundColor = "bg-green-dark";
    badgeIcon = "operatingIcon.svg";
    titleText = "Operating";
  }

  // bottom card to show details when distributions have been enabled.
  const distributionsDetailCard = (
    <div
      className={`flex justify-start items-start rounded-b-xl border-t border-black ${badgeBackgroundColor} px-6 py-4`}
    >
      <div className="flex-shrink-0 flex flex-col mr-8">
        <p className="text-xs leading-snug text-gray-400 mb-2 font-whyte-light">
          Total Deposits
        </p>
        <p className="text-xs sm:text-sm">
          {floatedNumberWithCommas(depositTotal)} {depositERC20TokenSymbol}
        </p>
      </div>
      <div className="flex flex-col">
        <p className="text-xs leading-snug text-gray-400 mb-2 font-whyte-light">
          Total Distributions
        </p>

        <p className="flex flex-wrap flex-col 1.5lg:flex-row text-xs sm:text-sm">
          {syndicateDistributionTokens &&
            syndicateDistributionTokens.map((token, index) => {
              const { tokenDistributions, tokenSymbol } = token;

              return (
                <div>
                  <span>
                    {/* Adding separators token distributions values 
                    We'll add this before all but the first index */}
                    {index !== 0 && (
                      <span className="hidden 1.5lg:inline text-gray-400 w-2 h-2 mx-2">
                        &#9679;
                      </span>
                    )}
                  </span>
                  <span>
                    {floatedNumberWithCommas(tokenDistributions)} {tokenSymbol}
                  </span>
                </div>
              );
            })}
        </p>
      </div>
    </div>
  );

  // bottom card to show details when the syndicate is in "Operating" state i.e. closed with no distributions
  let operatingDetailsCard = (
    <div
      className={`flex justify-start items-start rounded-b-xl border-t border-black ${badgeBackgroundColor} px-6 py-4`}
    >
      <div className="flex-shrink-0 flex flex-col mr-8">
        <p className="text-xs leading-snug text-gray-400 mb-2 font-whyte-light">
          Total Deposits
        </p>
        <p className="text-xs sm:text-sm">
          {floatedNumberWithCommas(depositTotal)} {depositERC20TokenSymbol}
        </p>
      </div>
      <div className="flex flex-col">
        <p className="text-xs leading-snug text-gray-400 mb-2 font-whyte-light">
          Total Members
        </p>

        <p className="flex flex-wrap flex-col 1.5lg:flex-row text-xs sm:text-sm">
          {numMembersCurrent}
        </p>
      </div>
    </div>
  );

  // bottom card to show the status of the syndicate when it is open to deposits
  let openToDepositsCard = (
    <div
      className={`rounded-b-xl border-t border-black ${badgeBackgroundColor} px-6 py-4`}
    >
      <div className={`flex justify-between items-start `}>
        <div className="flex-shrink-0 flex flex-col mr-8">
          <p className="text-xs leading-snug text-gray-400 mb-2 font-whyte-light">
            Total Deposits
          </p>
          <p className="text-xs sm:text-sm">
            {floatedNumberWithCommas(depositTotal)} {depositERC20TokenSymbol}
          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-xs leading-snug text-gray-400 mb-2 font-whyte-light">
            Amount deposited
          </p>

          <p className="flex flex-wrap flex-col 1.5lg:flex-row text-xs sm:text-sm">
            <span>{floatedNumberWithCommas(depositTotal)}</span>
            <span className="text-gray-400">&nbsp;/&nbsp;</span>
            <span className="text-gray-400">
              {depositsMaxIsUnlimited
                ? "Unlimited"
                : floatedNumberWithCommas(depositTotalMax)}{" "}
              {depositERC20TokenSymbol}{" "}
            </span>
            {!depositsMaxIsUnlimited ? (
              <span className="text-gray-400">{`(${depositsPercentage && depositsPercentage.toFixed(2)}%)`}</span>
            ) : null}
          </p>
        </div>
      </div>

      {/* Only showing progress indicator when percentage is at least 1 */}
      {/* Showing it otherwise will only present a black bar since percentage will be too small */}
      {currentDepositsPercentage > 0 ? (
        <div className="w-full">
          <ProgressIndicator currentProgress={currentDepositsPercentage} />
        </div>
      ) : null}
    </div>
  );

  // set bottom card to display based on syndicate status
  let bottomDetailsCard = openToDepositsCard;
  if (distributing) {
    bottomDetailsCard = distributionsDetailCard;
  } else if (!depositsEnabled && !distributing) {
    bottomDetailsCard = operatingDetailsCard;
  }

  return (
    <div className="w-full mt-6">
      <div className="w-full flex items-center">
        <div className="flex w-full items-center">
          {(syndicate && depositsEnabled) ||
          (syndicate && !depositsEnabled && !distributing) ||
          (syndicate?.distributing && syndicateDistributionTokens?.length) ? (
            <div className="w-full">
              <div
                className={`w-full px-6 py-4 rounded-t-xl ${badgeBackgroundColor} flex flex-shrink-0 justify-between items-center`}
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
                {depositsEnabled ? (
                  <div>
                    <span className="text-sm text-gray-400">
                      Closes in {remainingDuration} on {closeDate}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Card to show more details on the syndicate status */}
              {bottomDetailsCard}

              {/* Manager view: show state of allowances. Card will only be rendered if allowances need adjustments */}
              {(accountIsManager &&
                depositsEnabled &&
                !correctManagerDepositsAllowance) ||
              (accountIsManager &&
                distributing &&
                !correctManagerDistributionsAllowance) ? (
                <div className="rounded-2xl bg-gray-6 border-t-1 border-gray-6 px-0 py-2 mt-4">
                  <div className="flex px-6 py-4 ">
                    <div className="flex flex-shrink-0 items-start">
                      <img
                        src="/images/exclamationDiagonal.svg"
                        className="w-5"
                      />
                    </div>

                    <div className="ml-4">
                      <p className="text-lg leading-snug font-light mb-2">
                        Insufficient Allowance
                      </p>
                      <p className="text-sm font-light text-gray-500 leading-snug mb-2">
                        {allowanceInfoText}
                      </p>
                      <p
                        className="text-sm text-blue font-light cursor-pointer w-fit-content"
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
