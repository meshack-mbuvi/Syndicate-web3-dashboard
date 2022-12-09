import { DealsCreateGoal } from '@/features/deals/components/create/goals';
import { useCreateDealContext } from '@/context/createDealContext';

export const DealGoal: React.FC = () => {
  const {
    // field values
    commitmentGoal,
    handleCommitmentGoalChange,
    minimumCommitment,
    handleMinimumCommitmentChange,
    destinationAddress,
    handleDestinationAddressChange,
    destinationAddressError,
    commitmentGoalTokenLogo,
    commitmentGoalTokenSymbol
  } = useCreateDealContext();

  // do we need this for now?
  // probably not for v0
  const handleTokenClick = () => {
    console.log('change token');
  };

  return (
    <DealsCreateGoal
      commitmentGoal={commitmentGoal ? commitmentGoal : ''}
      handleCommitmentGoalChange={handleCommitmentGoalChange}
      minimumCommitment={minimumCommitment ? minimumCommitment : ''}
      handleMinimumCommitmentChange={handleMinimumCommitmentChange}
      tokenSymbol={commitmentGoalTokenSymbol ? commitmentGoalTokenSymbol : ''}
      handleTokenClick={(): void => handleTokenClick()}
      tokenLogo={commitmentGoalTokenLogo ? commitmentGoalTokenLogo : ''}
      destinationAddress={destinationAddress ? destinationAddress : ''}
      destinationAddressError={
        destinationAddressError ? destinationAddressError : ''
      }
      handleDestinationAddressChange={handleDestinationAddressChange}
    />
  );
};
