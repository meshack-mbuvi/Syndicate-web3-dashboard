import { CollectiveCard } from '@/components/collectives/card';
import { CollectiveCardType } from '@/state/collectiveDetails/types';

export default {
  title: '3. Molecules/Collectives/Card'
};

const Template = (args) => {
  return <CollectiveCard {...args} />;
};

export const TimeWindow = Template.bind({});
TimeWindow.args = {
  cardType: CollectiveCardType.TIME_WINDOW,
  closeDate: 'Jun 11, 2021',
  passes: { available: 1200, total: 4000 },
  price: {
    tokenAmount: 0.5,
    tokenSymbol: 'ETH',
    tokenIcon: '/images/chains/ethereum.svg'
  }
};

export const MaxSupply = Template.bind({});
MaxSupply.args = {
  cardType: CollectiveCardType.MAX_TOTAL_SUPPLY,
  closeDate: 'Jun 11, 2021',
  passes: { available: 1200, total: 4000 },
  price: {
    tokenAmount: 0.5,
    tokenSymbol: 'ETH',
    tokenIcon: '/images/chains/ethereum.svg'
  }
};

export const Free = Template.bind({});
Free.args = {
  cardType: CollectiveCardType.OPEN_UNTIL_CLOSED,
  closeDate: 'Jun 11, 2021',
  passes: { available: 1200, total: 4000 },
  price: {
    tokenAmount: 0.5,
    tokenSymbol: 'ETH',
    tokenIcon: '/images/chains/ethereum.svg'
  }
};
