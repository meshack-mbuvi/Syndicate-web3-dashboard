import React, { FC } from 'react';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import Tooltip from 'react-tooltip-lite';
import Image from 'next/image';
import { MoreInfoIcon } from '@/components/shared/Icons/index';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { TooltipState } from '@/components/syndicates/shared/progressIndicator';
import { useClubDepositsAndSupply } from '@/hooks/useClubDepositsAndSupply';

interface IProgressIndicatorTooltip {
  show: boolean;
  tooltipTitle: string;
  tooltipTokenAmount: number;
  tooltipTokenPercentage: number;
  currentToolTip;
}

export const ProgressIndicatorTooltip: FC<IProgressIndicatorTooltip> = ({
  show,
  tooltipTitle,
  tooltipTokenAmount,
  tooltipTokenPercentage,
  currentToolTip
}) => {
  const {
    erc20TokenSliceReducer: { erc20Token, depositDetails }
  } = useSelector((state: AppState) => state);

  const { symbol, address } = erc20Token;
  const { depositTokenLogo, depositTokenSymbol } = depositDetails;
  const { totalDeposits } = useClubDepositsAndSupply(address);

  // when to show color key.
  const showColorKeyAndInfoIcon =
    currentToolTip === TooltipState.MINTED_VIA_DEPOSITS ||
    currentToolTip === TooltipState.MANUALLY_MINTED;
  const keyColor =
    currentToolTip === TooltipState.MANUALLY_MINTED
      ? 'bg-gray-mineral'
      : 'bg-blue';

  // inner tooltip text based on current tooltip text
  let tooltipText: React.ReactElement = <span></span>;
  if (currentToolTip === TooltipState.MINTED_VIA_DEPOSITS) {
    tooltipText = (
      <span className="text-gray-syn3">
        This is the amount of <span>{symbol}</span> that has been <br /> minted
        and transfered to members based <br /> on how much USDC they’ve
        deposited
      </span>
    );
  } else if (currentToolTip === TooltipState.MANUALLY_MINTED) {
    tooltipText = (
      <span className="text-gray-syn3">
        This is the amount of <span>{symbol}</span> that has been <br />{' '}
        manually minted and transfered to <br /> members by the club admin(s).
      </span>
    );
  }

  return (
    <>
      {show && (
        <div className="py-3 px-4 space-y-2 rounded-1.5lg bg-gray-syn7 z-30">
          {/* title  */}
          <div className="flex items-center space-x-2">
            {showColorKeyAndInfoIcon ? (
              <div
                className={`flex-shrink-0 w-2 h-2 rounded-full ${keyColor}`}
              ></div>
            ) : null}
            <div className="text-gray-syn3 flex-shrink-0 text-base">
              {tooltipTitle}
            </div>
            {showColorKeyAndInfoIcon ? (
              <div className="flex-shrink-0">
                <Tooltip
                  content={tooltipText}
                  arrow={false}
                  tipContentClassName="actionsTooltip"
                  background="#232529"
                  padding="12px 16px"
                  distance={26}
                >
                  <MoreInfoIcon height="12" width="12" />
                </Tooltip>
              </div>
            ) : null}
          </div>

          {/* token amount and percentage  */}
          <div className="flex space-x-2 text-xl">
            <div className="text-white">{`${floatedNumberWithCommas(
              tooltipTokenAmount
            )} ${symbol}`}</div>
            <div className="text-gray-syn3 font-whyte-light">
              {floatedNumberWithCommas(tooltipTokenPercentage)}%
            </div>
          </div>

          {/* token value in USD  */}
          {currentToolTip === TooltipState.MINTED_VIA_DEPOSITS ? (
            <div className="text-white flex items-center text-base">
              <div className="mr-1 flex items-center justify-start">
                <Image src={depositTokenLogo} width={16} height={16} />
              </div>
              <div>{`${floatedNumberWithCommas(
                totalDeposits
              )} ${depositTokenSymbol}`}</div>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};
