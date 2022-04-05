import React from 'react';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import { numberWithCommas } from '@/utils/formattedNumbers';
import { CtaButton } from '@/components/CTAButton';
import Modal, { ModalStyle } from '@/components/modal';
import { InputField } from '@/components/inputs/inputField';
import { InputFieldWithButton } from '@/components/inputs/inputFieldWithButton';
import { formatAddress } from '@/utils/formatAddress';

interface IMemberDetails {
  show: boolean;
  memberAddress: string;
  amountToMint: string;
  memberAddressError: string;
  amountToMintError: string | React.ReactElement;
  symbol: string;
  handleShow: (show: boolean) => void;
  handleSubmit: (e) => void;
  clearFieldErrors: () => void;
  handleAddressChange: (e) => void;
  handleAmountChange: (e) => void;
  setMaxRemainingSupply: () => void;
}

const MemberDetailsModal: React.FC<IMemberDetails> = ({
  show,
  memberAddress,
  amountToMint,
  amountToMintError,
  memberAddressError,
  symbol,
  handleShow,
  clearFieldErrors,
  handleAddressChange,
  handleAmountChange,
  handleSubmit,
  setMaxRemainingSupply
}): React.ReactElement => {
  const {
    web3Reducer: {
      web3: { web3 }
    }
  } = useSelector((state: AppState) => state);

  // address format points
  const addressStartChars = 17;
  const addressEndChars = 18;

  const formattedAddress = () => {
    if (web3.utils.isAddress(memberAddress)) {
      return formatAddress(memberAddress, addressStartChars, addressEndChars);
    } else {
      return memberAddress;
    }
  };
  return (
    <Modal
      {...{
        show,
        modalStyle: ModalStyle.DARK,
        showCloseButton: true,
        customWidth: 'w-full max-w-480',
        outsideOnClick: true,
        closeModal: () => {
          clearFieldErrors();
          handleShow(false);
        },
        customClassName: 'pt-8 pb-10 px-10',
        showHeader: false,
        overflowYScroll: false,
        overflow: 'overflow-visible'
      }}
    >
      <div className="space-y-6">
        <h1 className="uppercase font-whyte-medium text-sm leading-4 text-white tracking-px">
          manually add member
        </h1>
        <p className="text-gray-syn4 text-base font-whyte leading-6">
          To manually add a member, enter their wallet address and the amount of
          club tokens to mint.
        </p>

        <div className="space-y-6">
          <div className="my-6">
            <div className="mb-2 text-white">Member address</div>
            <InputField
              value={formattedAddress()}
              placeholderLabel="0x..."
              onChange={handleAddressChange}
              isInErrorState={Boolean(memberAddressError)}
              infoLabel={memberAddressError ? memberAddressError : ''}
              extraClasses="border-gray-syn6"
            />
          </div>
          <div className="mb-8">
            <div className="mb-2 text-white">Amount to mint</div>
            <InputFieldWithButton
              buttonLabel="Max"
              value={
                amountToMint
                  ? numberWithCommas(
                      // Checks if there are unnecessary zeros in the amount
                      amountToMint
                        .replace(/^0{2,}/, '0')
                        .replace(/^0(?!\.)/, '')
                    )
                  : numberWithCommas('')
              }
              placeholderLabel="0"
              onChange={handleAmountChange}
              isInErrorState={Boolean(amountToMintError)}
              infoLabel={amountToMintError ? amountToMintError : ''}
              extraClasses="border-gray-syn6"
              symbol={symbol}
              buttonOnClick={setMaxRemainingSupply}
            />
          </div>

          <CtaButton
            disabled={
              Boolean(amountToMintError) ||
              Boolean(memberAddressError) ||
              !memberAddress ||
              !amountToMint ||
              +amountToMint <= 0
            }
            onClick={(e) => {
              handleShow(false);
              handleSubmit(e);
            }}
          >
            <span className="text-black">Continue</span>
          </CtaButton>
        </div>
      </div>
    </Modal>
  );
};

export default MemberDetailsModal;
