import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { AppState } from '@/state';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import Image from 'next/image';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';

export const SuccessOrFailureContent: React.FC<{
  closeCard: () => void;
  successfulDeposit?: boolean;
  successfulClaim?: boolean;
  claimFailed?: boolean;
  depositAmount: string;
  transactionHash: string;
  handleOnCopy: () => void;
  copied: boolean;
  accountClubTokens: string;
  clubTokenSymbol: string;
  memberPercentShare: number;
}> = ({
  closeCard,
  successfulDeposit,
  successfulClaim,
  claimFailed,
  depositAmount,
  transactionHash,
  handleOnCopy,
  copied,
  clubTokenSymbol,
  accountClubTokens,
  memberPercentShare
}) => {
  const {
    erc20TokenSliceReducer: {
      depositDetails: { depositTokenSymbol, nativeDepositToken }
    },
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);
  return (
    <div className="h-fit-content text-center relative">
      <div className="absolute right-0 top-0">
        <button
          type="button"
          className={`text-gray-syn7 rounded-md hover:text-gray-syn7 focus:outline-none p-2 w-12 h-12 focus:ring-0`}
          onClick={() => closeCard()}
        >
          <span className="sr-only">Close</span>
          <Image
            src="/images/close-gray-5.svg"
            width="16"
            height="16"
            alt="close"
          />
        </button>
      </div>
      <div className="pt-10 flex justify-center items-center w-full">
        <img
          className="h-16 w-16"
          src={
            successfulDeposit || successfulClaim
              ? '/images/syndicateStatusIcons/checkCircleGreen.svg'
              : '/images/syndicateStatusIcons/transactionFailed.svg'
          }
          alt="checkmark"
        />
      </div>
      <div
        className={`pt-8 ${
          successfulDeposit || successfulClaim ? 'pb-4' : 'pb-6'
        }`}
      >
        <span className="text-2xl">
          {successfulDeposit
            ? `Deposited ${floatedNumberWithCommas(
                depositAmount,
                nativeDepositToken ?? false
              )} ${depositTokenSymbol}`
            : successfulClaim
            ? 'Claim successful'
            : claimFailed
            ? 'Claim failed'
            : `Deposit failed`}
        </span>
      </div>

      {successfulDeposit || successfulClaim ? (
        <>
          <div className="pb-6 px-8 text-gray-lightManatee">
            {`You now have ${floatedNumberWithCommas(
              accountClubTokens
            )} ${clubTokenSymbol}, which represents a ${floatedNumberWithCommas(
              memberPercentShare
            )}% ownership
                share of this club.`}
          </div>
          {successfulDeposit ? (
            <CopyToClipboard
              text={`${activeNetwork.blockExplorer.baseUrl}/${activeNetwork.blockExplorer.resources.transaction}/${transactionHash}`}
              onCopy={handleOnCopy}
            >
              <div className="relative pb-8  w-full">
                <div className="flex justify-center items-center cursor-pointer hover:opacity-80">
                  <Image
                    src="/images/actionIcons/copy-clipboard-blue.svg"
                    height={12}
                    width={12}
                  />
                  <span className="text-base ml-2 text-blue">
                    Copy transaction link
                  </span>
                </div>
                {copied && (
                  <div className="absolute w-full flex justify-center items-center">
                    <span className="text-xs text-gray-syn4 font-whyte-light">
                      Link copied
                    </span>
                  </div>
                )}
              </div>
            </CopyToClipboard>
          ) : (
            <div className="pb-6 text-base flex justify-center items-center hover:opacity-80">
              <BlockExplorerLink
                resourceId={transactionHash}
                resource="transaction"
                prefix="View on "
              />
            </div>
          )}
        </>
      ) : (
        <div className="pb-6 text-base flex justify-center items-center hover:opacity-80">
          <BlockExplorerLink
            resourceId={transactionHash}
            resource="transaction"
          />
        </div>
      )}
    </div>
  );
};
