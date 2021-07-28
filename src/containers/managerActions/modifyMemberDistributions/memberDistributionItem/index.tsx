import PrimaryButton from "@/components/buttons";
import React, { useState } from "react";

interface IProps {
  handleModifyButtonClick: (distributionSymbol: string) => void;
  memberDistributionsToDate: string;
  memberDistributionsWithdrawalsToDate: string;
  memberWithdrawalsToDistributionsPercentage: string;
  symbol: string;
}

export const MemberDistributionItem = (props: IProps): JSX.Element => {
  const {
    memberDistributionsToDate,
    memberDistributionsWithdrawalsToDate,
    memberWithdrawalsToDistributionsPercentage,
    symbol,
    handleModifyButtonClick,
  } = props;

  const [showModifyButton, setShowModifyButton] = useState(false);
  const handleShowModifyButton = () => {
    setShowModifyButton(!showModifyButton);
  };

  return (
    <>
      {symbol && (
        <div
          className="flex justify-between"
          onMouseEnter={handleShowModifyButton}
          onMouseLeave={handleShowModifyButton}
        >
          <div className={`flex w-2/5 pr-4 justify-end`}>
            <span className="block py-2 text-black text-base font-whyte">
              {`Current ${symbol} Claimed Amount:`}
            </span>
          </div>
          <div className={`flex justify-between w-3/5 justify-ends font-whyte`}>
            <p className="py-2 text-gray-400 text-base font-whyte">
              <span className="pr-1 text-black font-whyte">
                {`${memberDistributionsWithdrawalsToDate} ${symbol} /`}
              </span>
              {`${memberDistributionsToDate} ${symbol} (${memberWithdrawalsToDistributionsPercentage}%)`}
            </p>
            {showModifyButton && (
              <PrimaryButton
                customClasses="bg-blue px-4 h-10"
                onClick={() => handleModifyButtonClick(symbol)}
              >
                Modify
              </PrimaryButton>
            )}
          </div>
        </div>
      )}
    </>
  );
};
