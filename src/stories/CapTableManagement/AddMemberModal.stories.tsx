import AddMemberModal from '@/containers/managerActions/mintAndShareTokens/AddMemberModal';
import { Provider } from 'react-redux';
import { store } from '@/state/index';

export default {
  title: '4. Organisms/Cap Table Management/Modals/Add Member/Add Member Modal',
  parameters: {
    nextRouter: {
      query: {
        clubAddress: '0xA596dd3bC192990174fF2eC7f844f4225e20f61b'
      }
    }
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    )
  ]
};

const Template = (args) => <AddMemberModal {...args} />;

export const Default = Template.bind({});
Default.args = {
  showModal: true
};
