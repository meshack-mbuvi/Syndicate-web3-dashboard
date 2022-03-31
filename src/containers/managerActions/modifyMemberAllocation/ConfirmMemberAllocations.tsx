import React, { Dispatch, SetStateAction } from 'react';
import Modal, { ModalStyle } from '@/components/modal';
import {
  floatedNumberWithCommas,
  numberWithCommas
} from '@/utils/formattedNumbers';
import { formatAddress } from '@/utils/formatAddress';
import EstimateGas from '@/containers/createInvestmentClub/gettingStarted/estimateGas';
import { Callout } from '@/components/callout';

interface IConfirmMemberAllocations {
  preview: boolean;
  setPreview: Dispatch<SetStateAction<boolean>>;
  setShowModifyCapTable: Dispatch<SetStateAction<boolean>>;
  memberAllocation: string;
  mintOrBurn: boolean;
  newOwnership: number;
  tokensToMintOrBurn: number;
  newTotalSupply: string;
  handleUpdatingCapTable: () => void;
  symbol: string;
  totalSupply: number;
  memberToUpdate: any;
}

const ConfirmMemberAllocations: React.FC<IConfirmMemberAllocations> = ({
  preview,
  setPreview,
  setShowModifyCapTable,
  memberAllocation,
  mintOrBurn,
  newOwnership,
  tokensToMintOrBurn,
  newTotalSupply,
  handleUpdatingCapTable,
  symbol,
  totalSupply,
  memberToUpdate
}): React.ReactElement => {
  const DetailContent = ({ label, value, symbol }) => (
    <div className="flex justify-between">
      <span className="text-gray-syn4 font-whyte text-base leading-6">
        {label}
      </span>
      <span className="text-white">
        {numberWithCommas(value)} {symbol}
      </span>
    </div>
  );
  return (
    <Modal
      {...{
        show: preview,
        modalStyle: ModalStyle.DARK,
        showCloseButton: true,
        customWidth: 'w-full max-w-480',
        outsideOnClick: true,
        closeModal: () => {
          setShowModifyCapTable(false);
          setPreview(false);
        },
        customClassName: 'pt-8 pb-10 px-5',
        showHeader: false,
        overflowYScroll: false,
        overflow: 'overflow-visible'
      }}
    >
      <div className="space-y-6">
        <h1 className="uppercase mx-5 mb-8 font-whyte-medium text-sm text-white leading-4 tracking-px">
          confirm new club token allocation
        </h1>

        <div className="mt-8 rounded-lg border-gray-syn6 border relative">
          <div className="py-4 px-5 border-gray-syn6 border-b">
            <p className="text-base text-gray-syn4 leading-6 font-whyte">
              Member
            </p>
            <div className="flex items-center justify-between mt-2 space-y-1">
              <span className="flex items-center">
                <img
                  src={'/images/user.svg'}
                  alt=""
                  className="flex-shrink-0 h-6 w-6 rounded-full"
                />
                <span className="ml-2 text-2xl text-white font-whyte leading-5">
                  {formatAddress(memberToUpdate?.memberAddress, 6, 4)}
                </span>
              </span>
            </div>
          </div>
          <div className="py-4 px-5 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-base text-gray-syn4 leading-6">
                New club token allocation
              </p>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl text-white">
                {numberWithCommas(memberAllocation)}
              </p>
              <p className="text-base text-white leading-6">{symbol}</p>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-gray-syn4">
                <span className="text-gray-syn4">Ownership share change:</span>{' '}
                <span className="text-gray-syn4">
                  {floatedNumberWithCommas(memberToUpdate?.ownershipShare)}%
                </span>
                <img
                  src="/images/arrowNext.svg"
                  alt=""
                  className="px-2 inline w-7"
                ></img>
                <span className="text-gray-syn4">
                  {floatedNumberWithCommas(newOwnership)}%
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 space-y-8">
          <div className="space-y-6">
            <DetailContent
              label="Current club token supply"
              value={totalSupply}
              symbol={symbol}
            />
            <DetailContent
              label={`Club tokens to be ${mintOrBurn ? 'minted' : 'burnt'}`}
              value={`${mintOrBurn ? '+ ' : '- '}${floatedNumberWithCommas(
                tokensToMintOrBurn
              )}`}
              symbol={symbol}
            />
            <div className="border-b-1 border-gray-syn6" />
            <DetailContent
              label="New club token supply"
              value={floatedNumberWithCommas(newTotalSupply)}
              symbol={symbol}
            />
          </div>

          <div className="rounded-custom">
            <Callout extraClasses="rounded-t-custom p-3 text-sm">
              <EstimateGas customClasses="bg-opacity-30 w-full flex cursor-default items-center" />
            </Callout>
            <div className="bg-blue bg-opacity-20 rounded-b-lg">
              <button
                className={`w-full primary-CTA hover:opacity-90 transition-all`}
                type="button"
                onClick={handleUpdatingCapTable}
              >
                Modify club token allocation
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmMemberAllocations;
