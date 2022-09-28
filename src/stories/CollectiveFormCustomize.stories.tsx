import { CollectiveFormCustomize } from '@/components/collectives/create/customize';
import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';
import { useState } from 'react';

export default {
  title: '4. Organisms/Collectives/Create/Customize'
};

const Template = (args: any) => {
  const [selectedMembershipType, setSelectedMembershipType] = useState(null);
  const [selectedTimeWindow, setSelectedTimeWindow] = useState(null);
  const [priceToJoin, setPriceToJoin] = useState(null);
  const [allowOwnershipTransfer, setAllowOwnershipTransfer] = useState(true);
  const [maxPerWallet, setMaxPerWallet] = useState(null);
  const [maxMembers, setMaxMembers] = useState(null);
  const [maxSupply, setMaxSupply] = useState(null);
  const [closeDate, setCloseDate] = useState(null);
  const [closeTime, setCloseTime] = useState(null);

  return (
    <CollectiveFormCustomize
      selectedMembershipType={selectedMembershipType}
      handleMembershipTypeChange={setSelectedMembershipType}
      selectedTimeWindow={selectedTimeWindow}
      handleTimeWindowChange={setSelectedTimeWindow}
      priceToJoin={priceToJoin}
      handlePriceToJoinChange={setPriceToJoin}
      allowOwnershipTransfer={allowOwnershipTransfer}
      handleChangeAllowOwnershipTransfer={setAllowOwnershipTransfer}
      maxPerWallet={maxPerWallet}
      handleMaxPerWalletChange={setMaxPerWallet}
      maxMembers={maxMembers}
      handleMaxMembersChange={setMaxMembers}
      maxSupply={maxSupply}
      handleMaxSupplyChange={setMaxSupply}
      closeDate={closeDate}
      handleCloseDateChange={setCloseDate}
      closeTime={closeTime}
      handleCloseTimeChange={setCloseTime}
      {...args}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  openUntil: OpenUntil.FUTURE_DATE,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleOpenUntilChange: () => {},
  isContinueButtonActive: false,
  tokenDetails: { symbol: 'ETH', icon: '/images/chains/ethereum.svg' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleClickToChangeToken: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleContinue: () => {}
};
