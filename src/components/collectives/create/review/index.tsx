import AgreementTerms from '@/components/AgreementTerms';
import { InputField } from '@/components/inputs/inputField';
import { Switch, SwitchType } from '@/components/switch';
import { useCreateState } from '@/hooks/collectives/useCreateCollective';
import { ContractMapper } from '@/hooks/useGasDetails';
import { stringNumberRemoveCommas } from '@/utils/formattedNumbers';
import React, { useRef, useState } from 'react';
import { InputFieldMaxPerWallet } from '../inputs/maxPerWallet';
import { InputFieldsNameAndSymbol } from '../inputs/nameAndSymbol';
import { OpenUntil, RadioButtonsOpenUntil } from '../inputs/openUntil/radio';
import { InputFieldPriceToJoin } from '../inputs/priceToJoin';
import { InputTimeWindow, TimeWindow } from '../inputs/timeWindow';
import NetworkComponent from '../networkComponent';

interface Props {
  nameValue: string;
  handleNameChange: (input: string) => void;
  tokenSymbolValue: string;
  handleTokenSymbolChange: (input: string) => void;
  priceToJoin: number;
  handlePriceToJoinChange: (newPriceToJoin: number) => void;
  tokenDetails?: { symbol: string; icon: string };
  handleClickToChangeToken: () => void;
  maxPerWallet: number;
  handleMaxPerWalletChange: (newMaxPerWallet: number) => void;
  openUntil: OpenUntil;
  setOpenUntil: (newOpenUntil: OpenUntil) => void;
  closeDate?: Date;
  handleCloseDateChange?: (newDate: Date) => void;
  closeTime?: string;
  handleCloseTimeChange?: (newTime: string) => void;
  maxSupply;
  handleMaxSupplyChange: (newMaxSupply: number) => void;
  selectedTimeWindow?: TimeWindow;
  handleTimeWindowChange?: (newTimeWindowIndex: number) => void;
  endOfTimeWindow: string;
  allowOwnershipTransfer: boolean;
  handleChangeAllowOwnershipTransfer: (newAllowingTransfer: boolean) => void;
  handleSubmit: () => void;
  hasAgreedToTerms: boolean;
  handleAgreedToTerms: () => void;
  account: string;
  handleConnectWallet: () => void;
  isSubmitButtonActive: boolean;
}

