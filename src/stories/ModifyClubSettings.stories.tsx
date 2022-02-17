import { ModifyClubSettings } from "@/components/modifyClub";
import { Provider } from 'react-redux';
import { store } from "@/state/index";

export default {
  title: "Molecules/Modify Club Settings/Settings Modal",
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

const Template = (args) =>
    <div className="grid grid-cols-12 gap-5">
        <div className="md:col-start-1 md:col-end-7 col-span-12 text-white">
            <ModifyClubSettings {...args}>Child</ModifyClubSettings>
        </div>
    </div>

export const Default = Template.bind({});
Default.args = {
    isVisible: true,
};