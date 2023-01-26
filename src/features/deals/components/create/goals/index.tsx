import { InputFieldWithAddOn } from '@/components/inputs/inputFieldWithAddOn';
import {
  InputFieldWithToken,
  SymbolDisplay
} from '@/components/inputs/inputFieldWithToken';
import { useCreateDealContext } from '@/context/createDealContext';
import { AppState } from '@/state';
import { CreateFlowStepTemplate } from '@/templates/createFlowStepTemplate';
import {
  formatInputValueWithCommas,
  stringNumberRemoveCommas
} from '@/utils/formattedNumbers';
import { useState } from 'react';
import { useSelector } from 'react-redux';

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
  const {
    web3Reducer: {
      web3: { account }
    }
  } = useSelector((state: AppState) => state);

  const [activeInputIndex, setActiveInputIndex] =
    useState<SelectedInput | null>(null);
  const { handleNext, isNextButtonDisabled, showNextButton } =
    useCreateDealContext();
  return (
    <CreateFlowStepTemplate
      title="What’s the raise goal? Who’s it for?"
      activeInputIndex={activeInputIndex}
      handleNext={handleNext}
      isNextButtonDisabled={isNextButtonDisabled ?? false}
      showNextButton={showNextButton ?? false}
      inputs={[
        {
          input: (
            <InputFieldWithToken
              value={formatInputValueWithCommas(commitmentGoal)}
              placeholderLabel={`100,000`}
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
              symbolDisplayVariant={SymbolDisplay.LOGO_AND_SYMBOL}
              depositTokenSymbol={tokenSymbol}
              depositTokenLogo={tokenLogo}
              handleTokenClick={handleTokenClick}
              onFocus={(): void => {
                setActiveInputIndex(SelectedInput.GOAL);
              }}
              isInErrorState={commitmentGoalError ? true : false}
              infoLabel={commitmentGoalError ? commitmentGoalError : undefined}
            />
          ),
          label: 'Goal',
          info: 'This is the goal that you are striving to raise for this deal. This is not a cap on how much can be contributed.'
        },
        {
          input: (
            <InputFieldWithToken
              value={formatInputValueWithCommas(minimumCommitment)}
              placeholderLabel={`2,000`}
              depositTokenSymbol={tokenSymbol}
              depositTokenLogo={tokenLogo}
              onChange={(e): void => {
                const input = e.target.value;
                if (isNaN(Number(input.replace(/,/g, '')))) {
                  return;
                }
                const strippedCommasInput = stringNumberRemoveCommas(input);
                handleMinimumCommitmentChange
                  ? handleMinimumCommitmentChange(strippedCommasInput)
                  : null;
              }}
              symbolDisplayVariant={SymbolDisplay.LOGO_AND_SYMBOL}
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
          label: 'Minimum contribution amount',
          info: 'This is the minimum amount that a deal participant can contribute. You can set this to zero if you like'
        },
        {
          input: (
            <InputFieldWithAddOn
              value={destinationAddress}
              onChange={(e): void => {
                handleDestinationAddressChange
                  ? handleDestinationAddressChange(e.target.value)
                  : null;
              }}
              onFocus={(): void => {
                setActiveInputIndex(SelectedInput.ADDRESS);
              }}
              placeholderLabel="0xab123... or ensname.eth"
              isInErrorState={destinationAddressError ? true : false}
              infoLabel={
                destinationAddressError ? destinationAddressError : undefined
              }
              hideButton={!account || !!destinationAddress}
              addOn={'Use connected address'}
              addOnOnClick={() => {
                handleDestinationAddressChange
                  ? handleDestinationAddressChange(account)
                  : null;
              }}
            />
          ),
          label: 'Deal destination address',
          info: 'This is the address that will receive funds after commitments are received and a deal is executed.'
        }
      ]}
    />
  );
};
