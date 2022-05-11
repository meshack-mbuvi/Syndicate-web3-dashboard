// component to show syndicate deposits progress
import React, { useEffect, useRef, useState } from 'react';
import { divideIfNotByZero } from '@/utils/conversions';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { SkeletonLoader } from 'src/components/skeletonLoader';
import NumberTreatment from '@/components/NumberTreatment';
import { useSelector } from 'react-redux';
import { useClubDepositsAndSupply } from '@/hooks/useClubDepositsAndSupply';
import { AppState } from '@/state';
import { ProgressIndicatorTooltip } from '../progressIndicatorTooltip';
import { TokenDetails } from '@/hooks/useGetDepositTokenDetails';
import { IActiveNetwork } from '@/state/wallet/types';
interface IProgressIndicator {
  totalDeposits: number;
  depositTotalMax: string;
  openDate: string;
  closeDate: string;
  loading?: boolean;
  nativeDepositToken: boolean;
  depositTokenPriceInUSD: string;
  tokenDetails: TokenDetails;
  activeNetwork: IActiveNetwork;
}

export enum TooltipState {
  MINTED_VIA_DEPOSITS = 'MINTED_VIA_DEPOSITS',
  MANUALLY_MINTED = 'MANUALLY_MINTED',
  REMAINING_MINTS = 'REMAINING_MINTS'
}

