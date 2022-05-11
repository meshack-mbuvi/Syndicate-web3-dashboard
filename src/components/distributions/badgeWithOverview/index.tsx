import { Callout } from '@/components/callout';
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
    tokenAmount?: number;
    fiatAmount?: number;
    isLoading?: boolean;
  };
  attribution?: string;
}

export const BadgeWithOverview: React.FC<Props> = ({
  tokensDetails,
  gasEstimate,
  attribution = 'Price estimates from CoinGecko'
}) => {
  const [isTotalLoading, setIsTotalLoading] = useState(false);

  const fiatAmount = tokensDetails?.reduce((total, tokenDetails) => {
    // If atleast one token that is loading, then the total cost is loading.
    if (!isTotalLoading && tokenDetails.isLoading) {
      setIsTotalLoading(true);
    }
    return total + tokenDetails.fiatAmount;
  }, 0);
  const totalFiatAmount = fiatAmount + gasEstimate.fiatAmount;

  const renderedTokenRows = tokensDetails?.map((tokenDetails) => {
    return (
      <>
        <div className="flex justify-between items-start">
          {/* Token */}
          <div className="flex space-x-3 items-center">
            <img
              src={tokenDetails.tokenIcon}
              alt="Token icon"
              className="w-6 h-6"
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
              <div className="flex space-x-1">
                <div>{floatedNumberWithCommas(tokenDetails.tokenAmount)}</div>
                <div>{tokenDetails.tokenSymbol}</div>
              </div>
            )}
          </div>

          {/* Fiat amount */}
          {tokenDetails.isLoading ? (
            <SkeletonLoader
              width="20"
              height="6"
              margin="0"
              borderRadius="rounded-md"
              customClass="opacity-60"
            />
          ) : (
            <div className="font-mono text-gray-syn4">
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
    <div style={{ maxWidth: '30rem' }}>
      <div className="rounded-2-half bg-gray-syn8">
        <StatusBadge
          isDistributing={true}
          isWaitingForSelection={!tokensDetails}
        />

        {tokensDetails ? (
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
                <div className="flex justify-between border-gray-syn7 pt-4">
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
                    <div className="text-gray-syn4 font-mono">
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
                <div className="">
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

      {tokensDetails && (
        // Total cost
        <div className="flex justify-between px-8 pt-6">
          <div>Total</div>
          <div className="font-mono">
            {'$'}
            {isTotalLoading ? 0 : floatedNumberWithCommas(totalFiatAmount)}
          </div>
        </div>
      )}
    </div>
  );
};
