import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';
import { TimeWindow } from '@/components/collectives/create/inputs/timeWindow';
import { CollectiveFormReview as CollectiveFormReview } from '@/components/collectives/create/review';
import { useState } from 'react';

export default {
  title: '4. Organisms/Collectives/Create/Review',
  isFullscreen: true
};

const Template = (args) => {
  const [nameValue, setNameValue] = useState('Alpha Beta Punks');
  const [tokenValue, setTokenValue] = useState('ABP');
  const [priceToJoin, setPriceToJoin] = useState(4);
  const [maxPerWallet, setMaxPerWallet] = useState(123);
  const [openUntil, setOpenUntil] = useState(OpenUntil.FUTURE_DATE);
  const [closeDate, setCloseDate] = useState(new Date());
  const [closeTime, setCloseTime] = useState('00:00');
  const [timeWindow, setTimeWindow] = useState(TimeWindow.CUSTOM);
  const [allowOwnershipTransfer, setAllowOwnershipTransfer] = useState(true);

  return (
    <CollectiveFormReview
      nameValue={nameValue}
      handleNameChange={setNameValue}
      tokenSymbolValue={tokenValue}
      handleTokenSymbolChange={setTokenValue}
      priceToJoin={priceToJoin}
      handlePriceToJoinChange={setPriceToJoin}
      handleClickToChangeToken={null}
      maxPerWallet={maxPerWallet}
      handleMaxPerWalletChange={setMaxPerWallet}
      openUntil={openUntil}
      setOpenUntil={setOpenUntil}
      closeDate={closeDate}
      handleCloseDateChange={setCloseDate}
      closeTime={closeTime}
      handleCloseTimeChange={setCloseTime}
      selectedTimeWindow={timeWindow}
      handleTimeWindowChange={setTimeWindow}
      endOfTimeWindow={'Jun 11, 2021 11:59pm PST'}
      allowOwnershipTransfer={allowOwnershipTransfer}
      handleChangeAllowOwnershipTransfer={setAllowOwnershipTransfer}
      {...args}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  tokenDetails: { symbol: 'ETH', icon: '/images/chains/ethereum.svg' }
};