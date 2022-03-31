import { Callout } from '@/components/callout';
import ArrowDown from '@/components/icons/arrowDown';
import Modal, { ModalStyle } from '@/components/modal';
import EstimateGas from '@/containers/createInvestmentClub/gettingStarted/estimateGas';
import { formatAddress } from '@/utils/formatAddress';
import {
  floatedNumberWithCommas,
  numberWithCommas
} from '@/utils/formattedNumbers';
import React, { Dispatch, SetStateAction } from 'react';

interface IConfirmMemberDetailsModal {
  preview: boolean;
  symbol: string;
  amountToMint: string;
  ownershipShare: number;
  totalSupply: string;
  totalSupplyPostMint: number;
  memberAddress;
  handleShow: (show: boolean) => void;
  setPreview: Dispatch<SetStateAction<boolean>>;
  handleMinting: () => void;
}

const ConfirmMemberDetailsModal: React.FC<IConfirmMemberDetailsModal> = ({
  preview,
  symbol,
  memberAddress,
  amountToMint,
  ownershipShare,
  totalSupply,
  totalSupplyPostMint,
  handleShow,
  setPreview,
  handleMinting
}): React.ReactElement => {
  const DetailContent = ({ label, value, symbol, showPlusSign = false }) => (
    <div className="flex justify-between">
      <span className="text-gray-syn4 font-whyte text-base leading-6">
        {label}
      </span>
      <span className="text-white">
        {showPlusSign && <span className="mr-1 text-white">+</span>}
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
          handleShow(true);
          setPreview(false);
        },
        customClassName: 'pt-8 pb-10 px-5',
        showHeader: false,
        overflowYScroll: false,
        overflow: 'overflow-visible'
      }}
    >
      <div className="space-y-8">
        <div className="space-y-6">
          <span className="mx-5 align-baseline mb-8 font-whyte-medium h4 text-white leading-4 tracking-px">
            confirm club token mint
          </span>

          <div className="mt-8 rounded-lg border-gray-syn6 border relative">
            <div className="py-4 px-5 border-gray-syn6 border-b">
              <p className="text-base text-gray-syn4 leading-6 font-whyte">
                Mint amount
              </p>
              <div className="flex items-center justify-between mt-1 space-y-1">
                <p className="text-2xl text-white">
                  {floatedNumberWithCommas(amountToMint)}
                </p>
                <p className="text-base text-white leading-6">{symbol}</p>
              </div>

              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-syn4">
                  {floatedNumberWithCommas(ownershipShare) === '< 0.01'
                    ? null
                    : '= '}
                  {floatedNumberWithCommas(ownershipShare)}% ownership share
                </p>
              </div>
            </div>
            <div
              className={`absolute p-2 bg-gray-syn8 border-gray-syn6 border rounded-lg`}
              style={{ top: 'calc(50% - 2px)', left: 'calc(50% - 12px)' }}
            >
              <ArrowDown />
            </div>
            <div className="py-4 px-5 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-base text-gray-syn4 leading-6">
                  Recipient address
                </p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-2xl text-white">
                  {formatAddress(memberAddress, 6, 4)}
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 space-y-6">
            <DetailContent
              label="Current club token supply"
              value={totalSupply}
              symbol={symbol}
            />
            <DetailContent
              label="Club tokens to be minted"
              value={amountToMint}
              symbol={symbol}
              showPlusSign={true}
            />
            <div className="border-b-1 border-gray-syn6" />
            <DetailContent
              label="New club token supply"
              value={totalSupplyPostMint}
              symbol={symbol}
            />
          </div>
        </div>
        <div className="px-5 rounded-custom">
          <Callout
            extraClasses="rounded-t-custom p-4 text-sm"
            backGroundClass="bg-blue-midnightExpress"
          >
            <EstimateGas customClasses="bg-blue-midnightExpress bg-opacity-30 w-full flex cursor-default items-center" />
          </Callout>
          <div className="bg-blue bg-opacity-20 rounded-b-lg">
            <button
              className={`w-full primary-CTA hover:opacity-90 transition-all`}
              type="button"
              onClick={handleMinting}
            >
              Add member
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmMemberDetailsModal;
