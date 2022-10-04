import React, { Dispatch, SetStateAction } from 'react';
import Modal, { ModalStyle } from '@/components/modal';
import { MemberAddressField } from '@/components/inputs/memberAddressField';
import {
  InputFieldWithToken,
  SymbolDisplay
} from '@/components/inputs/inputFieldWithToken';
import { numberWithCommas } from '@/utils/formattedNumbers';
import { CtaButton } from '@/components/CTAButton';
import { L2 } from '@/components/typography';

interface IModifyMemberClubTokens {
  memberList: any;
  setShowModifyCapTable: Dispatch<SetStateAction<boolean>>;
  showModifyCapTable: boolean;
  clearModalFields: () => void;
  handleAmountChange: (e: any) => void;
  memberAllocationError: string | React.ReactElement;
  memberAllocation: string;
  handleSubmit: (e: any) => void;
  member: string;
  setMember: Dispatch<SetStateAction<string>>;
  symbol: any;
  continueButtonDisabled: boolean;
}
const ModifyMemberClubTokens: React.FC<IModifyMemberClubTokens> = ({
  memberList,
  member,
  setMember,
  setShowModifyCapTable,
  showModifyCapTable,
  clearModalFields,
  handleAmountChange,
  memberAllocationError,
  memberAllocation,
  handleSubmit,
  symbol,
  continueButtonDisabled
}): React.ReactElement => {
  return (
    <Modal
      {...{
        show: showModifyCapTable,
        modalStyle: ModalStyle.DARK,
        showCloseButton: true,
        customWidth: 'w-full max-w-480',
        outsideOnClick: true,
        closeModal: () => {
          clearModalFields();
          setShowModifyCapTable(false);
        },
        customClassName: 'pt-8 pb-10 px-10',
        showHeader: false,
        overflowYScroll: false,
        overflow: 'overflow-visible'
      }}
    >
      <div>
        <L2 extraClasses="pb-4">modify club token allocation</L2>
        <div className="space-y-6">
          <p className="text-gray-syn4 text-base font-whyte leading-6">
            This updates your club’s cap table by either minting or burning club
            tokens depending on the modification.
          </p>

          <div className="space-y-8">
            <div className="flex flex-col space-y-6">
              <div>
                <div className="mb-2 text-white">Member</div>
                <MemberAddressField
                  memberAddress={member}
                  memberList={memberList}
                  setMemberAddress={setMember}
                />
              </div>
              <div className="mt-6">
                <div className="mb-2 text-white">Club token allocation</div>
                <InputFieldWithToken
                  value={numberWithCommas(memberAllocation)}
                  onChange={(e) => handleAmountChange(e)}
                  isInErrorState={Boolean(memberAllocationError)}
                  infoLabel={memberAllocationError ? memberAllocationError : ''}
                  symbolDisplayVariant={SymbolDisplay.ONLY_SYMBOL}
                  placeholderLabel="0"
                  depositTokenSymbol={symbol}
                />
              </div>
            </div>
            <CtaButton
              disabled={
                Boolean(memberAllocationError) ||
                !memberAllocation ||
                !member ||
                continueButtonDisabled
              }
              onClick={(e: any) => {
                handleSubmit(e);
              }}
            >
              <span className="text-black">Continue</span>
            </CtaButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModifyMemberClubTokens;