export const CollectiveFormReview: React.FC<Props> = ({
  nameValue,
  handleNameChange,
  tokenSymbolValue,
  handleTokenSymbolChange,
  priceToJoin,
  handlePriceToJoinChange,
  tokenDetails,
  handleClickToChangeToken,
  maxPerWallet,
  handleMaxPerWalletChange,
  openUntil,
  setOpenUntil,
  closeDate,
  handleCloseDateChange,
  closeTime,
  handleCloseTimeChange,
  maxSupply,
  handleMaxSupplyChange,
  selectedTimeWindow,
  handleTimeWindowChange,
  endOfTimeWindow,
  allowOwnershipTransfer,
  handleChangeAllowOwnershipTransfer,
  handleSubmit,
  hasAgreedToTerms,
  handleAgreedToTerms,
  account,
  handleConnectWallet,
  isSubmitButtonActive
}) => {
  const spaceBetweenTitleAndSubtitleStyles =
    'px-5 py-4 -my-4 mt-4 w-full hover:bg-gray-syn8 rounded-2xl flex justify-between items-center visibility-container transition-all ease-out';
  const taglineStyles = 'text-sm text-gray-syn4';
  const editButtonStyles = 'text-blue-neptune visibility-hover invisible';
  const transitionStyles = 'transition-all duration-500';
  const [currentlyEditingIndex, setCurrentlyEditingIndex] = useState(null);
  const formRef = useRef(null);

  const {
    name,
    symbol,
    pricePerNFT,
    maxPerWallet: maxPerMember,
    openUntil: openUntilWindow,
    EpochCloseTime,
    maxSupply: totalSupply,
    transferrable,
    creationStatus
  } = useCreateState();

  const bottomBar = (
    <div
      className="flex w-full justify-center items-center bg-black"
      style={{
        borderRadius: '40px 40px 0px 0px'
      }}
    >
      <NetworkComponent
        account={account}
        disabled={!hasAgreedToTerms || !isSubmitButtonActive}
        handleLaunch={handleSubmit}
        handleConnectWallet={handleConnectWallet}
        contract={ContractMapper.ERC721CollectiveFactory}
        args={{
          collectiveParams: {
            collectiveName: name,
            collectiveSymbol: symbol,
            totalSupply,
            maxPerMember,
            openUntil: openUntilWindow,
            ethPrice: pricePerNFT,
            tokenURI: creationStatus.ipfsHash,
            startTime: '0',
            endTime: String(EpochCloseTime),
            allowTransfer: transferrable
          }
        }}
      />
    </div>
  );

  return (
    <div ref={formRef} className="h-full max-w-730 w-full">
      <div className="-mt-8">
        {/* Name */}
        <div className={spaceBetweenTitleAndSubtitleStyles}>
          <div>
            <div
              className={`${
                currentlyEditingIndex === 0
                  ? 'max-h-40 opacity-100'
                  : 'max-h-0 opacity-0'
              } overflow-hidden ${transitionStyles}`}
            >
              <InputFieldsNameAndSymbol
                nameValue={nameValue}
                handleNameChange={handleNameChange}
                tokenSymbolValue={tokenSymbolValue}
                handleTokenSymbolChange={handleTokenSymbolChange}
              />
            </div>
            <div
              className={`${
                currentlyEditingIndex !== 0
                  ? 'max-h-40 opacity-100'
                  : 'max-h-0 opacity-0'
              } overflow-hidden ${transitionStyles}`}
            >
              <div className="space-y-2">
                <div className={taglineStyles}>Name</div>
                <div className="flex space-x-2">
                  <div>{nameValue}</div>
                  <div className="text-gray-syn4">
                    {'✺'}
                    {tokenSymbolValue}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className={editButtonStyles}
            onClick={() => {
              if (currentlyEditingIndex !== 0) {
                setCurrentlyEditingIndex(0);
              } else {
                setCurrentlyEditingIndex(null);
              }
            }}
          >
            {currentlyEditingIndex === 0 ? 'Done' : 'Edit'}
          </button>
        </div>

        {/* [ENG-4149] Invitation */}
        {/* <div className={spaceBetweenTitleAndSubtitleStyles}>
          <div className="space-y-2">
            <div className={taglineStyles}>Invitation</div>
            <div className="flex space-x-2">
              <div>Unrestricted</div>
              <div className="text-gray-syn4">
                Anyone with the link can join
              </div>
            </div>
          </div>
        </div> */}

        {/* Price per pass */}
        <div className={spaceBetweenTitleAndSubtitleStyles}>
          <div>
            <div className="space-y-2">
              <div className={taglineStyles}>Price per NFT</div>
              <div>
                <div
                  className={`${
                    currentlyEditingIndex === 2
                      ? 'max-h-40 opacity-100'
                      : 'max-h-0 opacity-0'
                  } overflow-hidden ${transitionStyles}`}
                >
                  <InputFieldPriceToJoin
                    priceToJoin={priceToJoin}
                    handlePriceToJoinChange={handlePriceToJoinChange}
                    tokenDetails={tokenDetails}
                    handleClickToChangeToken={handleClickToChangeToken}
                    extraClasses="w-full"
                  />
                </div>
                <div
                  className={`${
                    currentlyEditingIndex !== 2
                      ? 'max-h-40 opacity-100'
                      : 'max-h-0 opacity-0'
                  } overflow-hidden ${transitionStyles}`}
                >
                  <div className="flex space-x-1 items-center">
                    <img
                      src={tokenDetails.icon}
                      alt="Token"
                      className="h-5 w-5 mr-1"
                    />{' '}
                    <div>{priceToJoin}</div>
                    <div>{tokenDetails.symbol}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            className={editButtonStyles}
            onClick={() => {
              if (currentlyEditingIndex !== 2) {
                setCurrentlyEditingIndex(2);
              } else {
                setCurrentlyEditingIndex(null);
              }
            }}
          >
            {currentlyEditingIndex === 2 ? 'Done' : 'Edit'}
          </button>
        </div>

        {/* Max per wallet */}
        <div className={spaceBetweenTitleAndSubtitleStyles}>
          <div className="space-y-2">
            <div className={taglineStyles}>Max per wallet</div>
            <div>
              <div
                className={`${
                  currentlyEditingIndex === 3
                    ? 'max-h-40 opacity-100'
                    : 'max-h-0 opacity-0'
                } overflow-hidden ${transitionStyles}`}
              >
                <InputFieldMaxPerWallet
                  maxPerWallet={maxPerWallet}
                  handleMaxPerWalletChange={handleMaxPerWalletChange}
                />
              </div>
              <div
                className={`${
                  currentlyEditingIndex !== 3
                    ? 'max-h-40 opacity-100'
                    : 'max-h-0 opacity-0'
                } overflow-hidden ${transitionStyles}`}
              >
                {maxPerWallet}
              </div>
            </div>
          </div>
          <button
            className={editButtonStyles}
            onClick={() => {
              if (currentlyEditingIndex !== 3) {
                setCurrentlyEditingIndex(3);
              } else {
                setCurrentlyEditingIndex(null);
              }
            }}
          >
            {currentlyEditingIndex === 3 ? 'Done' : 'Edit'}
          </button>
        </div>

        {/* Open until... */}
        <div className={spaceBetweenTitleAndSubtitleStyles}>
          <div>
            <div className="space-y-2">
              <div className={taglineStyles}>Open to new members until</div>
              <div>
                <div
                  className={`${
                    currentlyEditingIndex === 4
                      ? 'max-h-40 opacity-100'
                      : 'max-h-0 opacity-0'
                  } overflow-hidden ${transitionStyles}`}
                >
                  <RadioButtonsOpenUntil
                    openUntil={openUntil}
                    setOpenUntil={setOpenUntil}
                  />
                </div>
                <div
                  className={`${
                    currentlyEditingIndex !== 4
                      ? 'max-h-40 opacity-100'
                      : 'max-h-0 opacity-0'
                  } overflow-hidden ${transitionStyles}`}
                >
                  <div>
                    {openUntil === OpenUntil.FUTURE_DATE && 'A future date'}
                    {/* {openUntil === OpenUntil.MANUALLY_CLOSED &&
                      'Manually closed'} */}
                    {openUntil === OpenUntil.MAX_MEMBERS &&
                      'Max members reached'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className={editButtonStyles}
            onClick={() => {
              if (currentlyEditingIndex !== 4) {
                setCurrentlyEditingIndex(4);
              } else {
                setCurrentlyEditingIndex(null);
              }
            }}
          >
            {currentlyEditingIndex === 4 ? 'Done' : 'Edit'}
          </button>
        </div>

        {/* Time window */}
        {openUntil === OpenUntil.FUTURE_DATE && (
          <div className={spaceBetweenTitleAndSubtitleStyles}>
            <div className="space-y-2">
              <div className={taglineStyles}>Time window</div>
              <div>
                <div
                  className={`${
                    currentlyEditingIndex === 5
                      ? 'max-h-60 opacity-100'
                      : 'max-h-0 opacity-0'
                  } overflow-hidden ${transitionStyles}`}
                >
                  <InputTimeWindow
                    closeDate={closeDate}
                    handleCloseDateChange={handleCloseDateChange}
                    closeTime={closeTime}
                    handleCloseTimeChange={handleCloseTimeChange}
                    selectedTimeWindow={selectedTimeWindow}
                    handleTimeWindowChange={handleTimeWindowChange}
                  />
                </div>
                <div
                  className={`${
                    currentlyEditingIndex !== 5
                      ? 'max-h-40 opacity-100'
                      : 'max-h-0 opacity-0'
                  } overflow-hidden ${transitionStyles} flex space-x-2`}
                >
                  <div>
                    {selectedTimeWindow === TimeWindow.DAY && '24 hours'}
                    {selectedTimeWindow === TimeWindow.WEEK && '1 week'}
                    {selectedTimeWindow === TimeWindow.MONTH && '1 month'}
                    {selectedTimeWindow === TimeWindow.CUSTOM && 'Custom'}
                  </div>
                  <div className="text-gray-syn4">{`Until ${endOfTimeWindow}`}</div>
                </div>
              </div>
            </div>
            <button
              className={editButtonStyles}
              onClick={() => {
                if (currentlyEditingIndex !== 5) {
                  setCurrentlyEditingIndex(5);
                } else {
                  setCurrentlyEditingIndex(null);
                }
              }}
            >
              {currentlyEditingIndex === 5 ? 'Done' : 'Edit'}
            </button>
          </div>
        )}

        {/* Max Supply */}
        {openUntil === OpenUntil.MAX_MEMBERS && (
          <div className={spaceBetweenTitleAndSubtitleStyles}>
            <div className="space-y-2">
              <div className={taglineStyles}>Max supply of passes</div>
              <div>
                <div
                  className={`${
                    currentlyEditingIndex === 6
                      ? 'max-h-60 opacity-100'
                      : 'max-h-0 opacity-0'
                  } overflow-hidden ${transitionStyles}`}
                >
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
                    placeholderLabel="1"
                    extraClasses="my-2"
                  />
                </div>
                <div
                  className={`${
                    currentlyEditingIndex !== 6
                      ? 'max-h-40 opacity-100'
                      : 'max-h-0 opacity-0'
                  } overflow-hidden ${transitionStyles}`}
                >
                  {maxSupply}
                </div>
              </div>
            </div>
            <button
              className={editButtonStyles}
              onClick={() => {
                if (currentlyEditingIndex !== 6) {
                  setCurrentlyEditingIndex(6);
                } else {
                  setCurrentlyEditingIndex(null);
                }
              }}
            >
              {currentlyEditingIndex === 6 ? 'Done' : 'Edit'}
            </button>
          </div>
        )}

        {/* Allow transfer */}
        <div className={spaceBetweenTitleAndSubtitleStyles}>
          <div className="space-y-2">
            <div className={taglineStyles}>Allow members to transfer</div>
            <div>
              <div
                className={`${
                  currentlyEditingIndex === 7
                    ? 'max-h-40 opacity-100'
                    : 'max-h-0 opacity-0'
                } overflow-hidden ${transitionStyles}`}
              >
                <Switch
                  isOn={allowOwnershipTransfer}
                  onClick={() => {
                    handleChangeAllowOwnershipTransfer(!allowOwnershipTransfer);
                  }}
                  type={SwitchType.EXPLICIT}
                />
              </div>
              <div
                className={`${
                  currentlyEditingIndex !== 7
                    ? 'max-h-40 opacity-100'
                    : 'max-h-0 opacity-0'
                } overflow-hidden ${transitionStyles}`}
              >
                {allowOwnershipTransfer ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
          <button
            className={editButtonStyles}
            onClick={() => {
              if (currentlyEditingIndex !== 7) {
                setCurrentlyEditingIndex(7);
              } else {
                setCurrentlyEditingIndex(null);
              }
            }}
          >
            {currentlyEditingIndex === 7 ? 'Done' : 'Edit'}
          </button>
        </div>
        {
          <div className="pt-10 pb-40">
            <AgreementTerms
              hasAgreed={hasAgreedToTerms}
              handleAgreed={handleAgreedToTerms}
            />
          </div>
        }
      </div>

      <div
        className={`transition-opacity fixed w-full animate-move-in left-0 z-30 bottom-0 transparent`}
        style={{
          borderRadius: '40px 40px 0px 0px'
        }}
      >
        <div className="flex justify-center w-full">{bottomBar}</div>
      </div>
    </div>
  );
};
