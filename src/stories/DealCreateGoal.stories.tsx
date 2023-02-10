import { DealsCreateGoal } from '@/features/deals/components/create/goals';
import { useState } from 'react';

export default {
  title: 'Organisms/Deals/Create/Goal'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  const [commitmentGoal, setCommitmentGoal] = useState<string>('');
  const [minimumCommitment, setMinimumCommitment] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');

  return (
    <DealsCreateGoal
      commitmentGoal={commitmentGoal}
      handleCommitmentGoalChange={setCommitmentGoal}
      minimumCommitment={minimumCommitment}
      handleMinimumCommitmentChange={setMinimumCommitment}
      tokenSymbol="USDC"
      handleTokenClick={() => {
        alert('Change token');
      }}
      tokenLogo="/images/prodTokenLogos/USDCoin.svg"
      destinationAddress={destinationAddress}
      handleDestinationAddressChange={setDestinationAddress}
      {...args}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  destinationAddress: ''
};

export const Error = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Error.args = {
  commitmentGoalError: 'Enter a commitment goal',
  minimumCommitmentError: 'Enter a minimum commitment amount',
  destinationAddressError: 'Not a valid address'
};
