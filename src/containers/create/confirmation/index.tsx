import RightPlaceHolder from "@/components/rightPlaceholder";
import { RootState } from "@/redux/store";
import { numberWithCommas } from "@/utils/formattedNumbers";
import React from "react";
import { useSelector } from "react-redux";

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
        closeDateAndTime: { selectedDate, selectedTimeValue },
      },
    },
  } = useSelector((state: RootState) => state);

  const allowList = isAllowlistEnabled ? "enabled" : "disabled";

  return (
    <div className="flex flex-col">
      <div className="fixed mb-10 text-xl leading-8 pb-2 bg-black">
        Confirm everything looks right
      </div>
      <ul className="text-base font-whyte mt-12">
        <li className="pl-0 p-2">
          <p className="text-gray-dimmer mb-1">Deposit Token</p>
          <div className="flex items-center">
            <img
              src={depositTokenLogo}
              className="h-5 w-5"
              alt="logo"
              aria-hidden="true"
            />
            <p className="ml-1">{depositTokenName}</p>
          </div>
        </li>
        <li className="pl-0 p-2">
          <p className="text-gray-dimmer mb-1">Max total deposits</p>
          <p>
            {depositTotalMax ? numberWithCommas(depositTotalMax) : "Unlimited"}
            &nbsp;
            <span className="uppercase">{depositTokenSymbol}</span>
          </p>
        </li>
        <li className="pl-0 p-2">
          <p className="text-gray-dimmer mb-1">Max number of people</p>
          <p>
            {numMembersMax
              ? numMembersMax > 1
                ? `${numberWithCommas(numMembersMax as string)} people`
                : `${numMembersMax} person`
              : "Unlimited"}
          </p>
        </li>
        <li className="pl-0 p-2">
          <p className="text-gray-dimmer mb-1">Allowed deposits per person</p>
          <p>
            {depositMemberMin ? `${numberWithCommas(depositMemberMin)}` : "0"}
            <span> - </span>
            {depositMemberMax
              ? `${numberWithCommas(depositMemberMax)}`
              : "Unlimited"}
            <span className="uppercase"> {depositTokenSymbol}</span>
          </p>
        </li>
        <li className="pl-0 p-2">
          <p className="text-gray-dimmer mb-1">Close time</p>
          <p>
            {selectedTimeValue} on {new Date(selectedDate).toLocaleDateString()}
          </p>
        </li>
        <li className="pl-0 p-2">
          <p className="text-gray-dimmer mb-1">Expected annual operating fee</p>
          <p>{expectedAnnualOperatingFees}%</p>
        </li>
        <li className="pl-0 p-2">
          <p className="text-gray-dimmer mb-1">
            Share of distributions to syndicate lead
          </p>
          <p>{profitShareToSyndicateLead}%</p>
        </li>
        <li className="pl-0 p-2">
          <p className="text-gray-dimmer mb-1">Share to Syndicate Protocol</p>
          <p>{syndicateProfitSharePercent}%</p>
        </li>

        <li className="pl-0 p-2 flex flex-row">
          <div className="mr-4">
            <img
              className="inline h-4"
              src={`/images/usercheck-${allowList}.svg`}
              alt="allowlist"
            />
          </div>
          <p>Allowlist {allowList}</p>
        </li>
        <li className="pl-0 p-2 flex flex-row">
          <div className="flex self-center opacity-60 mr-4">
            <img
              className="inline h-4"
              src={`/images/${modifiable ? "lockOpen" : "lockClosed"}.svg`}
              alt="modifiable"
            />
          </div>
          <p>{!modifiable ? "Not modifiable" : "Modifiable"}</p>
        </li>
        <li className="pl-0 p-2 flex flex-row">
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
