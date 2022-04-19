import TokenItemDetails, {
  TokenDetailsProps
} from "@/components/tokenSelect/TokenItemDetails";
import { Provider } from "react-redux";
import { store } from "@/state/index";
import { Story } from "@storybook/react";

export default {
  title: "Atoms/Token Item Details",
  component: TokenItemDetails,
  decorators: [
    (Story: React.FC): React.ReactElement => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

const Template: Story<TokenDetailsProps> = (args) => (
  <div className="max-w-564 mx-auto align-middle">
    <TokenItemDetails {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  symbol: "ETH",
  name: "Ethereum",
  logoURI: "/images/ethereum-logo.png",
  showCheckMark: false,
};

export const Selected = Template.bind({});
Selected.args = {
  symbol: "ETH",
  name: "Ethereum",
  logoURI: "/images/ethereum-logo.png",
  showCheckMark: true,
};
