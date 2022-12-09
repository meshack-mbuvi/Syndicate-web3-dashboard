import { DealsCreateReview } from '@/features/deals/components/create/review';
import { SelectedTimeWindow } from '@/features/deals/components/create/window';
import { useState } from 'react';

export default {
  title: '5. Organisms/Deals/Create/Review'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  // About
  const [name, handleNameChange] = useState('Privax Deal');
  const [details, handleDetailsChange] = useState(
    'Seed round for a zk-identity startup. This will roll up all participants to invest in a privacy focused identity startup called Privax utilizing zero-knowledge shell proofs to allow users to manage their own anonymity.'
  );

  // Goal
  const [commitmentGoal, setCommitmentGoal] = useState<string>('100000');
  const [minimumCommitment, setMinimumCommitment] = useState<string>('3000');
  const [destinationAddress, setDestinationAddress] =
    useState<string>('startuphuman.eth2');

  // Window
  const [selectedTimeWindow, setSelectedTimeWindow] =
    useState<SelectedTimeWindow | null>(SelectedTimeWindow.CUSTOM);
  const [customDate, setCustomDate] = useState<Date>();
  const [customTime, setCustomTime] = useState<string>();

  // Participation
  // Reusing props (tokenSymbol, handleTokenClick)

  return (
    <DealsCreateReview
      // About
      name={name}
      handleNameChange={handleNameChange}
      details={details}
      handleDetailsChange={handleDetailsChange}
      handleShuffle={() => {
        alert('Shuffle name');
      }}
      // Goal
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
      // Window
      selectedTimeWindow={selectedTimeWindow}
      handleSelectedTimeWindowChange={setSelectedTimeWindow}
      customDate={customDate}
      handleCustomDateChange={setCustomDate}
      customTime={customTime}
      handleCustomTimeChange={setCustomTime}
      formattedWindowEndTime="Jan 1, 2023 11:59pm PST"
      {...args}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {};
