import AddMemberModal from '@/containers/managerActions/mintAndShareTokens/AddMemberModal';
import { Provider } from 'react-redux';
import { store } from '@/state/index';

export default {
  title: 'Organisms/Cap Table Management/Modals/Add Member/Add Member Modal',
  parameters: {
    nextRouter: {
      query: {
        clubAddress: '0xA596dd3bC192990174fF2eC7f844f4225e20f61b'
      }
    }
  },
  decorators: [
    (Story: any) => (
      <Provider store={store}>
        <Story />
      </Provider>
    )
  ]
};

const Template = (args: any) => <AddMemberModal {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  showModal: true
};
