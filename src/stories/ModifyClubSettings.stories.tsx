import { ModifyClubSettings } from '@/components/modifyClub';
import { store } from '@/state/index';
import { Provider } from 'react-redux';

export default {
  title: 'Organisms/Modify Club Settings/Settings Modal',
  parameters: {
    nextRouter: {
      query: {
        clubAddress: 'clubAddress'
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

const Template = (args: any) => (
  <div className="grid grid-cols-12 gap-5">
    <div className="md:col-start-1 md:col-end-7 col-span-12 text-white">
      <ModifyClubSettings {...args}>Child</ModifyClubSettings>
    </div>
  </div>
);

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  isVisible: true
};
