import { Callout } from '@/components/callout';
import { CtaButton } from '@/components/CTAButton';
import { SkeletonLoader } from '@/components/skeletonLoader';
import StatusBadge from '@/components/syndicateDetails/statusBadge';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import React, { useState } from 'react';

interface Props {
  tokensDetails?: {
    tokenSymbol: string;
    tokenAmount: number;
    tokenIcon: string;
    fiatAmount?: number;
    isLoading?: boolean;
  }[];
  gasEstimate: {
    tokenSymbol: string;
    tokenAmount?: string;
    fiatAmount?: string;
    isLoading?: boolean;
  };
  attribution?: string;
  CTALabel: string;
  isCTADisabled: boolean;
}

export const BadgeWithOverview: React.FC<Props> = ({
  tokensDetails,
  gasEstimate,
  attribution = 'Price estimates from CoinGecko',
  CTALabel,
  isCTADisabled
}) => {
  const [isTotalLoading, setIsTotalLoading] = useState(false);

  const fiatAmount = tokensDetails?.reduce((total, tokenDetails) => {
    // If at least one token that is loading, then the total cost is loading.
    if (!isTotalLoading && tokenDetails.isLoading) {
      setIsTotalLoading(true);
    }
    return total + tokenDetails.fiatAmount;
  }, 0);

  const totalFiatAmount = fiatAmount + +gasEstimate.fiatAmount;

  const renderedTokenRows = tokensDetails?.map((tokenDetails) => {
    return (
      <>
        <div className="flex justify-between items-start w-full space-x-4">
          {/* Token */}
          <div className="flex items-center w-1/2 truncate">
            <img
              src={tokenDetails.tokenIcon || '/images/token-gray.svg'}
              alt="Token icon"
              className="w-6 h-6 mr-3"
            />

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
                <div className="truncate mr-1">
                  {floatedNumberWithCommas(tokenDetails.tokenAmount)}
                </div>
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
              }).format(tokenDetails.fiatAmount)}
            </div>
          )}
        </div>
      </>
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
                  <div className="space-y-4 mb-4">{renderedTokenRows}</div>

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
                        {'$'}
                        {floatedNumberWithCommas(fiatAmount)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Gas estimate */}
              <Callout extraClasses="rounded-xl px-4 py-3 text-sm mx-4">
                <div className="flex justify-between">
                  <div className="flex space-x-1">
                    <div>Estimated gas</div>
                    <div className="pr-1">
                      <img
                        src="/images/fuel-pump-blue.svg"
                        className="w-3.5 relative top-0.5"
                        alt="Gas icon"
                      />
                    </div>
                    <div>
                      {gasEstimate.isLoading ? '-' : gasEstimate.tokenAmount}
                    </div>
                    <div>{gasEstimate.tokenSymbol}</div>
                  </div>
                  <div>
                    ${gasEstimate.isLoading ? ' -' : gasEstimate.fiatAmount}
                  </div>
                </div>
              </Callout>
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
                {'$'}
                {isTotalLoading ? 0 : floatedNumberWithCommas(totalFiatAmount)}
              </div>
            </div>
            <CtaButton disabled={isCTADisabled}>{CTALabel}</CtaButton>
          </>
        )}
      </div>

      {/* Mobile */}
      <div className="w-full md:hidden bg-gray-syn8 py-5 px-8 sm:px-10 space-y-4">
        {tokensDetails.length > 0 ? (
          <>
            {/* Distributing N assets */}
            <div className="flex justify-between">
              <div>
                Distributing {tokensDetails.length} asset
                {tokensDetails.length > 1 && 's'}
              </div>
              <div className="text-gray-syn4 font-mono">
                {`$${floatedNumberWithCommas(totalFiatAmount)}`}
              </div>
            </div>
            {/* Gas estimate */}
            <Callout extraClasses="rounded-xl px-4 py-3 text-sm">
              <div className="flex justify-between">
                <div className="flex space-x-1">
                  <div>Estimated gas</div>
                  <div className="pr-1">
                    <img
                      src="/images/fuel-pump-blue.svg"
                      className="w-3.5 relative top-0.5"
                      alt="Gas icon"
                    />
                  </div>
                  <div>
                    {gasEstimate.isLoading ? '-' : gasEstimate.tokenAmount}
                  </div>
                  <div>{gasEstimate.tokenSymbol}</div>
                </div>
                <div className="">
                  ${gasEstimate.isLoading ? ' -' : gasEstimate.fiatAmount}
                </div>
              </div>
            </Callout>
            <CtaButton disabled={isCTADisabled}>{CTALabel}</CtaButton>
          </>
        ) : (
          <div className="flex items-center justify-between space-x-1.5">
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
