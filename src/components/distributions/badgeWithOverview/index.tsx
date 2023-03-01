import { Callout, CalloutType } from '@/components/callout';
import { CTAButton } from '@/components/CTAButton';
import { SkeletonLoader } from '@/components/skeletonLoader';
import StatusBadge from '@/components/syndicateDetails/statusBadge';
import { B4 } from '@/components/typography';
import Image from 'next/image';
import React, { useState } from 'react';

interface Props {
  tokensDetails?: {
    tokenSymbol: string;
    tokenAmount: string;
    tokenIcon: string;
    fiatAmount: string;
    isLoading?: boolean;
  }[];
  gasEstimate: {
    tokenSymbol: string;
    tokenAmount: string;
    fiatAmount: string;
  } | null;
  attribution?: string;
  CTALabel: string;
  isCTADisabled: boolean;
  sufficientGas?: boolean;
  isGnosisSafe?: boolean;
  ctaOnclickHandler: (e: any) => void;
}

export const BadgeWithOverview: React.FC<Props> = ({
  tokensDetails,
  gasEstimate,
  CTALabel,
  isCTADisabled,
  ctaOnclickHandler,
  sufficientGas,
  isGnosisSafe = false,
  attribution = 'Price estimates from CoinGecko'
}) => {
  const [isTotalLoading, setIsTotalLoading] = useState(false);

  const fiatAmount =
    tokensDetails?.reduce((total, tokenDetails) => {
      // If at least one token that is loading, then the total cost is loading.
      if (!isTotalLoading && tokenDetails.isLoading) {
        setIsTotalLoading(true);
      }

      return (
        parseFloat(total.toFixed(3)) + parseFloat(tokenDetails?.fiatAmount ?? 0)
      );
    }, 0) || 0;

  const totalFiatAmount =
    parseFloat(fiatAmount?.toString() ?? '0') +
    parseFloat(gasEstimate ? gasEstimate?.fiatAmount : '0');

  const renderedTokenRows = tokensDetails?.map((tokenDetails, index) => {
    return (
      <div
        className="flex justify-between items-start w-full space-x-4"
        key={index}
      >
        {/* Token */}
        <div className="flex items-center w-1/2 truncate">
          <div className="w-6 h-6 mr-3">
            <Image
              src={tokenDetails.tokenIcon || '/images/token-gray.svg'}
              alt="Token icon"
              width={24}
              height={24}
            />
          </div>

          {/* Token amount */}
          {tokenDetails.isLoading ? (
            <SkeletonLoader
              width="40"
              height="6"
              borderRadius="rounded-md"
              margin="m-0"
              customClass="opacity-60"
            />
          ) : (
            <>
              <div className="truncate mr-1">{tokenDetails.tokenAmount}</div>
              <div>{tokenDetails.tokenSymbol}</div>
            </>
          )}
        </div>

        {/* Fiat */}
        {tokenDetails.isLoading ? (
          <SkeletonLoader
            width="20"
            height="6"
            margin="0"
            borderRadius="rounded-md"
            customClass="opacity-60"
          />
        ) : (
          <div className="font-mono text-gray-syn4 text-right w-1/2 truncate">
            {Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
              // @ts-expect-error TS(2769): No overload matches this call.
            }).format(tokenDetails.fiatAmount)}
          </div>
        )}
      </div>
    );
  });

  return (
    <>
      <div className="hidden md:block md:max-w-480">
        <div className="rounded-2-half bg-gray-syn8">
          <StatusBadge
            isDistributing={true}
            isWaitingForSelection={!tokensDetails?.length}
          />

          {!!tokensDetails?.length && !isTotalLoading ? (
            <div className="pb-4">
              {/* Token table overview */}
              <div className="px-8 mt-5 pb-4">
                <div className="text-center text-xs text-gray-syn4 mb-5">
                  {attribution}
                </div>
                <div className="divide-y">
                  {/* Token rows */}
                  <div className="space-y-4 mb-6">{renderedTokenRows}</div>

                  {/* Total */}
                  <div className="flex justify-between space-x-4 border-gray-syn7 pt-4">
                    <div>
                      Distributing {tokensDetails?.length} asset
                      {tokensDetails?.length > 1 && 's'}
                    </div>
                    {isTotalLoading ? (
                      <SkeletonLoader
                        width="20"
                        height="6"
                        margin="0"
                        borderRadius="rounded-md"
                        customClass="opacity-60"
                      />
                    ) : (
                      <div className="text-gray-syn4 font-mono flex-grow text-right truncate">
                        {Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(fiatAmount ?? 0)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Gas estimate */}
              <Callout
                extraClasses="rounded-xl px-4 py-3 text-sm mx-4"
                textColor="text-blue-neptune"
                backgroundOpacity={'bg-opacity-20'}
                backgroundColor="bg-blue-neptune"
              >
                <div className="flex justify-between">
                  <div className="flex space-x-3">
                    <div>Estimated gas</div>
                    <div className="flex">
                      <Image
                        width={14}
                        height={14}
                        src="/images/fuel-pump-blue.svg"
                        className="w-3.5 relative top-0.5"
                        alt="Gas icon"
                      />
                    </div>
                    <div>
                      {!gasEstimate
                        ? '-'
                        : parseFloat(gasEstimate?.tokenAmount).toFixed(6)}
                      <span className="ml-1">{gasEstimate?.tokenSymbol}</span>
                    </div>
                  </div>
                  <div>
                    $
                    {!gasEstimate
                      ? ' -'
                      : parseFloat(gasEstimate?.fiatAmount).toFixed(2)}
                  </div>
                </div>
              </Callout>
              {!sufficientGas && isGnosisSafe && (
                <div className="mt-3 rounded-xl px-4 pt-2 pb-1 text-sm mx-4 text-gray-syn3">
                  <div className="flex flex-grow space-x-3">
                    <img
                      src="/images/syndicateStatusIcons/warning-triangle-yellow.svg"
                      className="w-4 h-4 opacity-80"
                    />
                    <B4>
                      For a Gnosis Safe, make sure the transaction signer has
                      enough to cover gas costs.
                    </B4>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="px-8 py-6 flex space-x-3">
              <SkeletonLoader
                width="6"
                height="6"
                margin="0"
                borderRadius="rounded-full"
                customClass="opacity-60"
              />
              <SkeletonLoader
                width="36"
                height="6"
                margin="0"
                borderRadius="rounded-md"
                customClass="opacity-60"
              />
            </div>
          )}
        </div>

        {!!tokensDetails?.length && (
          // Total cost
          <>
            <div className="flex justify-between px-8 pt-6 mb-8 space-x-4">
              <div>Total</div>
              <div className="font-mono truncate flex-grow text-right">
                {isTotalLoading
                  ? 0
                  : Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(totalFiatAmount)}
              </div>
            </div>
            <CTAButton
              disabled={isCTADisabled}
              onClick={ctaOnclickHandler}
              extraClasses="w-full"
            >
              {CTALabel}
            </CTAButton>
          </>
        )}
      </div>

      {/* Mobile */}
      <div className="w-full md:hidden bg-gray-syn8 py-5 px-8 sm:px-10 space-y-4">
        {tokensDetails && tokensDetails.length > 0 ? (
          <>
            {/* Distributing N assets */}
            <div className="flex justify-between">
              <div>
                Distributing {tokensDetails.length} asset
                {tokensDetails.length > 1 && 's'}
              </div>
              <div className="text-gray-syn4 font-mono">
                {`${Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(fiatAmount)}`}
              </div>
            </div>
            {/* Gas estimate */}
            <Callout extraClasses="rounded-xl px-4 py-3 text-sm">
              <div className="flex justify-between">
                <div className="flex space-x-1">
                  <div>Estimated gas</div>
                  <div className="pr-1">
                    <Image
                      width={14}
                      height={14}
                      src="/images/fuel-pump-blue.svg"
                      className="w-3.5 relative top-0.5"
                      alt="Gas icon"
                    />
                  </div>
                  <div className="pl-1">
                    {!gasEstimate
                      ? '-'
                      : parseFloat(gasEstimate?.tokenAmount).toFixed(6)}
                  </div>
                  <div>{gasEstimate?.tokenSymbol}</div>
                </div>
                <div>
                  $
                  {!gasEstimate
                    ? ' -'
                    : parseFloat(gasEstimate?.fiatAmount).toFixed(2)}
                </div>
              </div>
            </Callout>
            {!sufficientGas && isGnosisSafe && (
              <Callout
                type={CalloutType.WARNING}
                extraClasses="rounded-xl px-4 py-3 text-sm"
              >
                <div className="flex justify-between space-x-2">
                  <div className="flex flex-grow space-x-3">
                    <img src="/images/fuel-pump-blue.svg" alt="Gas icon" />
                    <div>
                      For a Gnosis Safe, make sure the transaction signer has
                      enough to cover gas costs.
                    </div>
                  </div>
                </div>
              </Callout>
            )}
            <CTAButton
              disabled={isCTADisabled}
              onClick={ctaOnclickHandler}
              extraClasses="w-full"
            >
              {CTALabel}
            </CTAButton>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <SkeletonLoader
              width="5/12"
              height="4"
              margin="0"
              borderRadius="rounded"
              customClass="opacity-60"
            />
            <div className="text-gray-syn4 text-right">
              Waiting for selection...
            </div>
          </div>
        )}
      </div>
    </>
  );
};
