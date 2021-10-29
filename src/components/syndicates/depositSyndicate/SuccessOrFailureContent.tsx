import React from "react";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { isDev } from "@/utils/environment";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";

export const SuccessOrFailureContent: React.FC<{
  closeCard: () => void;
  successfulDeposit: boolean;
  depositAmount: string;
  transactionHash: string;
  handleOnCopy: () => void;
  copied: boolean;
}> = ({
  closeCard,
  successfulDeposit,
  depositAmount,
  transactionHash,
  handleOnCopy,
  copied,
}) => {
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
            width="12"
            height="12"
            alt="close"
          />
        </button>
      </div>
      <div className="pt-10 flex justify-center items-center w-full">
        <img
          className="h-16 w-16"
          src={
            successfulDeposit
              ? "/images/syndicateStatusIcons/checkCircleGreen.svg"
              : "/images/syndicateStatusIcons/transactionFailed.svg"
          }
          alt="checkmark"
        />
      </div>
      <div className={`pt-8 ${successfulDeposit ? "pb-4" : "pb-6"}`}>
        <span className="text-2xl">
          {successfulDeposit
            ? `Deposited ${depositAmount} USDC`
            : `Deposit failed`}
        </span>
      </div>
      {successfulDeposit ? (
        <>
          <div className="pb-6 px-8">
            <span className="text-base text-gray-syn4 text-center">{`You now have 1,000.00 synFWB, which represents a 2.34% ownership share of this syndicate.`}</span>
          </div>
          <CopyToClipboard
            text={`${
              isDev ? "https://rinkeby.etherscan.io" : "https://etherscan.io"
            }/tx/${transactionHash}`}
            onCopy={handleOnCopy}
          >
            <div className="relative pb-8  w-full">
              <div className="flex justify-center items-center cursor-pointer hover:opacity-80">
                <span className="text-base mr-2 text-blue">
                  Copy transaction link
                </span>
                <Image
                  src="/images/actionIcons/copy-clipboard-blue.svg"
                  height={12}
                  width={12}
                />
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
        </>
      ) : (
        <div className="pb-8 text-base flex justify-center items-center hover:opacity-80">
          <EtherscanLink etherscanInfo={transactionHash} type="transaction" />
        </div>
      )}
    </div>
  );
};
