import { CollectivesCreateSuccess } from '@/components/collectives/create/success';
import { Provider } from 'react-redux';
import { store } from '@/state';

export default {
  title: 'Organisms/Collectives/Create/Success',
  decorators: [
    (Story: any) => (
      <Provider store={store}>
        <Story />
      </Provider>
    )
  ]
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