export const ProgressIndicator = (props: IProgressIndicator): JSX.Element => {
  const {
    depositTotalMax,
    totalDeposits = 0,
    loading = false,
    nativeDepositToken = false,
    depositTokenPriceInUSD,
    tokenDetails,
    activeNetwork
  } = props;

  // refs and consts
  const tooltipBox = useRef(null);
  const toolTip = useRef(null);

  // states
  const {
    erc20TokenSliceReducer: { erc20Token },
    clubMembersSliceReducer: { clubMembers }
  } = useSelector((state: AppState) => state);

  const { maxTotalSupply, address, symbol } = erc20Token;
  const { totalSupply } = useClubDepositsAndSupply(address);

  const [currentToolTip, setCurrentToolTip] = useState<TooltipState>(null);
  const [tooltipTitle, setToolTipTitle] = useState('');
  const [tooltipTokenAmount, setToolTipTokenAmount] = useState(0);

  // percentage states
  const [depositsPercentage, setDepositsPercentage] = useState(0);
  const [manualMintPercentage, setManualMintPercentage] = useState(0);
  const [remainingMintPercentage, setRemainingMintPercentage] = useState(0);
  const [totalPercentageDeposits, setTotalPercentageDeposits] = useState(0);
  const [tooltipTokenPercentage, setToolTipTokenPercentage] = useState(0);

  // amount states
  const [tokensViaDeposits, setTokensViaDeposits] = useState(0);
  const [tokensViaManualMints, setTokensViaManualMints] = useState(0);
  const [remainingSupply, setRemainingSupply] = useState(0);

  // mouse move event states
  const [showToolTip, setShowToolTip] = useState(false);
  const [left, setLeft] = useState(0);
  const [trackMouse, setTrackMouse] = useState(true);

  useEffect(() => {
    /**
     * get percentage of club tokens via token deposits
     * checking members and cummulatively adding all club tokens burnt after a member
     * makes a deposit.
     */
    let depositTokensBurnt = 0;
    let _actualDepositClubTokens = 0;
    clubMembers &&
      clubMembers.map((member) => {
        const { clubTokens, depositAmount } = member;

        const actualDepositClubTokens = nativeDepositToken
          ? +depositAmount * 10000
          : +depositAmount;
        _actualDepositClubTokens += actualDepositClubTokens;

        if (+depositAmount > 0 && +clubTokens < +actualDepositClubTokens) {
          depositTokensBurnt += +actualDepositClubTokens - +clubTokens;
        }
      });
    const tokensViaDeposits = _actualDepositClubTokens - depositTokensBurnt;

    setTokensViaDeposits(tokensViaDeposits);
    const percentageOfDeposits =
      divideIfNotByZero(+tokensViaDeposits, +maxTotalSupply) * 100;
    setDepositsPercentage(percentageOfDeposits);

    // get percentage of club tokens from manual mints by admin.
    // checking difference here to account for tokens that may have been burnt.
    const supplyDifference = +totalSupply - +tokensViaDeposits;
    const tokensViaManualMints = supplyDifference > 0 ? supplyDifference : 0;
    setTokensViaManualMints(tokensViaManualMints);
    const percentageManualMints =
      divideIfNotByZero(+tokensViaManualMints, +maxTotalSupply) * 100;
    setManualMintPercentage(percentageManualMints);

    // get percentage of club tokens not yet minted.
    const remainingSupply = +maxTotalSupply - +totalSupply;
    setRemainingSupply(remainingSupply);
    setRemainingMintPercentage(
      divideIfNotByZero(+remainingSupply, +maxTotalSupply) * 100
    );

    // overall percentage deposits
    setTotalPercentageDeposits(
      divideIfNotByZero(+totalSupply, +maxTotalSupply) * 100
    );

    // edge case to check if any of the percentages erroneously exceeds 100.
    if (percentageOfDeposits > 100) {
      setRemainingMintPercentage(0);
      setDepositsPercentage(100);
      setManualMintPercentage(0);
    } else if (percentageManualMints > 100) {
      setRemainingMintPercentage(0);
      setDepositsPercentage(0);
      setManualMintPercentage(100);
    }
  }, [
    totalDeposits,
    totalSupply,
    maxTotalSupply,
    nativeDepositToken,
    JSON.stringify(clubMembers)
  ]);

  const [remainingSupplyDisplayWidth, setRemainingSupplyDisplayWidth] =
    useState(0);

  // set minimum width for progress bar content.
  // if any percentage is too small i.e less than 0.5 it will he hard to
  // see and hover above on the progress bar
  const leastPercentage = 0.5;

  useEffect(() => {
    switch (currentToolTip) {
      case TooltipState.MINTED_VIA_DEPOSITS:
        setToolTipTitle('Minted via deposits');
        setToolTipTokenAmount(tokensViaDeposits);
        setToolTipTokenPercentage(depositsPercentage);
        break;
      case TooltipState.MANUALLY_MINTED:
        setToolTipTitle('Minted via club admin(s)');
        setToolTipTokenAmount(tokensViaManualMints);
        setToolTipTokenPercentage(manualMintPercentage);
        break;

      default:
        setToolTipTitle('Available to mint');
        setToolTipTokenAmount(remainingSupply);
        setToolTipTokenPercentage(remainingMintPercentage);
        break;
    }

    // since we set a minimum width for the deposits and manual mint bar
    // we need to adjust the remaining width should the two above make the
    // overall percentage go above 100%
    if (
      depositsPercentage < leastPercentage &&
      depositsPercentage > 0 &&
      manualMintPercentage > leastPercentage
    ) {
      setRemainingSupplyDisplayWidth(100 - (depositsPercentage + 1));
    } else if (
      manualMintPercentage < leastPercentage &&
      manualMintPercentage > 0 &&
      depositsPercentage > leastPercentage
    ) {
      setRemainingSupplyDisplayWidth(100 - (manualMintPercentage + 1));
    } else if (
      manualMintPercentage < leastPercentage &&
      manualMintPercentage > 0 &&
      depositsPercentage < leastPercentage &&
      depositsPercentage > 0
    ) {
      setRemainingSupplyDisplayWidth(
        100 - (manualMintPercentage + depositsPercentage + 2)
      );
    } else {
      setRemainingSupplyDisplayWidth(remainingMintPercentage);
    }
  }, [
    currentToolTip,
    depositsPercentage,
    tokensViaDeposits,
    tokensViaManualMints,
    manualMintPercentage,
    remainingMintPercentage,
    remainingSupply
  ]);

  const handleMouseMove = (e) => {
    setShowToolTip(true);

    const leftOffSet = e.nativeEvent.offsetX;
    const client = e.clientX;
    if (toolTip && toolTip.current && trackMouse) {
      const toolTipWidth = toolTip.current.getBoundingClientRect().width / 2;

      // if the tooltip is going to overflow the document to the left
      // we need to compensate to prevent it from getting cut off.
      if (toolTipWidth < client) {
        setLeft(leftOffSet - toolTipWidth);
      } else {
        setLeft(leftOffSet - toolTipWidth + (toolTipWidth - client));
      }
    }
  };

  // progress indicator tooltip
  const tooltip = (
    <div className="w-full flex justify-center items-center z-40 h-full">
      <div
        className={`absolute pb-3`}
        // once the tooltip is hovered we do not need to track the mouse
        // movement anymore.
        onMouseEnter={() => {
          setTrackMouse(false);
        }}
        onMouseLeave={() => {
          setTrackMouse(true);
        }}
        style={{
          bottom: 15,
          left
        }}
        ref={toolTip}
      >
        <ProgressIndicatorTooltip
          {...{
            show: showToolTip,
            currentToolTip,
            tooltipTitle,
            tooltipTokenAmount,
            tooltipTokenPercentage,
            depositTokensAmount: nativeDepositToken
              ? tokensViaDeposits / 10000
              : tokensViaDeposits
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full xl:pb-14 pb-10">
      {loading ? (
        <div>
          <div className="mb-4">
            <SkeletonLoader
              height="5"
              width="full"
              borderRadius="rounded-full"
            />
          </div>
          <div className="flex justify-between mt-6">
            <div className="w-1/4">
              <SkeletonLoader
                height="3"
                width="full"
                borderRadius="rounded-full"
              />
              <SkeletonLoader
                height="6"
                width="full"
                borderRadius="rounded-lg"
              />
            </div>
            <div className="w-1/4 items-end place-content-end">
              <SkeletonLoader
                height="3"
                width="full"
                borderRadius="rounded-full"
              />
              <SkeletonLoader
                height="6"
                width="full"
                borderRadius="rounded-lg"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-6" ref={tooltipBox}>
          {/* Progress indicator  */}
          <div className="h-6 text-sm flex rounded-full bg-black p-0.5 border-gray-syn6 border-1">
            <div
              className={`flex p-0 ${
                remainingMintPercentage === 100 ? '' : 'space-x-0.5'
              } rounded-full h-full w-full`}
            >
              {/* mints via deposits progress  */}
              {depositsPercentage > 0 && (
                <div
                  style={{
                    minWidth: `${
                      depositsPercentage < leastPercentage &&
                      depositsPercentage > 0
                        ? `${floatedNumberWithCommas(depositsPercentage + 1)}%`
                        : `${floatedNumberWithCommas(depositsPercentage)}%`
                    }`
                  }}
                  className={`shadow-none relative h-full flex flex-col transition-all text-center whitespace-nowrap text-white justify-center bg-blue hover:bg-opacity-80 rounded-l-full 
                ${depositsPercentage > 99.5 ? 'rounded-full' : ''}
                ${depositsPercentage === 0 ? 'hidden' : 'block'}`}
                  onMouseEnter={() =>
                    setCurrentToolTip(TooltipState.MINTED_VIA_DEPOSITS)
                  }
                  onMouseLeave={() => setCurrentToolTip(null)}
                  onMouseMove={(e) => handleMouseMove(e)}
                >
                  {currentToolTip === TooltipState.MINTED_VIA_DEPOSITS &&
                    tooltip}
                </div>
              )}

              {/* mints via manual mints progress  */}
              {manualMintPercentage > 0 && (
                <div
                  style={{
                    minWidth: `${
                      manualMintPercentage < leastPercentage &&
                      manualMintPercentage > 0
                        ? `${floatedNumberWithCommas(
                            manualMintPercentage + 1
                          )}%`
                        : `${floatedNumberWithCommas(manualMintPercentage)}%`
                    }`
                  }}
                  className={`shadow-none relative h-full flex flex-col transition-all text-center whitespace-nowrap text-white justify-center bg-gray-mineral hover:bg-opacity-80
                ${totalDeposits > 0 ? '' : 'rounded-l-full'}
                ${manualMintPercentage === 0 ? 'hidden' : 'block'}
                ${manualMintPercentage > 99.5 ? 'rounded-full' : ''}
                ${
                  manualMintPercentage < 100 && totalPercentageDeposits < 100
                    ? ''
                    : 'rounded-r-full'
                }
                `}
                  onMouseEnter={() =>
                    setCurrentToolTip(TooltipState.MANUALLY_MINTED)
                  }
                  onMouseLeave={() => setCurrentToolTip(null)}
                  onMouseMove={(e) => handleMouseMove(e)}
                >
                  {currentToolTip === TooltipState.MANUALLY_MINTED && tooltip}
                </div>
              )}
              {/* remaining mints progress  */}
              <div
                style={{
                  width: `${floatedNumberWithCommas(
                    remainingSupplyDisplayWidth
                  )}%`
                }}
                className={`shadow-none relative h-full flex transition-all text-center whitespace-nowrap text-white justify-center bg-black hover:bg-gray-syn8  rounded-r-full
                ${remainingMintPercentage === 100 ? 'rounded-l-full' : ''}
                
                `}
                onMouseEnter={() =>
                  setCurrentToolTip(TooltipState.REMAINING_MINTS)
                }
                onMouseLeave={() => setCurrentToolTip(null)}
                onMouseMove={(e) => handleMouseMove(e)}
              >
                {currentToolTip === TooltipState.REMAINING_MINTS && tooltip}
              </div>
            </div>
          </div>

          {/* Details content  */}
          <div className="flex justify-between mt-6">
            <div className="text-left">
              <p className="text-gray-syn4 leading-6 pb-2">
                Club tokens minted
              </p>
              <div
                className={`flex ${
                  maxTotalSupply.toString().length > 10
                    ? 'flex-col'
                    : 'flex-row space-x-4'
                }`}
              >
                <p className="leading-loose xl:text-2xl lg:text-xl text-base">
                  <NumberTreatment
                    numberValue={`${totalSupply || ''}`}
                    nativeDepositToken={nativeDepositToken}
                  />
                  &nbsp;
                  {symbol}
                </p>
                <p className="text-gray-lightManatee font-light text-2xl">
                  {floatedNumberWithCommas(totalPercentageDeposits)}
                  {/* Temporary fix to add font weight to symbol  */}
                  <span
                    style={{
                      fontFamily: 'Arial',
                      fontWeight: 300
                    }}
                  >
                    %
                  </span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-syn4 leading-6 pb-2">
                Club token max supply
              </p>
              <p className="xl:text-2xl lg:text-xl text-sm text-white leading-loose">
                <NumberTreatment
                  numberValue={`${maxTotalSupply || ''}`}
                  nativeDepositToken={nativeDepositToken}
                />
                &nbsp;
                {symbol}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
