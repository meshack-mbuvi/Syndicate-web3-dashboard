import { InputField } from '@/components/inputs/inputField';
import {
  InputFieldWithToken,
  SymbolDisplay
} from '@/components/inputs/inputFieldWithToken';
import {
  formatInputValueWithCommas,
  stringNumberRemoveCommas
} from '@/utils/formattedNumbers';
import { useState } from 'react';
import { CreateFlowStepTemplate } from '..';

interface Props {
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
  handleTokenClick: () => void;
}

enum SelectedInput {
  GOAL = 0,
  AMOUNT = 1,
  ADDRESS = 2
}

export const DealsCreateGoal: React.FC<Props> = ({
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
  handleTokenClick
}) => {
  const [activeInputIndex, setActiveInputIndex] =
    useState<SelectedInput | null>(null);

  return (
    <CreateFlowStepTemplate
      title="What’s the raise goal? Who’s it for?"
      activeInputIndex={activeInputIndex}
      inputs={[
        {
          input: (
            <InputFieldWithToken
              value={formatInputValueWithCommas(commitmentGoal)}
              placeholderLabel={`100,000 ${tokenSymbol}`}
              onChange={(e) => {
                const input = e.target.value;
                if (isNaN(Number(input.replace(/,/g, '')))) {
                  return;
                }
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
          info: 'This is the goal that you are striving to raise for this deal. This is not a cap on how much can be committed'
        },
        {
          input: (
            <InputFieldWithToken
              value={formatInputValueWithCommas(minimumCommitment)}
              placeholderLabel={`2,000 ${tokenSymbol}`}
              depositTokenLogo={tokenLogo}
              onChange={(e) => {
                const input = e.target.value;
                if (isNaN(Number(input.replace(/,/g, '')))) {
                  return;
                }
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
          info: 'This is the minimum amount that a deal participant can contribute. You can set this to zero if you like'
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
          info: 'This is the address that will receive funds after commitments are received and a deal is executed.'
        }
      ]}
    />
  );
};
