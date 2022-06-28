import { CollectiveFormCustomize } from '@/components/collectives/create/customize';
import { useState } from 'react';

export default {
  title: '4. Organisms/Collectives/Create/Customize'
};

const Template = (args) => {
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
Default.args = {
  isContinueButtonActive: false,
  tokenDetails: { symbol: 'ETH', icon: '/images/chains/ethereum.svg' }
};
