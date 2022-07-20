import { InputField } from '@/components/inputs/inputField';
import { Switch, SwitchType } from '@/components/switch';
import { DetailedTile } from '@/components/tile/detailedTile';
import { B2, B3 } from '@/components/typography';
import { stringNumberRemoveCommas } from '@/utils/formattedNumbers';
import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { InputFieldMaxPerWallet } from '../inputs/maxPerWallet';
import { RadioButtonsOpenUntil } from '../inputs/openUntil/radio';
import { InputFieldPriceToJoin } from '../inputs/priceToJoin';
import { InputTimeWindow, TimeWindow } from '../inputs/timeWindow';

export enum MembershipType {
  CAPPED = 'CAPPED',
  OPEN = 'OPEN'
}

interface Props {
  selectedMembershipType: MembershipType;
  selectedTimeWindow?: TimeWindow;
  handleTimeWindowChange?: (newTimeWindowIndex: number) => void;
  maxMembers?: number;
  handleMaxMembersChange?: (newMaxMembers: number) => void;
  priceToJoin: number;
  handlePriceToJoinChange: (newPriceToJoin: number) => void;
  maxPerWallet: number;
  handleMaxPerWalletChange: (newMaxPerWallet: number) => void;
  maxSupply: number;
  handleMaxSupplyChange: (newMaxSupply: number) => void;
  tokenDetails?: { symbol: string; icon: string };
  handleClickToChangeToken: () => void;
  closeDate?: Date;
  handleCloseDateChange?: (newDate: Date) => void;
  closeTime?: string;
  handleCloseTimeChange?: (newTime: string) => void;
  allowOwnershipTransfer: boolean;
  handleChangeAllowOwnershipTransfer: (newAllowingTransfer: boolean) => void;
  isContinueButtonActive: boolean;
}

