import { InputFieldWithAddOn } from '@/components/inputs/inputFieldWithAddOn';
import {
  InputFieldWithToken,
  SymbolDisplay
} from '@/components/inputs/inputFieldWithToken';
// import { TextArea } from '@/components/inputs/simpleTextArea';
import {
  formatInputValueWithCommas,
  stringNumberRemoveCommas
} from '@/utils/formattedNumbers';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { CreateFlowStepTemplate } from '..';
import { InputField } from '@/components/inputs/inputField';
import { DetailedTile } from '@/components/tile/detailedTile';
import { SelectedTimeWindow } from '../window';
import { InputFieldWithDate } from '@/components/inputs/inputFieldWithDate';
import { InputFieldWithTime } from '@/components/inputs/inputFieldWithTime';
import { InputFieldCreateToken } from '@/components/inputs/create/InputFieldCreateToken';
import { useCreateDealContext } from '@/context/createDealContext';
import { default as _moment } from 'moment-timezone';
import { formatAddress } from '@/utils/formatAddress';
import { B2 } from '@/components/typography';
import { SyndicateTokenLogo } from '@/components/icons/syndicateTokenLogo';

interface Props {
  // About
  name: string;
  nameError?: string;
  handleNameChange?: (newTitle: string) => void;
  handleShuffle?: (e: any) => void;
  // details: string;
  // detailsError?: string;
  // handleDetailsChange?: (newDetails: string) => void;

  // Goal
  commitmentGoal: string;
  commitmentGoalError?: string;
  handleCommitmentGoalChange?: (newCommitmentGoal: string) => void;
  minimumCommitment: string;
  minimumCommitmentError?: string;
  handleMinimumCommitmentChange?: (newMinimumCommitment: string) => void;
  destinationAddress: string;
  destinationAddressError?: string;
  handleDestinationAddressChange?: (newDestinationAddress: string) => void;
  tokenSymbol: string;
  tokenLogo: string;
  handleTokenClick?: () => void;
  handleTokenSymbolChange?: (tokenSymbol: string) => void;

  // Window
  selectedTimeWindow: SelectedTimeWindow | null;
  handleSelectedTimeWindowChange?: (newWindow: SelectedTimeWindow) => void;
  customDate?: Date;
  handleCustomDateChange?: (newDate: Date) => void;
  customTime?: string;
  handleCustomTimeChange?: (newTime: string) => void;
  formattedWindowEndTime?: string;

  isReviewStep?: boolean;
  setIsEditingField?: Dispatch<SetStateAction<boolean>> | null;
  // Participation
  // reuses other props (tokenSymbol, handleTokenClick)
}

enum SelectedInput {
  GOAL = 0,
  AMOUNT = 1,
  ADDRESS = 2
}

