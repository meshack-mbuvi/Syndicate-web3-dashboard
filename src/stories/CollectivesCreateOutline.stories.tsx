import { CollectivesCreateOutline } from '@/components/collectives/createOutline';

export default {
  title: '4. Organisms/Collectives/Create Outline'
};

const Template = (args) => {
  return <CollectivesCreateOutline {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  gasEstimate: {
    amount: 123,
    tokenName: 'ETH',
    fiatAmount: 456
  }
};
