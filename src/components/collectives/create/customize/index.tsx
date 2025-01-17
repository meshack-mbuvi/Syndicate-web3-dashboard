import { CTAButton, CTAType } from '@/components/CTAButton';
import IconLink from '@/components/icons/link';
import IconShield from '@/components/icons/shield';
import IconToken from '@/components/icons/token';
import { InputField } from '@/components/inputs/inputField';
import { Switch, SwitchType } from '@/components/switch';
import { B2, B3, B4 } from '@/components/typography';
import { stringNumberRemoveCommas } from '@/utils/formattedNumbers';
import Image from 'next/image';
import React, { ChangeEvent } from 'react';
import ReactTooltip from 'react-tooltip';
import { InputFieldMaxPerWallet } from '../inputs/maxPerWallet';
import { OpenUntil, RadioButtonsOpenUntil } from '../inputs/openUntil/radio';
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
  handleOpenUntilChange: (newOpenUntil: OpenUntil) => void;
  openUntil: OpenUntil;
  isContinueButtonActive: boolean;
  handleContinue: (
    e?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => void | null | undefined;
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
  openUntil,
  handleOpenUntilChange,
  isContinueButtonActive,
  handleContinue
}) => {
  return (
    <div className="max-w-730 w-full">
      <div>
        {/* Who can join */}
        <div>
          <div className="pb-2">About invitations</div>
          {/* [ENG-4149] Uncomment below when we support Allowlist and Token-gating */}
          {/* <div>Who is allowed to join?</div>
          <div className="mt-1 text-sm text-gray-syn4">
            Members join by claiming a membership pass Learn more about NFTs
          </div> */}
          <div className="hidden xl:block">
            {/* [ENG-4149] Replace the "coming soon" selector with a static section */}
            <div className="border border-gray-24 rounded py-5 px-6 flex flex-row space-x-4">
              <Image
                width={24}
                height={24}
                src="/images/social/smallWeb.svg"
                alt="chain"
              />
              <div className="flex flex-col space-y-1">
                <B3>Anyone with the link can join</B3>
                <B4 extraClasses="text-gray-syn4 text-xs">
                  Members join by claiming your Collective’s NFT. If you’d like
                  to keep invitations private, only share the link with people
                  you trust. Note that your Collective will still be available
                  on-chain and could be minted directly without being sent the
                  link.
                </B4>
              </div>
            </div>

            {/* [ENG-4149] Uncomment DetailedTile when we support Allowlist and Token-gating */}
            {/* <DetailedTile
              activeIndex={2}
              // @ts-expect-error TS(2322): Type 'null' is not assignable to type '(selectedIndex: number) => void'.
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
              customClasses="mt-2"
            /> */}
          </div>
          <div className="xl:hidden space-y-3 mt-3">
            <div className="flex items-center space-x-6 border border-gray-syn6 p-4 pl-6 rounded-md cursor-not-allowed">
              <IconShield width={28} height={28} extraClasses="flex-shrink-0" />
              <div className="space-y-0.5">
                <B3 extraClasses="text-gray-syn5">Only specific addresses</B3>
                <B4 extraClasses="text-gray-syn4">Allowlist coming soon</B4>
              </div>
            </div>
            <div className="flex items-center space-x-6 border border-gray-syn6 p-4 pl-6 rounded-md cursor-not-allowed">
              <IconToken width={27} height={27} extraClasses="flex-shrink-0" />
              <div className="space-y-0.5">
                <B3 extraClasses="text-gray-syn5">Owners of certain tokens</B3>
                <B4 extraClasses="text-gray-syn4">Token-gating coming soon</B4>
              </div>
            </div>
            <div className="flex items-center space-x-6 border border-blue-neptune p-4 pl-6 rounded-md">
              <IconLink width={28} height={28} extraClasses="flex-shrink-0" />
              <div className="space-y-0.5">
                <B3>Anyone with the link</B3>
                <B4 extraClasses="text-gray-syn3">Unrestricted</B4>
              </div>
            </div>
          </div>
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
            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
              const amount = stringNumberRemoveCommas(e.target.value);
              if (Number(amount)) {
                handleMaxMembersChange?.(Number(amount));
              } else if (amount === '') {
                handleMaxMembersChange?.(0);
              }
            }}
            placeholderLabel="10,000"
            extraClasses="mt-2"
            isInErrorState={Number(maxMembers) > 10000}
            infoLabel={
              (Number(maxMembers) > 10000 &&
                'Max members must be below 10,000') ||
              ''
            }
          />
        </div>

        {/* Price per NFT / Max per wallet */}
        <div className="mt-8 md:flex space-y-8 md:space-y-0 md:space-x-5">
          <div className="md:w-1/2">
            <div>Price per NFT</div>
            <InputFieldPriceToJoin
              priceToJoin={priceToJoin}
              // @ts-expect-error TS(2322): Type '(newPriceToJoin: number) => void'... Remove this comment to see the full error message
              handlePriceToJoinChange={handlePriceToJoinChange}
              handleClickToChangeToken={handleClickToChangeToken}
              tokenDetails={tokenDetails}
              extraClasses="mt-2"
            />
            {+priceToJoin === 0 && (
              <B3 extraClasses="text-gray-syn4 pt-2">
                Members will only need to pay gas
              </B3>
            )}
          </div>
          <div className="md:w-1/2">
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
            <span
              style={{
                lineHeight: '157%'
              }}
            >
              As an admin, you can open membership again anytime after closing
              via an on-chain transaction with gas.
            </span>
          </ReactTooltip>
          <RadioButtonsOpenUntil
            openUntil={openUntil}
            setOpenUntil={handleOpenUntilChange}
          />
          {/* A future date */}
          <div
            className={`${
              openUntil === 0
                ? 'max-h-102 md:max-h-68 mt-8 opacity-100'
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
            className={`md:w-1/2 ${
              openUntil === 1
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
                  // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
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
                className="text-blue-neptune text-left"
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
      <div className="mt-10 pb-20">
        <CTAButton
          fullWidth={true}
          type={isContinueButtonActive ? CTAType.PRIMARY : CTAType.DISABLED}
          onClick={(): void => {
            if (isContinueButtonActive) {
              handleContinue();
            }
          }}
        >
          Continue
        </CTAButton>
        <B3 extraClasses="text-gray-syn4 my-2">
          All fields are modifiable later via an on-chain transaction with gas.
        </B3>
      </div>
    </div>
  );
};