export const CollectiveFormCustomize: React.FC<Props> = ({
  selectedMembershipType,
  selectedTimeWindow,
  handleTimeWindowChange,
  maxMembers,
  handleMaxMembersChange,
  priceToJoin,
  handlePriceToJoinChange,
  maxPerWallet,
  handleMaxPerWalletChange,
  maxSupply,
  handleMaxSupplyChange,
  tokenDetails,
  handleClickToChangeToken,
  closeDate,
  handleCloseDateChange,
  closeTime,
  handleCloseTimeChange,
  allowOwnershipTransfer,
  handleChangeAllowOwnershipTransfer,
  isContinueButtonActive
}) => {
  const [openUntilRadioIndex, setOpenUntilRadioIndex] = useState(null);

  return (
    <div className="max-w-730">
      <div>
        {/* Who can join */}
        <div>
          <div>Who is allowed to join?</div>
          <div className="mt-1 text-sm text-gray-syn4">
            Members join by claiming a membership pass Learn more about NFTs
          </div>
          <DetailedTile
            activeIndex={2}
            onClick={null}
            disabledIndices={[0, 1]}
            options={[
              {
                icon: '/images/managerActions/allow-gray-4.svg',
                title: 'Only specific addresses',
                subTitle: 'Allowlist coming soon'
              },
              {
                icon: '/images/token-gray.svg',
                title: 'Owners of certain tokens',
                subTitle: 'Token-gating coming soon'
              },
              {
                icon: '/images/link-chain-gray.svg',
                title: 'Anyone with the link',
                subTitle: 'Unrestricted'
              }
            ]}
            customClasses="my-2"
          />
          <B3 extraClasses="text-gray-syn4">
            Members join by claiming your collective’s NFT
          </B3>
        </div>

        {/* Max members */}
        <div
          className={`w-1/2 overflow-hidden ${
            selectedMembershipType === MembershipType.CAPPED
              ? 'max-h-72 mt-8 opacity-100'
              : 'max-h-0 mt-0 opacity-0'
          } transition-all duration-500`}
        >
          <div>Max members</div>
          <InputField
            value={
              maxMembers
                ? maxMembers.toLocaleString(undefined, {
                    maximumFractionDigits: 18
                  })
                : ''
            }
            onChange={(e) => {
              const amount = stringNumberRemoveCommas(e.target.value);
              if (Number(amount)) {
                handleMaxMembersChange(Number(amount));
              } else if (amount === '') {
                handleMaxMembersChange(null);
              }
            }}
            placeholderLabel="10,000"
            extraClasses="mt-2"
            isInErrorState={maxMembers > 10000}
            infoLabel={maxMembers > 10000 && 'Max members must be below 10,000'}
          />
        </div>

        {/* Price per NFT / Max per wallet */}
        <div className="mt-8 flex space-x-5">
          <div className="w-1/2">
            <div>Price per NFT</div>
            <InputFieldPriceToJoin
              priceToJoin={priceToJoin}
              handlePriceToJoinChange={handlePriceToJoinChange}
              handleClickToChangeToken={handleClickToChangeToken}
              tokenDetails={tokenDetails}
              extraClasses="mt-2"
            />
          </div>
          <div className="w-1/2">
            <div>Max per wallet</div>
            <InputFieldMaxPerWallet
              maxPerWallet={maxPerWallet}
              handleMaxPerWalletChange={handleMaxPerWalletChange}
              extraClasses="mt-2"
            />
          </div>
        </div>

        {/* Open to new members until... */}
        <div className="my-8">
          <B2
            extraClasses="mb-4 inline-flex space-x-2"
            data-tip
            data-for="tooltip"
          >
            <div>Open to new members until</div>
            <img
              src="/images/question.svg"
              alt="Tooltip"
              className="cursor-pointer"
            />
          </B2>
          <ReactTooltip
            id="tooltip"
            place="right"
            effect="solid"
            className="actionsTooltip w-76"
            arrowColor="#222529"
            backgroundColor="#222529"
          >
            As an admin, you can open membership again anytime after closing via
            an on-chain transaction with gas.
          </ReactTooltip>
          <RadioButtonsOpenUntil
            openUntil={openUntilRadioIndex}
            setOpenUntil={setOpenUntilRadioIndex}
          />
          {/* A future date */}
          <div
            className={`${
              openUntilRadioIndex === 0
                ? 'max-h-68 mt-8 opacity-100'
                : 'max-h-0 mt-0 opacity-0'
            } transition-all duration-500 overflow-hidden`}
          >
            <B2>Time window</B2>
            <InputTimeWindow
              closeDate={closeDate}
              handleCloseDateChange={handleCloseDateChange}
              closeTime={closeTime}
              handleCloseTimeChange={handleCloseTimeChange}
              selectedTimeWindow={selectedTimeWindow}
              handleTimeWindowChange={handleTimeWindowChange}
            />
          </div>
          {/* A max number of members is reached */}
          <div
            className={`w-1/2 ${
              openUntilRadioIndex === 1
                ? 'max-h-68 mt-8 opacity-100'
                : 'max-h-0 mt-0 opacity-0'
            } transition-all duration-500 overflow-hidden`}
          >
            <B2>Max supply of NFTs</B2>
            <InputField
              value={
                maxSupply
                  ? maxSupply.toLocaleString(undefined, {
                      maximumFractionDigits: 18
                    })
                  : ''
              }
              onChange={(e) => {
                const amount = stringNumberRemoveCommas(e.target.value);
                if (Number(amount)) {
                  handleMaxSupplyChange(Number(amount));
                } else if (amount === '') {
                  handleMaxSupplyChange(null);
                }
              }}
              placeholderLabel="e.g. 1,000"
              extraClasses="my-2"
            />
            <B3 extraClasses="text-gray-syn4">
              Tip:{' '}
              <button
                onClick={() => {
                  handleMaxPerWalletChange(1);
                }}
                className="text-blue-neptune"
              >
                Set “max per wallet” to 1
              </button>{' '}
              to more accurately track member count.
            </B3>
          </div>
        </div>

        {/* Allow transfer */}
        <div className="mt-8 flex items-center justify-between">
          <div className="space-y-1">
            <div>Allow members to transfer</div>
            <div className="text-sm text-gray-syn4">
              Members will be able to transfer the collective NFTs they own
            </div>
          </div>
          <Switch
            isOn={allowOwnershipTransfer}
            onClick={() => {
              handleChangeAllowOwnershipTransfer(!allowOwnershipTransfer);
            }}
            type={SwitchType.EXPLICIT}
          />
        </div>
      </div>

      {/* Continue button */}
      <div className="mt-10">
        <button
          className={`${
            isContinueButtonActive ? 'primary-CTA' : 'primary-CTA-disabled'
          } w-full`}
        >
          Continue
        </button>
        <div className="mt-2 text-sm text-gray-syn4">
          All fields (except token symbol) are modifiable later via an on-chain
          transaction with gas.
        </div>
      </div>
    </div>
  );
};
