import { CollectivesCreateSuccess } from '@/components/collectives/create/success';

export default {
  title: '4. Organisms/Collectives/Create/Success'
};

const Template = (args: any) => {
  return <CollectivesCreateSuccess {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  name: 'Alpha Beta Club',
  inviteLink: 'https://syndicate.io/mint/01234567890',
  CTAonClick: () => {
    null;
  },
  etherscanLink: 'http://etherscan.io'
};
