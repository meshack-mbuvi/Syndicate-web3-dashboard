import { useRouter } from "next/router";
import ReactTooltip from "react-tooltip";
import RightPlaceHolder from "@/components/rightPlaceholder";
import { RootState } from "@/redux/store";
import { numberWithCommas } from "@/utils/formattedNumbers";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ContentTitle } from "../shared";
import { NonEditableSetting } from "@/containers/create/shared/NonEditableSetting";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";

const Confirmation: React.FC = () => {
  const {
    tokenAndDepositLimitReducer: {
      createSyndicate: {
        tokenAndDepositsLimits: {
          depositTotalMax,
          numMembersMax,
          depositMemberMin,
          depositMemberMax,
          depositTokenDetails: {
            depositTokenName,
            depositTokenSymbol,
            depositTokenLogo,
          },
        },
      },
    },
    feesAndDistributionReducer: {
      createSyndicate: {
        feesAndDistribution: {
          expectedAnnualOperatingFees,
          profitShareToSyndicateLead,
          syndicateProfitSharePercent,
        },
      },
    },
    allowlistReducer: {
      createSyndicate: {
        allowlist: { isAllowlistEnabled },
      },
    },
    modifiableReducer: {
      createSyndicate: { modifiable },
    },
    transferableReducer: {
      createSyndicate: { transferable },
    },
    closeDateAndTimeReducer: {
      createSyndicate: {
        closeDateAndTime: { selectedDate, selectedTimeValue, selectedTimezone },
      },
    },
  } = useSelector((state: RootState) => state);

  const allowList = isAllowlistEnabled ? "enabled" : "disabled";

  const {
    handleTemplateSubstepNext,
    templateMaxTotalError,
    setContinueDisabled,
    currentTemplate: { depositTokenEditable },
  } = useCreateSyndicateContext();

  // check if a template is in use
  const router = useRouter();
  const { pathname } = router;
  const templateInUse = pathname.includes("template");

  // hover styles when template is in use
  // This is to make it more apparent that the fields can be clicked and edited
  // remove this if it's not desirable.
  const hoverStyles = templateInUse
    ? "rounded-lg cursor-pointer hover:bg-gray-9"
    : "";

  // disable the continue button if there is a max. total deposits error.
  // The user overrode the template default for the above value which means
  // that the max. member deposit needs to be lowered (it's set to unlimited by default)
  useEffect(() => {
    if (templateMaxTotalError) {
      setContinueDisabled(true);
    }
  }, [templateInUse, templateMaxTotalError]);

  // disable editing deposit token setting for syndicate templates.
  const handleDepositTokenEdit = () => {
    if (depositTokenEditable) {
      handleTemplateSubstepNext(1, 0);
    } else {
      return;
    }
  };

  return (
    <div className="flex flex-col font-whyte">
      <ContentTitle>
        <>
          <span>Confirm everything looks right</span>
          {templateInUse ? (
            <span className="block mt-2 text-sm text-gray-spindle">
              Click any of the details below to edit
            </span>
          ) : null}
        </>
      </ContentTitle>

      <ul className="text-base font-whyte">
        <li
          className={`p-2 ${
            depositTokenEditable
              ? hoverStyles
              : "cursor-default w-fit-content"
          }`}
          data-for="edit-deposit-token"
          data-tip
          onClick={() => handleDepositTokenEdit()}
        >
          {templateInUse && !depositTokenEditable ? (
            <ReactTooltip id="edit-deposit-token" place="right" effect="solid">
              Deposit token can't be modified when using a template.
            </ReactTooltip>
          ) : null}
          <p className="text-gray-dimmer mb-1 font-whyte">
            Deposit Token{templateInUse ? "*" : null}
          </p>
          <div className="flex items-center w-fit-content">
            <img
              src={depositTokenLogo}
              className="h-5 w-5"
              alt="logo"
              aria-hidden="true"
            />

            <p className="ml-1">{depositTokenName}</p>
          </div>
        </li>
        <li
          className={`p-2 ${hoverStyles}`}
          onClick={() => handleTemplateSubstepNext(1, 1)}
        >
          <p className="text-gray-dimmer mb-1">Max total deposits</p>
          <p>
            {depositTotalMax ? numberWithCommas(depositTotalMax) : "Unlimited"}
            &nbsp;
            <span className="uppercase">{depositTokenSymbol}</span>
          </p>
        </li>
        <li
          className={`p-2 ${hoverStyles}`}
          onClick={() => handleTemplateSubstepNext(1, 1)}
        >
          <p className="text-gray-dimmer mb-1">Max number of people</p>
          <p>
            {numMembersMax
              ? numMembersMax > 1
                ? `${numberWithCommas(numMembersMax as string)} people`
                : `${numMembersMax} person`
              : "Unlimited"}
          </p>
        </li>
        <li
          className={`p-2 ${hoverStyles}`}
          onClick={() => handleTemplateSubstepNext(1, 1)}
        >
          <p className="text-gray-dimmer mb-1">
            Allowed deposits per person{" "}
            {templateInUse && templateMaxTotalError && (
              <span className="text-red-500 text-sm">
                ({templateMaxTotalError})
              </span>
            )}
          </p>
          <p>
            {depositMemberMin ? `${numberWithCommas(depositMemberMin)}` : "0"}
            <span> - </span>
            {depositMemberMax
              ? `${numberWithCommas(depositMemberMax)}`
              : "Unlimited"}
            <span className="uppercase"> {depositTokenSymbol}</span>
          </p>
        </li>
        <li
          className={`p-2 ${hoverStyles}`}
          onClick={() => handleTemplateSubstepNext(1, 2)}
        >
          <p className="text-gray-dimmer mb-1">Close time</p>
          <p>
            {selectedTimeValue} UTC {selectedTimezone.timezone} on{" "}
            {new Date(selectedDate).toLocaleDateString()}
          </p>
        </li>
        <li
          className={`p-2 ${hoverStyles}`}
          onClick={() => handleTemplateSubstepNext(1, 3)}
        >
          <p className="text-gray-dimmer mb-1">Expected annual operating fee</p>
          <p>{expectedAnnualOperatingFees}%</p>
        </li>
        <li
          className={`p-2 ${hoverStyles}`}
          onClick={() => handleTemplateSubstepNext(1, 3)}
        >
          <p className="text-gray-dimmer mb-1">
            Share of distributions to syndicate lead
          </p>
          <p>{profitShareToSyndicateLead}%</p>
        </li>
        <li
          className={`p-2 ${hoverStyles}`}
          onClick={() => handleTemplateSubstepNext(1, 3)}
        >
          <p className="text-gray-dimmer mb-1">Share to Syndicate Protocol</p>
          <p>{syndicateProfitSharePercent}%</p>
        </li>

        <li
          className={`p-2 flex flex-row ${hoverStyles}`}
          onClick={() => handleTemplateSubstepNext(1, 4)}
        >
          <div className="mr-4">
            <img
              className="inline h-4"
              src={`/images/usercheck-${allowList}.svg`}
              alt="allowlist"
            />
          </div>
          <p>Allowlist {allowList}</p>
        </li>
        <li
          className={`p-2 flex flex-row ${hoverStyles}`}
          onClick={() => handleTemplateSubstepNext(1, 5)}
        >
          <div className="flex self-center opacity-60 mr-4">
            <img
              className="inline h-4"
              src={`/images/${modifiable ? "lockOpen" : "lockClosed"}.svg`}
              alt="modifiable"
            />
          </div>
          <p>{!modifiable ? "Not modifiable" : "Modifiable"}</p>
        </li>
        <li
          className={`p-2 flex flex-row ${hoverStyles}`}
          onClick={() => handleTemplateSubstepNext(1, 6)}
        >
          <div className="flex self-center opacity-60 mr-4">
            <img
              className="inline h-4"
              src={`/images/${transferable ? "lockOpen" : "lockClosed"}.svg`}
              alt="modifiable"
            />
          </div>
          <p>
            {!transferable
              ? "Not transferable by the member"
              : "Transferable by the member"}
          </p>
        </li>
      </ul>

      {templateInUse ? (
        <div className="mt-6">
          <NonEditableSetting text="Note that settings marked with an asterisk (*) can’t be changed once the syndicate is created." />
        </div>
      ) : null}
    </div>
  );
};

export default Confirmation;

export const ConfirmationInfo: React.FC = () => (
  <RightPlaceHolder
    title="What happens next?"
    body={[
      "Once you finalize your choices, your on-chain syndicate will be created. You’ll then be able to invite investors and get started with the work of building your syndicate’s investments!",
      "If you chose to also create a legal entity, a member of the Syndicate team will be in touch soon to coordinate next steps. Due to high volume of requests, this could take several business days.",
    ]}
  />
);
