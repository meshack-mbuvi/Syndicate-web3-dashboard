import { Provider } from "react-redux";
import { store } from "@/state/index";
import TokenSelectModal from "@/components/tokenSelect/TokenSelectModal";
import { useArgs } from "@storybook/addons";

export default {
  title: "Molecules/Token Select Modal",
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

const Template = (args) => {
  const [{ showModal }, updateArgs] = useArgs();
  return (
    <TokenSelectModal
      {...args}
      closeModal={() => updateArgs({ showModal: !showModal })}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  showModal: true,
};

export const WithRecentlyUsed = Template.bind({});
WithRecentlyUsed.args = {
  showModal: true,
  hasRecentlyUsed: true,
};