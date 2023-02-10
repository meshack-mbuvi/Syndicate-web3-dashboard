import { CollectivesCreateOutline } from '@/components/collectives/createOutline';

export default {
  title: 'Organisms/Collectives/Create Outline'
};

const Template = (args: any) => {
  return <CollectivesCreateOutline {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  gasEstimate: {
    amount: 123,
    tokenName: 'ETH',
    fiatAmount: 456
  }
};