export const DealsCreateReview: React.FC<Props> = ({
  // About
  name,
  nameError,
  handleNameChange,
  handleShuffle,
  // details,
  // detailsError,
  // handleDetailsChange,
  isReviewStep,
  setIsEditingField,

  // Goal
  commitmentGoal,
  commitmentGoalError,
  handleCommitmentGoalChange,
  minimumCommitment,
  minimumCommitmentError,
  handleMinimumCommitmentChange,
  destinationAddress,
  destinationAddressError,
  handleDestinationAddressChange,
  tokenSymbol,
  tokenLogo,
  handleTokenClick,
  handleTokenSymbolChange,

  // Window
  selectedTimeWindow,
  handleSelectedTimeWindowChange,
  customDate,
  handleCustomDateChange,
  customTime,
  handleCustomTimeChange,
  formattedWindowEndTime
}) => {
  const [activeInputIndex, setActiveInputIndex] =
    useState<SelectedInput | null>(null);
  const [closeTimeString, setCloseTimeString] = useState('');
  const showCustomTimeSelector =
    selectedTimeWindow === SelectedTimeWindow.CUSTOM;

  const { endTime, ensName } = useCreateDealContext();
  useEffect(() => {
    if (endTime) {
      const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setCloseTimeString(
        _moment(+endTime)
          .tz(timeZoneString)
          .format('MMM D,  YYYY, hh:mmA zz')
      );
    }
  }, [endTime]);

  const hideCallouts = activeInputIndex === null ? true : false;

  // do not show the network component at the bottom when editing is in progress
  useEffect(() => {
    if (!hideCallouts && isReviewStep && setIsEditingField) {
      setIsEditingField(true);
    } else {
      setIsEditingField ? setIsEditingField(false) : null;
    }
  }, [isReviewStep, hideCallouts, setIsEditingField]);

  return (
    <CreateFlowStepTemplate
      title="Review"
      activeInputIndex={activeInputIndex}
      isReview={true}
      hideCallouts={hideCallouts}
      handleCurrentReviewEditingIndex={(newIndex) => {
        setActiveInputIndex(newIndex);
      }}
      isReviewStep={isReviewStep}
      inputs={[
        // About
        {
          input: (
            <InputFieldWithAddOn
              value={name}
              onChange={(e) => {
                handleNameChange ? handleNameChange(e.target.value) : null;
              }}
              addOn={
                <div className="rounded-full px-4 py-1.5 text-black bg-white hover:bg-gray-syn2 active:bg-gray-syn3">
                  <svg
                    className="fill-current"
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1.87408 13.5098C1.3218 13.5098 0.874084 13.9575 0.874084 14.5098C0.874084 15.0621 1.3218 15.5098 1.87408 15.5098V13.5098ZM12.0408 5.93274L11.2105 5.37543L12.0408 5.93274ZM6.58098 14.0671L7.41129 14.6244L6.58098 14.0671ZM1.87408 15.5098H5.75068V13.5098H1.87408V15.5098ZM7.41129 14.6244L12.8711 6.49004L11.2105 5.37543L5.75068 13.5098L7.41129 14.6244ZM12.8711 6.49004H17.8113V4.49004H12.8711V6.49004ZM12.8711 6.49004L12.8711 6.49004V4.49004C12.2046 4.49004 11.5819 4.82204 11.2105 5.37543L12.8711 6.49004ZM5.75068 15.5098C6.41716 15.5098 7.03986 15.1778 7.41129 14.6244L5.75068 13.5098L5.75068 13.5098V15.5098Z" />
                    <path d="M1.87408 6.49004C1.3218 6.49004 0.874084 6.04233 0.874084 5.49004C0.874084 4.93776 1.3218 4.49004 1.87408 4.49004V6.49004ZM6.58098 5.93274L7.41129 5.37543L6.58098 5.93274ZM1.87408 4.49004H5.75068V6.49004H1.87408V4.49004ZM7.41129 5.37543L12.8711 13.5098L11.2105 14.6244L5.75068 6.49004L7.41129 5.37543ZM12.8711 13.5098H17.8113V15.5098H12.8711V13.5098ZM12.8711 13.5098L12.8711 13.5098V15.5098C12.2046 15.5098 11.5819 15.1778 11.2105 14.6244L12.8711 13.5098ZM5.75068 4.49004C6.41716 4.49004 7.03986 4.82204 7.41129 5.37543L5.75068 6.49004L5.75068 6.49004V4.49004Z" />
                    <path d="M20.7753 5.32786C20.8859 5.40768 20.8859 5.57238 20.7753 5.65221L16.4868 8.74716C16.3545 8.84262 16.1698 8.7481 16.1698 8.58498L16.1698 2.39508C16.1698 2.23196 16.3545 2.13745 16.4868 2.23291L20.7753 5.32786Z" />
                    <path d="M20.7753 14.3476C20.8859 14.4275 20.8859 14.5922 20.7753 14.672L16.4868 17.7669C16.3545 17.8624 16.1698 17.7679 16.1698 17.6048L16.1698 11.4149C16.1698 11.2517 16.3545 11.1572 16.4868 11.2527L20.7753 14.3476Z" />
                  </svg>
                </div>
              }
              addOnOnClick={(e?: React.MouseEvent<HTMLElement>): void => {
                handleShuffle ? handleShuffle(e) : null;
              }}
              placeholderLabel="Name your deal"
              onFocus={() => {
                setActiveInputIndex(0);
              }}
              isInErrorState={nameError ? true : false}
              infoLabel={nameError ? nameError : null}
            />
          ),
          label: 'Deal title',
          info: 'Your deal’s name is stored on-chain, so it’s publicly visible. If you’d prefer to obfuscate this deal, generate a random name.',
          reviewValue: name
        },
        /* {
          input: (
            <TextArea
              value={details}
              handleValueChange={handleDetailsChange}
              widthClass="w-full"
              placeholderLabel="Give prospective participants as much information as possible to help them understand this deal. Feel free to put links here as well to documents or websites that they may want to look at. This information will be public to anyone who views this page."
              onFocus={() => {
                setActiveInputIndex(1);
              }}
              isInErrorState={detailsError ? true : false}
              helperText={detailsError ? detailsError : undefined}
            />
          ),
          label: 'Details',
          info: 'Describe what this and what a participant needs to know to get more information if needed. This information is to inform potnetial participants and will be public to all viewers.',
          reviewValue: details
        }, */

        // Goal
        {
          input: (
            <InputFieldWithToken
              value={formatInputValueWithCommas(commitmentGoal)}
              placeholderLabel={`100,000 ${tokenSymbol}`}
              onChange={(e): void => {
                const input = e.target.value;
                const strippedCommasInput = stringNumberRemoveCommas(input);
                handleCommitmentGoalChange
                  ? handleCommitmentGoalChange(strippedCommasInput)
                  : null;
              }}
              symbolDisplayVariant={SymbolDisplay.ONLY_LOGO}
              depositTokenSymbol={tokenSymbol}
              depositTokenLogo={tokenLogo}
              handleTokenClick={handleTokenClick}
              onFocus={() => {
                setActiveInputIndex(SelectedInput.GOAL);
              }}
              isInErrorState={commitmentGoalError ? true : false}
              infoLabel={commitmentGoalError ? commitmentGoalError : undefined}
            />
          ),
          label: 'Commitment goal',
          info: 'This is the goal that you are striving to raise for this deal. This is not a cap on how much can be committed',
          reviewValue: (
            <div className="flex space-x-2 items-center">
              <img src={tokenLogo} className="w-5 h-5" alt="Token logo" />
              <div>{formatInputValueWithCommas(commitmentGoal)}</div>
            </div>
          )
        },
        {
          input: (
            <InputFieldWithToken
              value={formatInputValueWithCommas(minimumCommitment)}
              placeholderLabel={`2,000 ${tokenSymbol}`}
              depositTokenLogo={tokenLogo}
              onChange={(e) => {
                const input = e.target.value;
                const strippedCommasInput = stringNumberRemoveCommas(input);
                handleMinimumCommitmentChange
                  ? handleMinimumCommitmentChange(strippedCommasInput)
                  : null;
              }}
              symbolDisplayVariant={SymbolDisplay.ONLY_LOGO}
              handleTokenClick={handleTokenClick}
              onFocus={() => {
                setActiveInputIndex(SelectedInput.AMOUNT);
              }}
              isInErrorState={minimumCommitmentError ? true : false}
              infoLabel={
                minimumCommitmentError ? minimumCommitmentError : undefined
              }
            />
          ),
          label: 'Minimum commitment amount',
          info: 'This is the minimum amount that a deal participant can contribute. You can set this to zero if you like',
          reviewValue: (
            <div className="flex space-x-2 items-center">
              <img src={tokenLogo} className="w-5 h-5" alt="Token logo" />
              <div>{formatInputValueWithCommas(minimumCommitment)}</div>
            </div>
          )
        },
        {
          input: (
            <InputField
              value={destinationAddress}
              onChange={(e) => {
                handleDestinationAddressChange
                  ? handleDestinationAddressChange(e.target.value)
                  : null;
              }}
              onFocus={() => {
                setActiveInputIndex(SelectedInput.ADDRESS);
              }}
              placeholderLabel="0xab123... or ensname.eth"
              isInErrorState={destinationAddressError ? true : false}
              infoLabel={
                destinationAddressError ? destinationAddressError : undefined
              }
            />
          ),
          label: 'Deal destination address',
          info: 'This is the address that will receive funds after commitments are received and a deal is executed.',
          reviewValue: `${
            ensName ? ensName : formatAddress(destinationAddress, 6, 4)
          }`
        },

        // Window
        {
          input: (
            <div className="space-y-2">
              <DetailedTile
                activeIndex={selectedTimeWindow as number}
                onClick={(index) => {
                  handleSelectedTimeWindowChange
                    ? handleSelectedTimeWindowChange(index)
                    : null;
                  if (index === SelectedTimeWindow.DAY) {
                    handleSelectedTimeWindowChange
                      ? handleSelectedTimeWindowChange(index)
                      : null;
                  }
                }}
                options={[
                  { title: '24 hours' },
                  { title: '1 week' },
                  { title: '1 month' },
                  { title: 'Custom' }
                ]}
              />
              <div className="flex space-x-2">
                <div className="md:w-1/2">
                  <InputFieldWithDate
                    selectedDate={customDate}
                    onChange={(newDate) => {
                      if (handleCustomDateChange && newDate) {
                        handleCustomDateChange(newDate);
                      }
                    }}
                  />
                </div>
                <div className="md:w-1/2">
                  <InputFieldWithTime
                    value={customTime}
                    onChange={(e) => {
                      if (handleCustomTimeChange) {
                        handleCustomTimeChange(e.target.value);
                      }
                    }}
                    placeholderLabel="Time"
                  />
                </div>
              </div>
            </div>
          ),
          label: `Commitment window`,
          info: `${
            showCustomTimeSelector
              ? 'This is the window when participants are able to pre-commit capital to the deal. You will have to finalize the deal manually though in order to close'
              : 'Participants are able to pre-commit capital to the deal until this day. You cannot extend this date but you can close early'
          }`,
          reviewValue: (
            <div className="flex space-x-2">
              <div>
                {selectedTimeWindow === SelectedTimeWindow.CUSTOM
                  ? 'Custom'
                  : `${
                      selectedTimeWindow === SelectedTimeWindow.DAY
                        ? '24 hours'
                        : selectedTimeWindow === SelectedTimeWindow.WEEK
                        ? 'Week'
                        : selectedTimeWindow === SelectedTimeWindow.MONTH
                        ? 'Month'
                        : ''
                    }`}
              </div>
              {formattedWindowEndTime && (
                <div className="text-gray-syn4">{closeTimeString}</div>
              )}
            </div>
          )
        },

        // Participation
        {
          input: (
            <InputFieldCreateToken
              tokenSymbolValue={tokenSymbol}
              handleTokenSymbolChange={handleTokenSymbolChange}
            />
          ),
          label: `Participation Token`,
          info: `This is the symbol of the non-tranferable token that will be distributed proportionally to those who you accept into the deal when you execute. Learn more`,
          reviewValue: (
            <div className="flex space-x-2 items-center">
              <B2>{name}</B2>
              <B2 className="text-gray-syn4 flex items-center">
                <SyndicateTokenLogo />
                {tokenSymbol}
              </B2>
            </div>
          )
        }
      ]}
    />
  );
};
