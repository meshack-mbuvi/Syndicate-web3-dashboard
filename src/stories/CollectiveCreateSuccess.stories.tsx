import { CollectivesCreateSuccess } from '@/components/collectives/create/success';

export default {
  title: '4. Organisms/Collectives/Create/Success'
};

const Template = (args) => {
  return <CollectivesCreateSuccess {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  name: 'Alpha Beta Club',
  inviteLink: 'https://syndicate.io/mint/01234567890',
  CTAonClick: () => {
    null;
  },
  etherscanLink: 'http://etherscan.io'
};
